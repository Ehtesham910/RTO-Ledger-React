const prisma = require("../prismaClient");
const { generateReceiptNo } = require("./receiptController");

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
        
        // Fetch the existing record to check if amount_paid has increased
        const existingRecord = await prisma.ledgers.findUnique({
            where: { id: BigInt(id) }
        });
        
        if (!existingRecord) {
            return res.status(404).json({ error: "Ledger record not found" });
        }
        
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
        
        const previousPaid = parseFloat(existingRecord.amount_paid || 0);
        const newPaid = parseFloat(amount_paid) || 0;
        const difference = newPaid - previousPaid;
        
        if (difference > 0) {
            const defaultUser = await prisma.users.findFirst();
            const receivedByUserId = defaultUser ? defaultUser.id : null;
            const receiptNo = await generateReceiptNo();
            
            await prisma.receipts.create({
                data: {
                    receipt_no: receiptNo,
                    ledger_id: BigInt(id),
                    amount_received: difference,
                    payment_mode: payment_mode || 'Cash',
                    transaction_reference: null,
                    remarks: "Payment updated in ledger",
                    received_by: receivedByUserId
                }
            });
        }
        
        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCustomerLedger = async (req, res) => {
    try {
        const { id } = req.params;
        const ledgerRecords = await prisma.ledgers.findMany({
            where: { customer_id: BigInt(id) },
            include: {
                customers: {
                    select: { name: true, customer_code: true }
                },
                vehicles: {
                    select: { vehicle_number: true }
                },
                service_requests: {
                    select: { 
                        request_no: true,
                        services: { select: { service_name: true } }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(ledgerRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getLedger, updateLedger, getCustomerLedger };
