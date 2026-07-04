const express = require('express');
const router = express.Router();
const { getServices, updateServiceStatus } = require('../controllers/serviceController');

router.get('/', getServices);
router.put('/:id/status', updateServiceStatus);

module.exports = router;
