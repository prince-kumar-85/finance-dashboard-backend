const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('viewer', 'analyst', 'admin'));

router.get('/summary', dashboardController.getSummary);
router.get('/categories', dashboardController.getCategoryTotals);
router.get('/recent', dashboardController.getRecentActivity);
router.get('/trends', dashboardController.getTrends);

module.exports = router;
