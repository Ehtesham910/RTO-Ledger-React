const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

// Since bigint is not automatically serializable by JSON, let's add a helper
BigInt.prototype.toJSON = function () { return this.toString(); };

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'rto_ledger_secret_key_123!';

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Find user
        const user = await prisma.users.findUnique({
            where: { username },
            include: { roles: true }
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        if (!user.is_active) {
            return res.status(403).json({ error: "Account is inactive" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { 
                id: user.id.toString(), 
                username: user.username,
                role: user.roles ? user.roles.name : 'user'
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id.toString(),
                username: user.username,
                email: user.email,
                role: user.roles ? user.roles.name : 'user'
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error during login" });
    }
};

module.exports = {
    login
};
