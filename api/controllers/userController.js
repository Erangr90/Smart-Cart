import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import BlackToken from "../models/blackTokenModel.js";
import isValidUser from "../models/modelsValidation/UserValidation.js";


// @desc    Auth user & get token
// @route   POST  /users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Invalid request");
  }
  let { email, password } = req.body;
  // Find the user
  const user = await User.findOne({ email });
  // Create auth for the user
  if (user && (await user.matchPassword(password))) {
    // Create token for the user
    generateToken(res, user._id);
    res.json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      clicks: user.clicks,
      subscriptions: user.subscriptions,
      carts: user.carts,
      products: user.products,
      orders: user.orders,
      isSubtribe: user.isSubtribe,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST  /users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.body || !req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
    res.status(400);
    throw new Error("Invalid request");
  }
  let user = null;
  // Check validation
  if (isValidUser(req, body)) {
    const { email, password, firstName, lastName } = req.body;
    // Check if user Exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("Email already exists");
    }
    // Create user
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

  }

  // Create auth for the user
  if (user) {
    // Create token
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      isSubtribe: user.isSubtribe,
      clicks: user.clicks
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST  /users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  // Get the old token's user
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(400);
    throw new Error("No token found");
  }
  // Save the old token as black token
  await BlackToken.create({ tokenId: token });
  // Remove the user's token
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET  /users/profile
// @access  Subscribe
const getUserProfile = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.user || !req.user._id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the user
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      subscriptions: user.subscriptions,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT  /users/profile
// @access  Subscribe
const updateUserProfile = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.user || !req.user._id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the user
  const user = await User.findById(req.user._id);
  if (user) {
    // Check for duplicate users email
    if (req.body.email) {
      const exists = await User.findOne({ email: req.body.email });
      if (exists) {
        res.status(400);
        throw new Error("Email already exists");
      }
    }
    // Check valid user
    if (isValidUser(req.body)) {
      // Update the product's fields
      for (let key in req.body) {
        if (req.body.hasOwnProperty(key) && key !== "password") {
          // User's fields validation
          if (req.body[key] == "" || (typeof req.body[key] === 'string' && req.body[key].trim() == "")) {
            res.status(400);
            throw new Error(`Invalid ${key}`);
          }
          const value = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
          user[key] = value;
        }
      }

    }

    // Case of user change password
    if (req.body.password) {
      // Change the token as well
      const token = req.cookies.accessToken;
      if (!token) {
        res.status(400);
        throw new Error("No token found");
      }
      // Add the old token to the dataBase
      const blackToken = await BlackToken.create({ tokenId: token });
      // Create new token
      generateToken(res, user._id);
      // Update the user password
      user.password = req.body.password;
    }
    // Save changes
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      subscriptions: updatedUser.subscriptions,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET  /users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  // PAGINATION
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  // Keyword to search
  const keyword = req.query.keyword
    ? {
      $or: [
        { firstName: { $regex: req.query.keyword, $options: 'i' } },
        { lastName: { $regex: req.query.keyword, $options: 'i' } },
        { email: { $regex: req.query.keyword, $options: 'i' } },
      ],
    }
    : {};


  // Count number of elements
  const count = await User.countDocuments({ ...keyword });
  // Find elements with pagination
  const users = await User.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Delete user
// @route   DELETE  /users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the user
  const user = await User.findById(req.params.id);
  if (user) {
    // Case if the user is admin
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete admin user");
    }
    // Delete the user
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET  /users/:id
// @access  Admin
const getUserById = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the user
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc    Update user
// @route   PUT  /users/:id
// @access  Admin
const updateUser = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id || !req.body) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the user
  const user = await User.findById(req.body._id);
  if (user) {
    // Update user filed by admin
    user.clicks = req.body.clicks || user.clicks;
    user.subscriptions = req.body.subscription || user.subscription;
    user.isSubtribe = req.body.isSubtribe != undefined ? req.body.isSubtribe : user.isSubtribe;
    user.isAdmin = req.body.isAdmin != undefined ? req.body.isAdmin : user.isAdmin;
    // Save changes
    const updatedUser = await user.save();

    res.json({
      _id: user._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      subscriptions: updatedUser.subscriptions,
      isAdmin: updatedUser.isAdmin,
      isSubtribe: updatedUser.isSubtribe,
      clicks: updatedUser.clicks
    });
    console.log(updatedUser.clicks);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});



export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
