const Requirement = require('../models/Requirement');
const Application = require('../models/Application');

// @desc    Get all open requirements with filters
// @route   GET /api/requirements
// @access  Public
exports.getRequirements = async (req, res, next) => {
  try {
    const {
      search,
      category,
      platform,
      minBudget,
      maxBudget,
      location,
      status = 'open',
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (platform && platform !== 'All') {
      query.platforms = { $in: [platform] };
    }

    if (minBudget || maxBudget) {
      if (minBudget) query['budget.min'] = { $gte: Number(minBudget) };
      if (maxBudget) query['budget.max'] = { $lte: Number(maxBudget) };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    if (location && location.trim() !== '') {
      query.locationTarget = new RegExp(location.trim(), 'i');
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'budget_desc') sortOptions = { 'budget.max': -1 };
    if (sort === 'budget_asc') sortOptions = { 'budget.min': 1 };
    if (sort === 'deadline_soon') sortOptions = { deadline: 1 };
    if (sort === 'popular') sortOptions = { applicantsCount: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Requirement.countDocuments(query);

    const requirements = await Requirement.find(query)
      .populate('business', 'name avatar companyName isVerified location')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: requirements.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: requirements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single requirement details
// @route   GET /api/requirements/:id
// @access  Public
exports.getRequirementById = async (req, res, next) => {
  try {
    const requirement = await Requirement.findById(req.params.id).populate(
      'business',
      'name avatar email companyName companyWebsite isVerified location bio'
    );

    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    // Increment view counter
    requirement.viewsCount = (requirement.viewsCount || 0) + 1;
    await requirement.save();

    res.status(200).json({
      success: true,
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new requirement
// @route   POST /api/requirements
// @access  Private (Business only)
exports.createRequirement = async (req, res, next) => {
  try {
    req.body.business = req.user.id;

    const requirement = await Requirement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Promotion requirement posted successfully!',
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update requirement
// @route   PUT /api/requirements/:id
// @access  Private (Business owner or Admin)
exports.updateRequirement = async (req, res, next) => {
  try {
    let requirement = await Requirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    // Ensure user is owner or admin
    if (requirement.business.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this requirement' });
    }

    requirement = await Requirement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Requirement updated successfully',
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Close requirement
// @route   DELETE /api/requirements/:id
// @access  Private (Business owner or Admin)
exports.deleteRequirement = async (req, res, next) => {
  try {
    const requirement = await Requirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }

    if (requirement.business.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this requirement' });
    }

    await requirement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Requirement removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get business's own posted requirements
// @route   GET /api/requirements/my/posted
// @access  Private (Business only)
exports.getMyRequirements = async (req, res, next) => {
  try {
    const requirements = await Requirement.find({ business: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requirements.length,
      data: requirements,
    });
  } catch (error) {
    next(error);
  }
};
