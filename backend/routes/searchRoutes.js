const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Accessible to Admin, Accountant, Viewer (Staff Portal)
router.get('/', verifyToken, checkRole(['Admin', 'Accountant', 'Viewer']), searchController.globalSearch);

module.exports = router;
