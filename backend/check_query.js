const prisma = require('./prismaClient');
BigInt.prototype.toJSON = function () { return this.toString(); };
async function main() { 
    try {
        const customerId = BigInt(3); // Customer 3 has receipts
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
        console.log("Success! Found", receipts.length, "receipts");
    } catch(err) {
        console.error("Prisma Error:", err.message);
    }
} 
main().finally(() => prisma.$disconnect());
