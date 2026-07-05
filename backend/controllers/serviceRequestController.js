const prisma = require("../prismaClient");

const getServiceRequests = async (req, res) => {
    try {
        const requests = await prisma.service_requests.findMany({
            include: {
                customers: {
                    select: { name: true }
                },
                vehicles: {
                    select: { vehicle_number: true }
                },
                services: {
                    select: { service_name: true }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createServiceRequest = async (req, res) => {
    try {
        const { request_no, customer_id, vehicle_id, service_id, amount, status, remarks, payment_method, amount_paid } = req.body;
        
        // 1. Create the Service Request
        const newRequest = await prisma.service_requests.create({
            data: {
                request_no,
                customer_id: BigInt(customer_id),
                vehicle_id: BigInt(vehicle_id),
                service_id: BigInt(service_id),
                amount: parseFloat(amount),
                status: status || 'Pending',
                remarks
            },
            include: {
                customers: { select: { name: true } },
                vehicles: { select: { vehicle_number: true } },
                services: { select: { service_name: true } }
            }
        });

        // 2. Calculate Ledger details
        const fee = parseFloat(amount) || 0;
        const paid = payment_method === 'Pay Later (Unpaid)' ? 0 : (parseFloat(amount_paid) || 0);
        const due = fee - paid > 0 ? fee - paid : 0;
        
        let ledgerStatus = 'Pending';
        if (paid >= fee && fee > 0) {
            ledgerStatus = 'Paid';
        } else if (paid > 0 && paid < fee) {
            ledgerStatus = 'Partial';
        }

        // 3. Create ledger entry
        await prisma.ledgers.create({
            data: {
                customer_id: BigInt(customer_id),
                vehicle_id: BigInt(vehicle_id),
                service_request_id: newRequest.id,
                service_fee: fee,
                amount_paid: paid,
                due_amount: due,
                status: ledgerStatus
            }
        });

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateServiceRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_id, vehicle_id, service_id, amount, status, remarks } = req.body;
        const updatedRequest = await prisma.service_requests.update({
            where: { id: BigInt(id) },
            data: {
                customer_id: BigInt(customer_id),
                vehicle_id: BigInt(vehicle_id),
                service_id: BigInt(service_id),
                amount: parseFloat(amount),
                status,
                remarks
            },
            include: {
                customers: { select: { name: true } },
                vehicles: { select: { vehicle_number: true } },
                services: { select: { service_name: true } }
            }
        });
        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteServiceRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.service_requests.delete({
            where: { id: BigInt(id) }
        });
        res.json({ message: "Service request deleted successfully" });
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ error: "Cannot delete this service request because it is linked to a ledger record. Delete the ledger record first." });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getServiceRequests, createServiceRequest, updateServiceRequest, deleteServiceRequest };