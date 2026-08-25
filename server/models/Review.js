const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['business_to_creator', 'creator_to_business'],
      required: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
      required: [true, 'Rating is required'],
    },
    comment: {
      type: String,
      required: [true, 'Review feedback is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    skillsRatings: {
      communication: { type: Number, min: 1, max: 5, default: 5 },
      quality: { type: Number, min: 1, max: 5, default: 5 },
      timeliness: { type: Number, min: 1, max: 5, default: 5 },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple reviews from the same reviewer on the same deal
ReviewSchema.index({ deal: 1, reviewer: 1 }, { unique: true });

// Static method to recalculate and update CreatorProfile average rating and review count
ReviewSchema.statics.getAverageRating = async function (creatorUserId) {
  const obj = await this.aggregate([
    {
      $match: { reviewee: new mongoose.Types.ObjectId(creatorUserId), role: 'business_to_creator' },
    },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    const CreatorProfile = mongoose.model('CreatorProfile');
    if (obj.length > 0) {
      await CreatorProfile.findOneAndUpdate(
        { user: creatorUserId },
        {
          ratingAverage: Math.round(obj[0].averageRating * 10) / 10,
          reviewCount: obj[0].reviewCount,
        }
      );
    }
  } catch (err) {
    console.error('Error updating creator rating average:', err);
  }
};

ReviewSchema.post('save', async function () {
  if (this.role === 'business_to_creator') {
    await this.constructor.getAverageRating(this.reviewee);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
