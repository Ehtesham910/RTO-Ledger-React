const prisma = require("../prismaClient");

const getLedger = async (req, res) => {
    try {
        const ledgerRecords = await prisma.ledgers.findMany({
            include: {
                customers: {
                    select: { 
                        name: true,
                        customer_code: true
                    }
                },
                vehicles: {
                    select: { vehicle_number: true }
                },
                service_requests: {
                    select: { 
                        request_no: true,
                        services: {
                            select: { service_name: true }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        res.json(ledgerRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getLedger };
