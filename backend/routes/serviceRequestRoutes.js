const express = require('express');
const router = express.Router();
const { getServiceRequests, createServiceRequest, updateServiceRequest, deleteServiceRequest } = require('../controllers/serviceRequestController');

router.get('/', getServiceRequests);
router.post('/', createServiceRequest);
router.put('/:id', updateServiceRequest);
router.delete('/:id', deleteServiceRequest);

module.exports = router;
