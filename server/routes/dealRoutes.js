const express = require('express');
const {
  createDirectOffer,
  getMyDeals,
  getDealById,
  respondToDealOffer,
  submitWork,
  completeDeal,
  cancelDeal,
} = require('../controllers/dealController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/offer', authorize('business'), createDirectOffer);
router.get('/my', getMyDeals);
router.get('/:id', getDealById);
router.put('/:id/respond', authorize('creator', 'admin'), respondToDealOffer);
router.post('/:id/submit-work', authorize('creator', 'admin'), submitWork);
router.post('/:id/complete', authorize('business', 'admin'), completeDeal);
router.post('/:id/cancel', cancelDeal);

module.exports = router;
