const prisma = require('./prismaClient');

BigInt.prototype.toJSON = function () { return this.toString(); };

async function getAllUsers() {
    try {
        const allUsers = await prisma.users.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                password_hash: true,
                roles: {
                    select: {
                        name: true
                    }
                }
            }
        });
        console.log(JSON.stringify(allUsers, null, 2));
    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

getAllUsers();
