const prisma = require('./prismaClient');
BigInt.prototype.toJSON = function () { return this.toString(); };
async function main() { 
    const receipts = await prisma.receipts.findMany({ include: { ledgers: true }}); 
    console.log(JSON.stringify(receipts, null, 2)); 
} 
main().finally(() => prisma.$disconnect());
