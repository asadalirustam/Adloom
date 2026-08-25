const mongoose = require('mongoose');

const RequirementSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title for this promotion requirement'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a detailed description of your requirements'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Tech & AI',
        'Food & Cooking',
        'Fashion & Apparel',
        'Beauty & Skincare',
        'Fitness & Health',
        'Travel & Lifestyle',
        'Gaming & Esports',
        'Business & Finance',
        'Education & DIY',
        'Photography & Video',
        'Entertainment & Comedy',
        'Music & Dance',
        'Other',
      ],
    },
    platforms: [
      {
        type: String,
        enum: ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'Twitch', 'Facebook', 'Pinterest', 'Other'],
      },
    ],
    budget: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    locationTarget: {
      type: String,
      default: 'Global / Any',
    },
    minFollowersRequired: {
      type: Number,
      default: 1000,
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify a campaign completion deadline'],
    },
    deliverables: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'closed'],
      default: 'open',
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Requirement', RequirementSchema);
