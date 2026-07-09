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


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/servicerequests', serviceRequestRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);


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
