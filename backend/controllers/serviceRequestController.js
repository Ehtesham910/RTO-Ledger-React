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
        const { request_no, customer_id, vehicle_id, service_id, amount, status, remarks } = req.body;
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
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getServiceRequests, createServiceRequest };