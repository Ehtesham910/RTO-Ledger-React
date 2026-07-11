const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portalController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Dashboard
router.get('/dashboard', verifyToken, checkRole(['Customer']), portalController.getDashboardStats);

// Vehicles
router.get('/vehicles', verifyToken, checkRole(['Customer']), portalController.getVehicles);
router.post('/vehicles', verifyToken, checkRole(['Customer']), portalController.addVehicle);
router.put('/vehicles/:id', verifyToken, checkRole(['Customer']), portalController.updateVehicle);
router.delete('/vehicles/:id', verifyToken, checkRole(['Customer']), portalController.deleteVehicle);

// Services
router.get('/service-requests', verifyToken, checkRole(['Customer']), portalController.getServiceRequests);
router.post('/service-requests', verifyToken, checkRole(['Customer']), portalController.addServiceRequest);
router.get('/active-services', verifyToken, checkRole(['Customer']), portalController.getActiveServices);

// Ledger & Receipts
router.get('/ledger', verifyToken, checkRole(['Customer']), portalController.getLedger);
router.get('/receipts', verifyToken, checkRole(['Customer']), portalController.getReceipts);

// Search
router.get('/search', verifyToken, checkRole(['Customer']), portalController.getPortalSearch);

module.exports = router;
