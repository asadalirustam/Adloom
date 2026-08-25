const CreatorProfile = require('../models/CreatorProfile');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get all creators with advanced search and filters
// @route   GET /api/creators
// @access  Public
exports.getCreators = async (req, res, next) => {
  try {
    const {
      search,
      category,
      platform,
      minFollowers,
      maxFollowers,
      minPrice,
      maxPrice,
      minRating,
      location,
      sort,
      featured,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.categories = { $in: [category] };
    }

    // Filter by platform
    if (platform && platform !== 'All') {
      query['socialMedia.platform'] = platform;
    }

    // Filter by total followers reach
    if (minFollowers || maxFollowers) {
      query.totalReach = {};
      if (minFollowers) query.totalReach.$gte = Number(minFollowers);
      if (maxFollowers) query.totalReach.$lte = Number(maxFollowers);
    }

    // Filter by price
    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    // Filter by rating
    if (minRating) {
      query.ratingAverage = { $gte: Number(minRating) };
    }

    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting logic
    let sortOptions = { ratingAverage: -1, totalReach: -1 };
    if (sort === 'price_asc') sortOptions = { startingPrice: 1 };
    if (sort === 'price_desc') sortOptions = { startingPrice: -1 };
    if (sort === 'reach_desc') sortOptions = { totalReach: -1 };
    if (sort === 'rating_desc') sortOptions = { ratingAverage: -1 };
    if (sort === 'reviews_desc') sortOptions = { reviewCount: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    let creatorsQuery = CreatorProfile.find(query)
      .populate({
        path: 'user',
        match: { status: 'active' },
        select: 'name avatar email location isVerified',
      })
      .sort(sortOptions);

    let creators = await creatorsQuery;

    // Filter out profiles whose user is null (e.g. inactive or suspended)
    creators = creators.filter((c) => c.user !== null);

    // If search term is provided, filter by creator name or bio or tagline
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      creators = creators.filter((c) => {
        const nameMatch = c.user && searchRegex.test(c.user.name);
        const taglineMatch = searchRegex.test(c.tagline);
        const bioMatch = searchRegex.test(c.bio);
        const categoryMatch = c.categories.some((cat) => searchRegex.test(cat));
        return nameMatch || taglineMatch || bioMatch || categoryMatch;
      });
    }

    // Location filter
    if (location && location.trim() !== '') {
      const locRegex = new RegExp(location.trim(), 'i');
      creators = creators.filter((c) => {
        const cityMatch = c.location && searchRegexSafe(c.location.city, locRegex);
        const countryMatch = c.location && searchRegexSafe(c.location.country, locRegex);
        return cityMatch || countryMatch;
      });
    }

    const total = creators.length;
    const paginatedCreators = creators.slice(skip, skip + Number(limit));

    res.status(200).json({
      success: true,
      count: paginatedCreators.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: paginatedCreators,
    });
  } catch (error) {
    next(error);
  }
};

function searchRegexSafe(str, regex) {
  return str ? regex.test(str) : false;
}

// @desc    Get single creator profile by ID or User ID
// @route   GET /api/creators/:id
// @access  Public
exports.getCreatorById = async (req, res, next) => {
  try {
    let profile = await CreatorProfile.findById(req.params.id).populate({
      path: 'user',
      select: 'name avatar email location isVerified companyName status createdAt',
    });

    // If not found by CreatorProfile _id, attempt lookup by user _id
    if (!profile) {
      profile = await CreatorProfile.findOne({ user: req.params.id }).populate({
        path: 'user',
        select: 'name avatar email location isVerified companyName status createdAt',
      });
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Creator profile not found' });
    }

    // Fetch creator's reviews
    const reviews = await Review.find({
      reviewee: profile.user._id,
      role: 'business_to_creator',
    })
      .populate('reviewer', 'name avatar companyName')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: profile,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current creator's profile
// @route   PUT /api/creators/me
// @access  Private (Creator only)
exports.updateMyProfile = async (req, res, next) => {
  try {
    let profile = await CreatorProfile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new CreatorProfile({ user: req.user.id });
    }

    const allowedFields = [
      'tagline',
      'bio',
      'categories',
      'languages',
      'location',
      'socialMedia',
      'packages',
      'portfolio',
      'isAvailable',
      'badges',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    // Update starting price if packages were updated
    if (req.body.packages && req.body.packages.basic && req.body.packages.basic.price) {
      profile.startingPrice = req.body.packages.basic.price;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Creator profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add portfolio item
// @route   POST /api/creators/portfolio
// @access  Private (Creator only)
exports.addPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, mediaUrl, mediaType, externalUrl, clientName } = req.body;

    const profile = await CreatorProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Creator profile not found' });
    }

    profile.portfolio.push({
      title,
      description,
      mediaUrl,
      mediaType: mediaType || 'image',
      externalUrl,
      clientName,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Portfolio item added',
      data: profile.portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/creators/portfolio/:itemId
// @access  Private (Creator only)
exports.deletePortfolioItem = async (req, res, next) => {
  try {
    const profile = await CreatorProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Creator profile not found' });
    }

    profile.portfolio = profile.portfolio.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Portfolio item removed',
      data: profile.portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured top creators for hero/landing
// @route   GET /api/creators/featured/spotlight
// @access  Public
exports.getFeaturedCreators = async (req, res, next) => {
  try {
    const creators = await CreatorProfile.find({ isFeatured: true })
      .populate('user', 'name avatar isVerified location')
      .sort({ ratingAverage: -1, totalReach: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      data: creators,
    });
  } catch (error) {
    next(error);
  }
};
