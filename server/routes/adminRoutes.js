const express = require('express');
const {
  getAdminAnalytics,
  getAdminUsers,
  toggleUserVerification,
  toggleUserStatus,
  getAdminDeals,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Restrict all routes to admin
router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getAdminUsers);
router.put('/users/:id/verify', toggleUserVerification);
router.put('/users/:id/status', toggleUserStatus);
router.get('/deals', getAdminDeals);

module.exports = router;
