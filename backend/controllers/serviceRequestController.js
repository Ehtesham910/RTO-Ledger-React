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
                created_at: 'desc'
            }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getServiceRequests };