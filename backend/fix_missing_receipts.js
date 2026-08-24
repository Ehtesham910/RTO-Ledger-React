const prisma = require('./prismaClient');
const { generateReceiptNo } = require('./controllers/receiptController');

BigInt.prototype.toJSON = function () { return this.toString(); };

async function fixMissingReceipts() {
    try {
        console.log("Checking for ledgers with payments missing receipts...");
        const paidLedgers = await prisma.ledgers.findMany({
            where: {
                amount_paid: { gt: 0 }
            },
            include: {
                receipts: true,
                customers: true
            }
        });

        let generatedCount = 0;

        for (const ledger of paidLedgers) {
            if (!ledger.receipts || ledger.receipts.length === 0) {
                const paidAmount = parseFloat(ledger.amount_paid?.toString() || '0');
                if (paidAmount > 0) {
                    const defaultUser = await prisma.users.findFirst();
                    const receivedByUserId = defaultUser ? defaultUser.id : null;
                    const receiptNo = await generateReceiptNo();

                    await prisma.receipts.create({
                        data: {
                            receipt_no: receiptNo,
                            ledger_id: ledger.id,
                            amount_received: paidAmount,
                            payment_mode: 'Cash',
                            remarks: ledger.status === 'Paid' ? 'Full payment receipt (Auto-repaired)' : 'Payment receipt (Auto-repaired)',
                            received_by: receivedByUserId
                        }
                    });
                    console.log(`Generated receipt ${receiptNo} for Ledger ID ${ledger.id} (${ledger.customers?.name || 'Customer'}) - Amount ₹${paidAmount}`);
                    generatedCount++;
                }
            }
        }

        console.log(`Completed. Successfully generated ${generatedCount} missing receipts.`);
    } catch (error) {
        console.error("Error fixing missing receipts:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fixMissingReceipts();
