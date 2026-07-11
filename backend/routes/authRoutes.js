const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/customer-login', authController.customerLogin);
router.post('/customer-register', authController.customerRegister);

module.exports = router;
