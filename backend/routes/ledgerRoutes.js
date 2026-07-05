const express = require('express');
const router = express.Router();
const { getLedger, updateLedger, getCustomerLedger } = require('../controllers/ledgerController');

router.get('/', getLedger);
router.get('/customer/:id', getCustomerLedger);
router.put('/:id', updateLedger);

module.exports = router;
