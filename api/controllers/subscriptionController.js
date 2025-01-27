import asyncHandler from '../middleware/asyncHandler.js';
import Subscription from '../models/subscriptionModel.js';
import isValidSubscription from '../models/modelsValidation/SubscriptionValidation.js';



// @desc    Fetch all Subscriptions
// @route   GET /subscriptions/
// @access  Subtribe
const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({});
  res.json(subscriptions);
});


// @desc    Create a subscription
// @route   POST /subscription
// @access  Admin
const createSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.create({
    name: "מסלול חדש",
    price: 0,
    description: "תיאור המנוי"
  });
  const newSubscription = await subscription.save();
  res.status(201).json(newSubscription);
});


// @desc    Update a subscription
// @route   PUT /subscriptions/:id
// @access  Admin
const updateSubscription = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id || !req.body) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the subscription
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) {
    res.status(404);
    throw new Error("No Subscription found");
  }
  // Check validation
  if (isValidSubscription(req.body)) {
    // Update the subscription's fields
    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        // subscription's fields validation
        if (req.body[key] == "" || (typeof req.body[key] === 'string' && req.body[key].trim() == "")) {
          res.status(400);
          throw new Error(`Invalid ${key}`);
        }
        const value = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
        subscription[key] = value;
      }
    }
  }

  // Save changes
  const updatedSubscription = await subscription.save();
  res.status(201).json(updatedSubscription);
});

// @desc    Get a subscription by Id
// @route   GET /subscriptions/:id
// @access  Subscribe
const getSubscription = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) {
    res.status(404);
    throw new Error("Subscription not found");
  }
  res.status(201).json(subscription);
});

// @desc    Delete a subscription
// @route   DELETE /subscriptions/:id
// @access  Admin
const deleteSubscription = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  await Subscription.deleteOne({ _id: req.params.id });
  res.json({ message: "Subscription removed" });
});




export {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  getSubscription,
  deleteSubscription
};