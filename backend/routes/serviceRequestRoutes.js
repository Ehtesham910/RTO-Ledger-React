const express = require('express');
const router = express.Router();
const { getServiceRequests, createServiceRequest } = require('../controllers/serviceRequestController');

router.get('/', getServiceRequests);
router.post('/', createServiceRequest);

module.exports = router;
