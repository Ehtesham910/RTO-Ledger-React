const express = require('express');
const router = express.Router();
const { getServiceRequests } = require('../controllers/serviceRequestController');

router.get('/', getServiceRequests);

module.exports = router;
