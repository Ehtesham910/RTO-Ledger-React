const prisma = require('../prismaClient');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { generateReceiptNo } = require('./receiptController');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Helper for BigInt serialization
BigInt.prototype.toJSON = function () { return this.toString(); };

// Dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        
        const [vehiclesCount, requestsCount, pendingRequestsCount, completedRequestsCount, ledgers] = await Promise.all([
            prisma.vehicles.count({ where: { customer_id: customerId, is_active: true } }),
            prisma.service_requests.count({ where: { customer_id: customerId } }),
            prisma.service_requests.count({ where: { customer_id: customerId, status: 'Pending' } }),
            prisma.service_requests.count({ where: { customer_id: customerId, status: 'Completed' } }),
            prisma.ledgers.findMany({ where: { customer_id: customerId } })
        ]);

        const totalDue = ledgers.reduce((acc, curr) => acc + parseFloat(curr.due_amount || 0), 0);
        const totalPaid = ledgers.reduce((acc, curr) => acc + parseFloat(curr.amount_paid || 0), 0);

        res.json({
            vehiclesCount,
            requestsCount,
            pendingRequestsCount,
            completedRequestsCount,
            totalDue,
            totalPaid
        });
    } catch (error) {
        console.error("Error fetching portal dashboard stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Vehicles
const getVehicles = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const vehicles = await prisma.vehicles.findMany({
            where: { customer_id: customerId },
            orderBy: { created_at: 'desc' }
        });
        res.json(vehicles);
    } catch (error) {
        console.error("Error fetching portal vehicles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const addVehicle = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const { vehicle_number, vehicle_type, chassis_number, engine_number, registration_date, driver_name, driver_mobile } = req.body;

        const newVehicle = await prisma.vehicles.create({
            data: {
                customer_id: customerId,
                vehicle_number: vehicle_number.toUpperCase(),
                vehicle_type,
                chassis_number,
                engine_number,
                registration_date: registration_date ? new Date(registration_date) : null,
                driver_name,
                driver_mobile
            }
        });
        res.status(201).json(newVehicle);
    } catch (error) {
        console.error("Error adding vehicle from portal:", error);
        res.status(500).json({ error: "Failed to add vehicle" });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const vehicleId = BigInt(req.params.id);
        const { vehicle_number, vehicle_type, chassis_number, engine_number, registration_date, driver_name, driver_mobile } = req.body;

        // Ensure vehicle belongs to customer
        const existingVehicle = await prisma.vehicles.findFirst({
            where: { id: vehicleId, customer_id: customerId }
        });

        if (!existingVehicle) {
            return res.status(404).json({ error: "Vehicle not found or unauthorized" });
        }

        const updatedVehicle = await prisma.vehicles.update({
            where: { id: vehicleId },
            data: {
                vehicle_number: vehicle_number.toUpperCase(),
                vehicle_type,
                chassis_number,
                engine_number,
                registration_date: registration_date ? new Date(registration_date) : null,
                driver_name,
                driver_mobile
            }
        });
        res.json(updatedVehicle);
    } catch (error) {
        console.error("Error updating vehicle from portal:", error);
        res.status(500).json({ error: "Failed to update vehicle" });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const vehicleId = BigInt(req.params.id);

        // Ensure vehicle belongs to customer
        const existingVehicle = await prisma.vehicles.findFirst({
            where: { id: vehicleId, customer_id: customerId }
        });

        if (!existingVehicle) {
            return res.status(404).json({ error: "Vehicle not found or unauthorized" });
        }

        await prisma.vehicles.delete({
            where: { id: vehicleId }
        });

        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error("Error deleting vehicle from portal:", error);
        res.status(500).json({ error: "Failed to delete vehicle" });
    }
};

// Services
const getServiceRequests = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const requests = await prisma.service_requests.findMany({
            where: { customer_id: customerId },
            include: {
                vehicles: { select: { vehicle_number: true } },
                services: { select: { service_name: true } },
                ledgers: { select: { due_amount: true, status: true } }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        console.error("Error fetching portal requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const addServiceRequest = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const { vehicle_id, service_id, amount, remarks, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount_paid } = req.body;

        // Verify Razorpay signature if payment was made
        let isPaid = false;
        if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
            const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
            shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
            const digest = shasum.digest('hex');

            if (digest !== razorpay_signature) {
                return res.status(400).json({ error: "Invalid payment signature" });
            }
            isPaid = true;
        }

        // Verify vehicle belongs to this customer
        const vehicle = await prisma.vehicles.findFirst({
            where: { id: BigInt(vehicle_id), customer_id: customerId }
        });
        if (!vehicle) return res.status(403).json({ error: "Invalid vehicle selection" });

        // Check for existing pending request
        const existingPendingRequest = await prisma.service_requests.findFirst({
            where: {
                customer_id: customerId,
                vehicle_id: BigInt(vehicle_id),
                service_id: BigInt(service_id),
                status: {
                    notIn: ['Completed', 'Cancelled', 'Rejected']
                }
            }
        });
        
        if (existingPendingRequest) {
            return res.status(400).json({ 
                error: "Duplicate pending request", 
                message: "This service request has already been submitted and is currently pending. You cannot submit a new request." 
            });
        }

        // Generate request number
        const maxReq = await prisma.service_requests.findFirst({ orderBy: { id: 'desc' } });
        let maxNum = 0;
        if (maxReq && maxReq.request_no && maxReq.request_no.startsWith('REQ-')) {
            const numPart = parseInt(maxReq.request_no.replace('REQ-', ''), 10);
            if (!isNaN(numPart)) maxNum = numPart;
        }
        const request_no = `REQ-${(maxNum + 1).toString().padStart(4, '0')}`;

        const newRequest = await prisma.service_requests.create({
            data: {
                request_no,
                customer_id: customerId,
                vehicle_id: BigInt(vehicle_id),
                service_id: BigInt(service_id),
                amount: amount || 0,
                status: 'Pending',
                remarks
            }
        });

        // Auto-create ledger entry
        const actualFee = parseFloat(amount) || 0;
        const actualPaid = isPaid ? parseFloat(amount_paid || 0) : 0;
        const due = actualFee - actualPaid;

        let ledgerStatus = 'Pending';
        if (actualPaid >= actualFee && actualFee > 0) {
            ledgerStatus = 'Paid';
        } else if (actualPaid > 0 && actualPaid < actualFee) {
            ledgerStatus = 'Partial';
        }

        const newLedger = await prisma.ledgers.create({
            data: {
                customer_id: customerId,
                vehicle_id: BigInt(vehicle_id),
                service_request_id: newRequest.id,
                service_fee: actualFee,
                amount_paid: actualPaid,
                due_amount: due > 0 ? due : 0,
                status: ledgerStatus
            }
        });

        // If payment was made, generate a receipt
        if (isPaid && actualPaid > 0) {
            const receiptNo = await generateReceiptNo();
            await prisma.receipts.create({
                data: {
                    receipt_no: receiptNo,
                    ledger_id: newLedger.id,
                    amount_received: actualPaid,
                    payment_mode: 'Online',
                    transaction_reference: razorpay_payment_id,
                    remarks: 'Paid via Razorpay Customer Portal'
                }
            });
        }

        res.status(201).json(newRequest);
    } catch (error) {
        console.error("Error adding service request from portal:", error);
        res.status(500).json({ error: "Failed to add service request" });
    }
};

// Ledger
const getLedger = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const ledgers = await prisma.ledgers.findMany({
            where: { customer_id: customerId },
            include: {
                vehicles: { select: { vehicle_number: true } },
                service_requests: {
                    select: {
                        request_no: true,
                        services: { select: { service_name: true } }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(ledgers);
    } catch (error) {
        console.error("Error fetching portal ledger:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Receipts
const getReceipts = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const receipts = await prisma.receipts.findMany({
            where: { ledgers: { customer_id: customerId } },
            include: {
                ledgers: {
                    include: {
                        vehicles: { select: { vehicle_number: true, chassis_number: true, engine_number: true } },
                        service_requests: { include: { services: true } },
                        customers: { select: { name: true, customer_code: true, mobile: true } }
                    }
                },
                users: { select: { username: true } }
            },
            orderBy: { received_at: 'desc' }
        });
        res.json(receipts);
    } catch (error) {
        console.error("Error fetching portal receipts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Active Services Dropdown for Portal Add Request
const getActiveServices = async (req, res) => {
    try {
        const services = await prisma.services.findMany({
            where: { is_active: true },
            orderBy: { service_name: 'asc' }
        });
        res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Portal Search
const getPortalSearch = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.json({ vehicles: [], serviceRequests: [], receipts: [] });
        }

        const query = q.trim();

        // Matching vehicles for this customer
        const vehicles = await prisma.vehicles.findMany({
            where: {
                customer_id: customerId,
                OR: [
                    { vehicle_number: { contains: query, mode: 'insensitive' } },
                    { chassis_number: { contains: query, mode: 'insensitive' } },
                    { engine_number: { contains: query, mode: 'insensitive' } },
                    { driver_name: { contains: query, mode: 'insensitive' } }
                ]
            }
        });

        // Matching service requests for this customer
        const serviceRequests = await prisma.service_requests.findMany({
            where: {
                customer_id: customerId,
                OR: [
                    { request_no: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: { 
                vehicles: { select: { vehicle_number: true } },
                services: { select: { service_name: true } }
            }
        });

        // Matching receipts for this customer
        const receipts = await prisma.receipts.findMany({
            where: {
                ledgers: { customer_id: customerId },
                OR: [
                    { receipt_no: { contains: query, mode: 'insensitive' } },
                    { transaction_reference: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                ledgers: {
                    include: {
                        vehicles: { select: { vehicle_number: true } },
                        service_requests: { include: { services: true } }
                    }
                }
            }
        });

        res.json({
            vehicles,
            serviceRequests,
            receipts
        });
    } catch (error) {
        console.error("Error in portal search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
    try {
        const customerId = BigInt(req.user.id);
        const { amount, vehicle_id, service_id } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // If vehicle_id and service_id are provided, validate for duplicates
        if (vehicle_id && service_id) {
            const existingPendingRequest = await prisma.service_requests.findFirst({
                where: {
                    customer_id: customerId,
                    vehicle_id: BigInt(vehicle_id),
                    service_id: BigInt(service_id),
                    status: {
                        notIn: ['Completed', 'Cancelled', 'Rejected']
                    }
                }
            });
            
            if (existingPendingRequest) {
                return res.status(400).json({ 
                    error: "Duplicate pending request", 
                    message: "This service request has already been submitted and is currently pending. You cannot submit a new request." 
                });
            }
        }

        const options = {
            amount: Math.round(parseFloat(amount) * 100), // amount in the smallest currency unit
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
};

module.exports = {
    getDashboardStats,
    getVehicles,
    addVehicle,
    getServiceRequests,
    addServiceRequest,
    getLedger,
    getReceipts,
    getActiveServices,
    updateVehicle,
    deleteVehicle,
    getPortalSearch,
    createRazorpayOrder
};
