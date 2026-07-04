const express = require('express');
const cors = require('cors');
require('dotenv').config();

BigInt.prototype.toJSON = function () {
    return this.toString();
};

// Import your routes
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.send('RTO Ledger Backend is running');
});

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
