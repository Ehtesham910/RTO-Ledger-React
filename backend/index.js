const express = require('express');
const cors = require('cors');
require('dotenv').config();

BigInt.prototype.toJSON = function () {
    return this.toString();
};

// Import your routes
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Auth Routes (Public)
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/customers', verifyToken, customerRoutes);
app.use('/api/vehicles', verifyToken, vehicleRoutes);
app.use('/api/services', verifyToken, serviceRoutes);
app.use('/api/servicerequests', verifyToken, serviceRequestRoutes);
app.use('/api/ledger', verifyToken, ledgerRoutes);
app.use('/api/receipts', verifyToken, receiptRoutes);
app.use('/api/roles', verifyToken, roleRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);


// Basic test route
app.get('/', (req, res) => {
    res.send('RTO Ledger Backend is running');
});

const seedDatabase = require('./dbSeed');
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await seedDatabase();
});

// Triggering restart to clear DB connections
