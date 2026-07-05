const express = require('express');
const router = express.Router();
const { getLedger, updateLedger } = require('../controllers/ledgerController');

router.get('/', getLedger);
router.put('/:id', updateLedger);

module.exports = router;
