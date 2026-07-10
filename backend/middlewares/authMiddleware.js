const jwt = require('jsonwebtoken');

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

module.exports = {
    verifyToken,
    checkRole
};
