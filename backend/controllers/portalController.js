const prisma = require('../prismaClient');

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
        const { vehicle_id, service_id, amount, remarks } = req.body;

        // Verify vehicle belongs to this customer
        const vehicle = await prisma.vehicles.findFirst({
            where: { id: BigInt(vehicle_id), customer_id: customerId }
        });
        if (!vehicle) return res.status(403).json({ error: "Invalid vehicle selection" });

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
        await prisma.ledgers.create({
            data: {
                customer_id: customerId,
                vehicle_id: BigInt(vehicle_id),
                service_request_id: newRequest.id,
                service_fee: amount || 0,
                amount_paid: 0,
                due_amount: amount || 0,
                status: 'Pending'
            }
        });

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
    deleteVehicle
};
