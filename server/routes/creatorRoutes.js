const express = require('express');
const {
  getCreators,
  getCreatorById,
  updateMyProfile,
  addPortfolioItem,
  deletePortfolioItem,
  getFeaturedCreators,
} = require('../controllers/creatorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCreators);
router.get('/featured/spotlight', getFeaturedCreators);
router.get('/:id', getCreatorById);

// Protected routes for creator
router.put('/me', protect, authorize('creator'), updateMyProfile);
router.post('/portfolio', protect, authorize('creator'), addPortfolioItem);
router.delete('/portfolio/:itemId', protect, authorize('creator'), deletePortfolioItem);

module.exports = router;
