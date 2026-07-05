const express = require('express');
const router = express.Router();
const { getServices, updateServiceStatus, createService, updateService, deleteService } = require('../controllers/serviceController');

router.get('/', getServices);
router.post('/', createService);
router.put('/:id', updateService);
router.put('/:id/status', updateServiceStatus);
router.delete('/:id', deleteService);

module.exports = router;
