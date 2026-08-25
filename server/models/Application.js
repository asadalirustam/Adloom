const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    requirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Requirement',
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pitch: {
      type: String,
      required: [true, 'Please provide a pitch or cover letter for this campaign'],
      maxlength: [2000, 'Pitch cannot exceed 2000 characters'],
    },
    proposedPrice: {
      type: Number,
      required: [true, 'Please propose your fee for this collaboration'],
    },
    estimatedDeliveryDays: {
      type: Number,
      required: [true, 'Please provide estimated delivery time in days'],
      default: 5,
    },
    portfolioLinks: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications from same creator to same requirement
ApplicationSchema.index({ requirement: 1, creator: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
