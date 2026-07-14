const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const JWT_SECRET = process.env.JWT_SECRET || 'rto_ledger_secret_key_123!';

const verifyToken = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: "A token is required for authentication" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // add user to request
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token" });
    }
    
    return next();
};

// Middleware to check for specific roles (optional for future use)
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        next();
    };
};

const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            // Let Customer through if they are accessing their own stuff (handled by route logic)
            // But if this middleware is applied, it means it's an admin/staff route.
            if (req.user.role === 'Admin') return next(); // Admin always allowed

            if (req.user.role === 'Customer') return res.status(403).json({ error: "Customers cannot access this endpoint" });

            const user = await prisma.users.findUnique({
                where: { id: BigInt(req.user.id) },
                include: { 
                    roles: { include: { role_permissions: { include: { permissions: true } } } },
                    user_permissions: { include: { permissions: true } }
                }
            });

            if (!user) return res.status(403).json({ error: "User not found" });

            let perms = [];
            if (user.roles?.role_permissions) {
                user.roles.role_permissions.forEach(rp => {
                    if (rp.permissions) perms.push(rp.permissions.code);
                });
            }
            if (user.user_permissions) {
                user.user_permissions.forEach(up => {
                    if (up.permissions) perms.push(up.permissions.code);
                });
            }

            const hasPerm = requiredPermissions.some(p => perms.includes(p));
            if (!hasPerm) return res.status(403).json({ error: "Insufficient permissions" });
            
            next();
        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({ error: "Server error checking permissions" });
        }
    };
};

module.exports = {
    verifyToken,
    checkRole,
    checkPermission
};
