const express = require('express');
const {
  getRequirements,
  getRequirementById,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  getMyRequirements,
} = require('../controllers/requirementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getRequirements);
router.get('/my/posted', protect, authorize('business', 'admin'), getMyRequirements);
router.get('/:id', getRequirementById);
router.post('/', protect, authorize('business'), createRequirement);
router.put('/:id', protect, authorize('business', 'admin'), updateRequirement);
router.delete('/:id', protect, authorize('business', 'admin'), deleteRequirement);

module.exports = router;
