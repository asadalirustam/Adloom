const Application = require('../models/Application');
const Requirement = require('../models/Requirement');
const Deal = require('../models/Deal');
const Notification = require('../models/Notification');

// @desc    Apply to a requirement
// @route   POST /api/applications/apply/:requirementId
// @access  Private (Creator only)
exports.applyToRequirement = async (req, res, next) => {
  try {
    const { pitch, proposedPrice, estimatedDeliveryDays, portfolioLinks } = req.body;
    const requirementId = req.params.requirementId;

    const requirement = await Requirement.findById(requirementId);
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    if (requirement.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This requirement is no longer accepting applications' });
    }

    // Check if creator already applied
    const existing = await Application.findOne({
      requirement: requirementId,
      creator: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted an application for this requirement' });
    }

    const application = await Application.create({
      requirement: requirementId,
      creator: req.user.id,
      pitch,
      proposedPrice,
      estimatedDeliveryDays: estimatedDeliveryDays || 5,
      portfolioLinks: portfolioLinks || [],
    });

    // Increment applicants counter
    requirement.applicantsCount = (requirement.applicantsCount || 0) + 1;
    await requirement.save();

    // Send notification to business owner
    await Notification.create({
      recipient: requirement.business,
      sender: req.user.id,
      type: 'application_received',
      title: 'New Creator Pitch Received',
      message: `${req.user.name} submitted a proposal for "${requirement.title}" ($${proposedPrice})`,
      link: `/business/requirements/${requirement._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a requirement
// @route   GET /api/applications/requirement/:requirementId
// @access  Private (Business owner or Admin)
exports.getApplicationsForRequirement = async (req, res, next) => {
  try {
    const requirement = await Requirement.findById(req.params.requirementId);
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    if (requirement.business.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ requirement: req.params.requirementId })
      .populate({
        path: 'creator',
        select: 'name avatar email location isVerified',
        populate: {
          path: 'creatorProfile',
          select: 'tagline categories ratingAverage reviewCount startingPrice totalReach socialMedia badges',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in creator's applications
// @route   GET /api/applications/my
// @access  Private (Creator only)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ creator: req.user.id })
      .populate({
        path: 'requirement',
        populate: {
          path: 'business',
          select: 'name avatar companyName isVerified',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept creator application -> Creates active Deal
// @route   POST /api/applications/:id/accept
// @access  Private (Business only)
exports.acceptApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('requirement')
      .populate('creator', 'name email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.requirement.business.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Mark application accepted
    application.status = 'accepted';
    await application.save();

    // Calculate deadline
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + (application.estimatedDeliveryDays || 5));

    // Create a new Deal
    const deal = await Deal.create({
      requirement: application.requirement._id,
      business: req.user.id,
      creator: application.creator._id,
      title: application.requirement.title,
      description: application.pitch,
      agreedPrice: application.proposedPrice,
      deliverables: application.requirement.deliverables || ['1 Social Campaign Promotion'],
      deadline: deadlineDate,
      status: 'accepted',
      paymentStatus: 'escrowed',
      timeline: [
        {
          status: 'accepted',
          note: `Application accepted by ${req.user.name}. Collaboration initialized.`,
          updatedBy: req.user.id,
          timestamp: new Date(),
        },
      ],
    });

    // Notify creator
    await Notification.create({
      recipient: application.creator._id,
      sender: req.user.id,
      type: 'application_accepted',
      title: 'Proposal Accepted! Deal Started 🎉',
      message: `Your pitch for "${application.requirement.title}" was accepted by ${req.user.name}. You can now start working on the deliverables.`,
      link: `/deals/${deal._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Application accepted! Collaboration deal created.',
      dealId: deal._id,
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject application
// @route   POST /api/applications/:id/reject
// @access  Private (Business only)
exports.rejectApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('requirement');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.requirement.business.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = 'rejected';
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application marked as declined',
    });
  } catch (error) {
    next(error);
  }
};
