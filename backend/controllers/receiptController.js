const prisma = require("../prismaClient");

const getReceiptById = async (req, res) => {
    try {
        const { id } = req.params;
        const receiptRecord = await prisma.receipts.findUnique({
            where: { id: BigInt(id) },
            include: {
                ledgers: {
                    include: {
                        customers: true,
                        vehicles: true,
                        service_requests: {
                            include: {
                                services: true
                            }
                        }
                    }
                },
                users: {
                    select: { username: true }
                }
            }
        });

        if (!receiptRecord) {
            return res.status(404).json({ error: "Receipt not found" });
        }

        res.json(receiptRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReceipts = async (req, res) => {
    try {
        const receiptRecords = await prisma.receipts.findMany({
            include: {
                ledgers: {
                    include: {
                        customers: true,
                        vehicles: true,
                        service_requests: {
                            include: {
                                services: true
                            }
                        }
                    }
                },
                users: {
                    select: { username: true }
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

const generateReceiptNo = async () => {
    const lastReceipt = await prisma.receipts.findFirst({
        orderBy: { id: 'desc' }
    });
    if (!lastReceipt) return 'REC-0001';
    const lastNo = lastReceipt.receipt_no;
    const numMatch = String(lastNo).match(/\d+/);
    if (numMatch) {
        const nextNum = parseInt(numMatch[0], 10) + 1;
        return `REC-${nextNum.toString().padStart(4, '0')}`;
    }
    return `REC-${Date.now()}`;
};

const createReceipt = async (req, res) => {
    try {
        const { ledger_id, amount_received, payment_mode, transaction_reference, remarks } = req.body;

        if (!ledger_id) {
            return res.status(400).json({ error: "Ledger ID is required" });
        }

        const ledger = await prisma.ledgers.findUnique({
            where: { id: BigInt(ledger_id) }
        });

        if (!ledger) {
            return res.status(404).json({ error: "Ledger record not found" });
        }

        const defaultUser = await prisma.users.findFirst();
        const receivedByUserId = defaultUser ? defaultUser.id : null;

        const receiptNo = await generateReceiptNo();

        const receiptRecord = await prisma.receipts.create({
            data: {
                receipt_no: receiptNo,
                ledger_id: BigInt(ledger_id),
                amount_received: parseFloat(amount_received),
                payment_mode: payment_mode || 'Cash',
                transaction_reference: transaction_reference || null,
                remarks: remarks || null,
                received_by: receivedByUserId
            },
            include: {
                ledgers: {
                    include: {
                        customers: true,
                        vehicles: true,
                        service_requests: {
                            include: {
                                services: true
                            }
                        }
                    }
                },
                users: {
                    select: { username: true }
                }
            }
        });

        // Update the ledger details
        const fee = parseFloat(ledger.service_fee || 0);
        const currentPaid = parseFloat(ledger.amount_paid || 0);
        const addedPaid = parseFloat(amount_received) || 0;
        const newPaid = currentPaid + addedPaid;
        const due = fee - newPaid > 0 ? fee - newPaid : 0;

        let ledgerStatus = 'Pending';
        if (newPaid >= fee && fee > 0) {
            ledgerStatus = 'Paid';
        } else if (newPaid > 0 && newPaid < fee) {
            ledgerStatus = 'Partial';
        }

        await prisma.ledgers.update({
            where: { id: BigInt(ledger_id) },
            data: {
                amount_paid: newPaid,
                due_amount: due,
                status: ledgerStatus
            }
        });

        res.status(201).json(receiptRecord);
    } catch (error) {
        console.error("Error creating receipt:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getReceipts, getReceiptById, createReceipt, generateReceiptNo };
