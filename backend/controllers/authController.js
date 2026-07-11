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

const customerLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ error: "Mobile number and password are required" });
        }

        // Find customer
        const customer = await prisma.customers.findUnique({
            where: { mobile }
        });

        if (!customer) {
            return res.status(401).json({ error: "Invalid mobile number or password" });
        }

        if (!customer.is_active) {
            return res.status(403).json({ error: "Account is inactive" });
        }

        // Check password - handle both unhashed (plain text) and hashed for transition period
        let isMatch = false;
        
        if (customer.password && customer.password.startsWith('$2')) {
            // Hashed password
            isMatch = await bcrypt.compare(password, customer.password);
        } else {
            // Plain text comparison (or if it's the default 'customer123')
            isMatch = (password === customer.password || (!customer.password && password === 'customer123'));
        }

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid mobile number or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { 
                id: customer.id.toString(), 
                username: customer.name,
                role: 'Customer' // explicitly set role to Customer
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: customer.id.toString(),
                username: customer.name,
                mobile: customer.mobile,
                role: 'Customer'
            }
        });
    } catch (error) {
        console.error("Customer Login Error:", error);
        res.status(500).json({ error: "Internal server error during customer login" });
    }
};

const customerRegister = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;

        if (!name || !mobile || !password) {
            return res.status(400).json({ error: "Name, mobile, and password are required" });
        }

        // Check if customer already exists
        const existingCustomer = await prisma.customers.findUnique({
            where: { mobile }
        });

        if (existingCustomer) {
            return res.status(400).json({ error: "Mobile number is already registered" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine the next customer code
        const allCustomers = await prisma.customers.findMany({
            select: { customer_code: true }
        });
        
        let maxNum = 0;
        allCustomers.forEach(c => {
            if (c.customer_code) {
                const numMatch = String(c.customer_code).match(/\d+/);
                if (numMatch) {
                    const numPart = parseInt(numMatch[0], 10);
                    if (numPart > maxNum) {
                        maxNum = numPart;
                    }
                }
            }
        });
        
        if (maxNum === 0) {
            maxNum = allCustomers.length;
        }
        
        const nextNum = maxNum + 1;
        const nextCustomerCode = `CUST-${nextNum.toString().padStart(3, '0')}`;

        // Create the customer
        const customer = await prisma.customers.create({
            data: {
                name,
                mobile,
                email: email || null,
                password: hashedPassword,
                is_active: true,
                customer_code: nextCustomerCode
            }
        });

        // Generate JWT Token for auto-login
        const token = jwt.sign(
            { 
                id: customer.id.toString(), 
                username: customer.name,
                role: 'Customer'
            }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: customer.id.toString(),
                username: customer.name,
                mobile: customer.mobile,
                role: 'Customer'
            }
        });
    } catch (error) {
        console.error("Customer Registration Error:", error);
        res.status(500).json({ error: "Internal server error during registration" });
    }
};

module.exports = {
    login,
    customerLogin,
    customerRegister
};
