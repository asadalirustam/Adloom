const mongoose = require('mongoose');

const SocialMediaSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'Twitch', 'Facebook', 'Pinterest', 'Other'],
    required: true,
  },
  handle: { type: String, required: true },
  followersCount: { type: Number, default: 0 },
  profileUrl: { type: String, default: '' },
  engagementRate: { type: Number, default: 0 }, // e.g. 4.8%
});

const PackageTierSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  deliveryDays: { type: Number, default: 3 },
  revisions: { type: Number, default: 1 },
  deliverables: [{ type: String }], // e.g. ["1 Instagram Reel", "1 Story Mention", "Product Tagging"]
});

const PortfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  externalUrl: { type: String, default: '' },
  clientName: { type: String, default: '' },
  viewsCount: { type: Number, default: 0 },
});

const CreatorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    tagline: {
      type: String,
      maxlength: [120, 'Tagline cannot exceed 120 characters'],
      default: 'Content Creator & Digital Influencer',
    },
    bio: {
      type: String,
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
      default: '',
    },
    categories: [
      {
        type: String,
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
    ],
    languages: [{ type: String, default: 'English' }],
    location: {
      city: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    socialMedia: [SocialMediaSchema],
    totalReach: {
      type: Number,
      default: 0,
    },
    packages: {
      basic: { type: PackageTierSchema, default: () => ({}) },
      standard: { type: PackageTierSchema, default: () => ({}) },
      premium: { type: PackageTierSchema, default: () => ({}) },
    },
    portfolio: [PortfolioItemSchema],
    startingPrice: {
      type: Number,
      default: 50,
    },
    ratingAverage: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 5.0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    completedDealsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    badges: [{ type: String }], // e.g. ['Top Rated', 'Fast Responder', 'Rising Star', 'Verified Pro']
  },
  {
    timestamps: true,
  }
);

// Pre-calculate totalReach before saving
CreatorProfileSchema.pre('save', function (next) {
  if (this.socialMedia && this.socialMedia.length > 0) {
    this.totalReach = this.socialMedia.reduce((acc, curr) => acc + (curr.followersCount || 0), 0);
  }
  if (this.packages && this.packages.basic && this.packages.basic.price) {
    this.startingPrice = this.packages.basic.price;
  }
  next();
});

module.exports = mongoose.model('CreatorProfile', CreatorProfileSchema);
