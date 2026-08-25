const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

const WorkSubmissionSchema = new mongoose.Schema({
  note: { type: String, default: '' },
  links: [{ type: String }],
  files: [{ type: String }],
  submittedAt: { type: Date, default: Date.now },
});

const DealSchema = new mongoose.Schema(
  {
    requirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Requirement',
      default: null,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    agreedPrice: {
      type: Number,
      required: [true, 'Agreed price is required'],
    },
    packageTier: {
      type: String,
      enum: ['basic', 'standard', 'premium', 'custom'],
      default: 'custom',
    },
    deliverables: [{ type: String }],
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',      // Offer sent, waiting for creator/business acceptance
        'accepted',     // Accepted by both parties, ready to start
        'in_progress',  // Creator working on deliverables
        'submitted',    // Creator submitted proof/deliverables for review
        'completed',    // Business approved work & marked completed
        'cancelled',    // Cancelled before completion
        'rejected',     // Offer declined
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'escrowed', 'released', 'refunded'],
      default: 'escrowed',
    },
    workSubmission: WorkSubmissionSchema,
    timeline: [TimelineEventSchema],
    hasBusinessReviewed: {
      type: Boolean,
      default: false,
    },
    hasCreatorReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Deal', DealSchema);
