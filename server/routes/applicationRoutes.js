const express = require('express');
const {
  applyToRequirement,
  getApplicationsForRequirement,
  getMyApplications,
  acceptApplication,
  rejectApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/apply/:requirementId', protect, authorize('creator'), applyToRequirement);
router.get('/my', protect, authorize('creator'), getMyApplications);
router.get('/requirement/:requirementId', protect, authorize('business', 'admin'), getApplicationsForRequirement);
router.post('/:id/accept', protect, authorize('business', 'admin'), acceptApplication);
router.post('/:id/reject', protect, authorize('business', 'admin'), rejectApplication);

module.exports = router;
