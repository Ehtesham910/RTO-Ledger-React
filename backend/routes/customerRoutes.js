const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET /api/customers
router.get('/', customerController.getCustomers);

// PUT /api/customers/:id/status
router.put('/:id/status', customerController.updateCustomerStatus);

module.exports = router;
