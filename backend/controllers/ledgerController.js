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

const updateLedger = async (req, res) => {
    try {
        const { id } = req.params;
        const { service_fee, amount_paid, due_amount, status, payment_mode } = req.body;
        
        const updatedRecord = await prisma.ledgers.update({
            where: { id: BigInt(id) },
            data: {
                service_fee: parseFloat(service_fee),
                amount_paid: parseFloat(amount_paid),
                due_amount: parseFloat(due_amount),
                status
            },
            include: {
                customers: { select: { name: true, customer_code: true } },
                vehicles: { select: { vehicle_number: true } },
                service_requests: { select: { request_no: true, services: { select: { service_name: true } } } }
            }
        });
        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getLedger, updateLedger };
