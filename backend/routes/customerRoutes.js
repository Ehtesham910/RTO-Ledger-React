const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET /api/customers
router.get('/', customerController.getCustomers);

module.exports = router;
