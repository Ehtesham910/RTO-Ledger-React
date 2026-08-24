const express = require('express');
const router = express.Router();
const { getLedger, updateLedger, getCustomerLedger, deleteLedger } = require('../controllers/ledgerController');

router.get('/', getLedger);
router.get('/customer/:id', getCustomerLedger);
router.put('/:id', updateLedger);
router.delete('/:id', deleteLedger);

module.exports = router;

