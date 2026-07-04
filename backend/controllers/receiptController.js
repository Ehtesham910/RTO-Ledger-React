const prisma = require("../prismaClient");

const getReceipts = async (req, res) => {
    try {
        const receiptRecords = await prisma.receipts.findMany({
            include: {
                ledgers: {
                    include: {
                        customers: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: {
                received_at: 'desc'
            }
        });
        res.json(receiptRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getReceipts };
