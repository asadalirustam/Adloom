const Deal = require('../models/Deal');
const User = require('../models/User');
const CreatorProfile = require('../models/CreatorProfile');
const Notification = require('../models/Notification');

// @desc    Create a direct deal offer (Business -> Creator)
// @route   POST /api/deals/offer
// @access  Private (Business only)
exports.createDirectOffer = async (req, res, next) => {
  try {
    const { creatorId, packageTier, title, description, agreedPrice, deadline, deliverables } = req.body;

    const creatorUser = await User.findById(creatorId);
    if (!creatorUser || creatorUser.role !== 'creator') {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    const deal = await Deal.create({
      business: req.user.id,
      creator: creatorId,
      packageTier: packageTier || 'custom',
      title,
      description,
      agreedPrice,
      deadline: new Date(deadline),
      deliverables: deliverables || ['1 Custom Promotion Deliverable'],
      status: 'pending',
      paymentStatus: 'escrowed',
      timeline: [
        {
          status: 'pending',
          note: `Direct offer created by ${req.user.name} for $${agreedPrice}`,
          updatedBy: req.user.id,
          timestamp: new Date(),
        },
      ],
    });

    // Send notification to creator
    await Notification.create({
      recipient: creatorId,
      sender: req.user.id,
      type: 'offer_received',
      title: 'New Direct Collaboration Offer!',
      message: `${req.user.name} sent you a direct promotion offer ($${agreedPrice})`,
      link: `/deals/${deal._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Direct offer dispatched to creator!',
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all deals for logged-in user (as creator or business)
// @route   GET /api/deals/my
// @access  Private
exports.getMyDeals = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {
      $or: [{ business: req.user.id }, { creator: req.user.id }],
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    const deals = await Deal.find(filter)
      .populate('business', 'name avatar email companyName isVerified')
      .populate({
        path: 'creator',
        select: 'name avatar email location isVerified',
        populate: {
          path: 'creatorProfile',
          select: 'tagline ratingAverage categories',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single deal detail
// @route   GET /api/deals/:id
// @access  Private
exports.getDealById = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('business', 'name avatar email companyName companyWebsite isVerified location bio')
      .populate({
        path: 'creator',
        select: 'name avatar email location isVerified bio',
        populate: {
          path: 'creatorProfile',
          select: 'tagline ratingAverage reviewCount socialMedia categories startingPrice',
        },
      })
      .populate('timeline.updatedBy', 'name role avatar');

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    // Authorization check
    const isParticipant =
      deal.business._id.toString() === req.user.id ||
      deal.creator._id.toString() === req.user.id ||
      req.user.role === 'admin';

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this deal' });
    }

    res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Creator responds to offer (accept or reject)
// @route   PUT /api/deals/:id/respond
// @access  Private (Creator only)
exports.respondToDealOffer = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    if (deal.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (action === 'accept') {
      deal.status = 'in_progress';
      deal.timeline.push({
        status: 'in_progress',
        note: `Offer accepted by creator (${req.user.name}). Work has commenced.`,
        updatedBy: req.user.id,
      });

      await Notification.create({
        recipient: deal.business,
        sender: req.user.id,
        type: 'deal_status',
        title: 'Offer Accepted! 🚀',
        message: `${req.user.name} accepted your collaboration offer for "${deal.title}".`,
        link: `/deals/${deal._id}`,
      });
    } else if (action === 'reject') {
      deal.status = 'rejected';
      deal.paymentStatus = 'refunded';
      deal.timeline.push({
        status: 'rejected',
        note: `Offer declined by creator.`,
        updatedBy: req.user.id,
      });

      await Notification.create({
        recipient: deal.business,
        sender: req.user.id,
        type: 'deal_status',
        title: 'Offer Declined',
        message: `${req.user.name} declined the offer for "${deal.title}".`,
        link: `/deals/${deal._id}`,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be accept or reject' });
    }

    await deal.save();

    res.status(200).json({
      success: true,
      message: `Deal status updated to ${deal.status}`,
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit deliverables / proof of work (Creator)
// @route   POST /api/deals/:id/submit-work
// @access  Private (Creator only)
exports.submitWork = async (req, res, next) => {
  try {
    const { note, links, files } = req.body;
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    if (deal.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    deal.status = 'submitted';
    deal.workSubmission = {
      note: note || '',
      links: links || [],
      files: files || [],
      submittedAt: new Date(),
    };

    deal.timeline.push({
      status: 'submitted',
      note: `Creator submitted deliverables for review. Note: "${note || 'Work completed'}"`,
      updatedBy: req.user.id,
    });

    await deal.save();

    // Send notification to business
    await Notification.create({
      recipient: deal.business,
      sender: req.user.id,
      type: 'work_submitted',
      title: 'Deliverables Ready for Review! 📦',
      message: `${req.user.name} submitted the deliverables for "${deal.title}". Please inspect and approve.`,
      link: `/deals/${deal._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Deliverables submitted for review',
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve deliverables and complete deal (Business)
// @route   POST /api/deals/:id/complete
// @access  Private (Business only)
exports.completeDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    if (deal.business.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    deal.status = 'completed';
    deal.paymentStatus = 'released';

    deal.timeline.push({
      status: 'completed',
      note: `Deliverables approved by business (${req.user.name}). Payment escrow released to creator.`,
      updatedBy: req.user.id,
    });

    await deal.save();

    // Increment creator completed deal count
    await CreatorProfile.findOneAndUpdate(
      { user: deal.creator },
      { $inc: { completedDealsCount: 1 } }
    );

    // Notify creator
    await Notification.create({
      recipient: deal.creator,
      sender: req.user.id,
      type: 'deal_completed',
      title: 'Deal Approved & Completed! 💰',
      message: `${req.user.name} approved your deliverables for "${deal.title}". $${deal.agreedPrice} escrow released!`,
      link: `/deals/${deal._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Deal completed and funds released!',
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel deal
// @route   POST /api/deals/:id/cancel
// @access  Private
exports.cancelDeal = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    const isParticipant =
      deal.business.toString() === req.user.id ||
      deal.creator.toString() === req.user.id ||
      req.user.role === 'admin';

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    deal.status = 'cancelled';
    deal.paymentStatus = 'refunded';
    deal.timeline.push({
      status: 'cancelled',
      note: `Deal cancelled by ${req.user.name}. Reason: ${reason || 'Mutual agreement'}`,
      updatedBy: req.user.id,
    });

    await deal.save();

    const notifyTarget = deal.business.toString() === req.user.id ? deal.creator : deal.business;
    await Notification.create({
      recipient: notifyTarget,
      sender: req.user.id,
      type: 'deal_status',
      title: 'Deal Cancelled',
      message: `The collaboration for "${deal.title}" was cancelled by ${req.user.name}.`,
      link: `/deals/${deal._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Deal cancelled',
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};
