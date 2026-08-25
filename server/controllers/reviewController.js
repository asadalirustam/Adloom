const Review = require('../models/Review');
const Deal = require('../models/Deal');
const Notification = require('../models/Notification');

// @desc    Create review for a completed deal
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { dealId, rating, comment, skillsRatings } = req.body;

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    if (deal.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed deals' });
    }

    const isBusiness = deal.business.toString() === req.user.id;
    const isCreator = deal.creator.toString() === req.user.id;

    if (!isBusiness && !isCreator) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this deal' });
    }

    const role = isBusiness ? 'business_to_creator' : 'creator_to_business';
    const reviewee = isBusiness ? deal.creator : deal.business;

    // Check if review already exists
    const existing = await Review.findOne({ deal: dealId, reviewer: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this deal' });
    }

    const review = await Review.create({
      deal: dealId,
      reviewer: req.user.id,
      reviewee,
      role,
      rating,
      comment,
      skillsRatings: skillsRatings || { communication: 5, quality: 5, timeliness: 5 },
    });

    if (isBusiness) {
      deal.hasBusinessReviewed = true;
    } else {
      deal.hasCreatorReviewed = true;
    }
    await deal.save();

    // Send notification to reviewee
    await Notification.create({
      recipient: reviewee,
      sender: req.user.id,
      type: 'review_received',
      title: 'New Review Received! ⭐',
      message: `${req.user.name} gave you a ${rating}-star review for "${deal.title}"`,
      link: `/deals/${deal._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar companyName isVerified')
      .populate('deal', 'title agreedPrice packageTier')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
