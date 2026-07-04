const express = require('express');
const router = express.Router();
const { getReceipts } = require('../controllers/receiptController');

router.get('/', getReceipts);

module.exports = router;
