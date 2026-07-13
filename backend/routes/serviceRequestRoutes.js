const express = require('express');
const router = express.Router();
const { getServiceRequests, createServiceRequest, updateServiceRequest, updateServiceRequestStatus, deleteServiceRequest } = require('../controllers/serviceRequestController');

router.get('/', getServiceRequests);
router.post('/', createServiceRequest);
router.put('/:id', updateServiceRequest);
router.put('/:id/status', updateServiceRequestStatus);
router.delete('/:id', deleteServiceRequest);

module.exports = router;
