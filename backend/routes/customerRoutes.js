const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET /api/customers
router.get('/', customerController.getCustomers);

// POST /api/customers (Create new customer)
router.post('/', customerController.createCustomer);

// PUT /api/customers/:id/status
router.put('/:id/status', customerController.updateCustomerStatus);

// PUT /api/customers/:id
router.put('/:id', customerController.updateCustomer);

// DELETE /api/customers/:id
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
