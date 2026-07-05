const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// GET /api/vehicles
router.get('/', vehicleController.getVehicles);

// POST /api/vehicles
router.post('/', vehicleController.createVehicle);

// PUT /api/vehicles/:id/status
router.put('/:id/status', vehicleController.updateVehicleStatus);

// PUT /api/vehicles/:id
router.put('/:id', vehicleController.updateVehicle);

module.exports = router;