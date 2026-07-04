const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// GET /api/vehicles
router.get('/', vehicleController.getVehicles);

// PUT /api/vehicles/:id/status
router.put('/:id/status', vehicleController.updateVehicleStatus);

module.exports = router;