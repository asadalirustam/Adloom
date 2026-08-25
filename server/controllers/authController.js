const User = require('../models/User');
const CreatorProfile = require('../models/CreatorProfile');

// Helper to send token response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    token,
    user,
  });
};

// @desc    Register a new user (Creator or Business)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, companyWebsite, city, country, categories, tagline } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'creator',
      companyName: companyName || '',
      companyWebsite: companyWebsite || '',
      location: { city: city || '', country: country || '' },
    });

    // If role is creator, initialize CreatorProfile
    if (user.role === 'creator') {
      await CreatorProfile.create({
        user: user._id,
        tagline: tagline || 'Content Creator & Brand Collaborator',
        categories: categories && categories.length > 0 ? categories : ['Tech & AI'],
        location: { city: city || '', country: country || '' },
        packages: {
          basic: {
            title: 'Starter Promotion',
            description: '1 Dedicated Social Post / Story Mention with product tag',
            price: 75,
            deliveryDays: 3,
            revisions: 1,
            deliverables: ['1 Social Post', 'Link in Bio for 24h', 'Brand Tagging'],
          },
          standard: {
            title: 'Pro Campaign',
            description: '1 Reel/Short Video + 2 Story Highlights + High-res photo set',
            price: 180,
            deliveryDays: 5,
            revisions: 2,
            deliverables: ['1 High-Quality Reel/Short', '2 Story Mentions', '3 Product Photos', 'Link in Bio (7 days)'],
          },
          premium: {
            title: 'Full Brand Ambassador',
            description: 'Multi-platform spotlight video, carousel review, usage rights & story series',
            price: 450,
            deliveryDays: 7,
            revisions: 3,
            deliverables: ['1 Full Dedicated Video Review', 'Multi-Platform Syndicate', 'Usage Rights for 90 Days', 'Swipe-up Trackable Link'],
          },
        },
      });
    }

    sendTokenResponse(user, 201, res, 'Registration successful!');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended. Contact support.' });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user & associated creator profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let creatorProfile = null;

    if (user.role === 'creator') {
      creatorProfile = await CreatorProfile.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      creatorProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio,
      avatar: req.body.avatar,
      companyName: req.body.companyName,
      companyWebsite: req.body.companyWebsite,
      phone: req.body.phone,
      location: req.body.location,
    };

    // Remove undefined values
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot / Reset password simulation
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email address' });
    }

    // Return a temporary reset simulation link or success note
    res.status(200).json({
      success: true,
      message: 'Password reset link has been dispatched to your email (simulated for demo).',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
