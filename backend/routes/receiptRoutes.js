const express = require('express');
const router = express.Router();
const { getReceipts, getReceiptById, createReceipt } = require('../controllers/receiptController');

router.get('/', getReceipts);
router.get('/:id', getReceiptById);
router.post('/', createReceipt);

module.exports = router;
