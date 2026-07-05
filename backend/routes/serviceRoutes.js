const express = require('express');
const router = express.Router();
const { getServices, updateServiceStatus, createService } = require('../controllers/serviceController');

router.get('/', getServices);
router.post('/', createService);
router.put('/:id/status', updateServiceStatus);

module.exports = router;
