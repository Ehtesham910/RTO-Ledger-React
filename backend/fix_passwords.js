const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

async function fixPlaintextPasswords() {
    try {
        const users = await prisma.users.findMany();
        let fixedCount = 0;
        
        for (const user of users) {
            // Check if password is not a bcrypt hash
            if (user.password_hash && !user.password_hash.startsWith('$2')) {
                console.log(`Fixing plaintext password for user: ${user.username}`);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password_hash, salt);
                
                await prisma.users.update({
                    where: { id: user.id },
                    data: { password_hash: hashedPassword }
                });
                fixedCount++;
            }
        }
        console.log(`Successfully fixed ${fixedCount} users with plaintext passwords.`);
    } catch (error) {
        console.error("Error updating users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fixPlaintextPasswords();
