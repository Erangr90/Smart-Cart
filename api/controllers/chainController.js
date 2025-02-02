import asyncHandler from '../middleware/asyncHandler.js';
import Chain from '../models/chainModel.js';
import Store from '../models/storeModel.js';
import Price from '../models/priceModel.js';
import isValidChain from '../models/modelsValidation/ChainValidation.js';



// @desc    Fetch Chain query per page
// @route   GET /chains/
// @access  Subtribe
const getChains = asyncHandler(async (req, res) => {
  // PAGINATION
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  // Keyword to search
  const keyword = req.query.keyword
    ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { businessNumber: { $regex: req.query.keyword, $options: 'i' } },
        { email: { $regex: req.query.keyword, $options: 'i' } },
        { phone: { $regex: req.query.keyword, $options: 'i' } },
      ],
    }
    : {};
  // Count number of elements
  const count = await Chain.countDocuments({ ...keyword });

  let chains = null;
  // Admin case for get the prices, stores and products
  if (req.user.isAdmin) {
    // Find elements with pagination
    chains = await Chain.find({ ...keyword }).populate({
      path: 'stores',
      select: '-prices'
    })
      .populate({
        path: 'prices',
        populate: {
          path: 'product',
        },
      })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    // Not admin case to get less data
  } else {
    // Find elements with pagination
    chains = await Chain.find({ ...keyword }).select("-prices").populate({ path: 'stores' }).select("-prices")
      .limit(pageSize)
      .skip(pageSize * (page - 1));

  }
  res.json({ chains, page, pages: Math.ceil(count / pageSize) });
});




// @desc    Create a chain
// @route   POST /chains
// @access  Admin
const createChain = asyncHandler(async (req, res) => {
  const chain = await Chain.create({
    name: 'רשת חדשה',
    businessNumber: '123456789',
    email: 'chain@mail.com',
    phone: '08-9812365',
  });
  const newChain = await chain.save();
  res.status(201).json(newChain);
});


// @desc    Update a chain
// @route   PUT /chains/:id
// @access  Admin
const updateChain = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id || !req.body) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the chain for update
  const chain = await Chain.findById(req.params.id).populate({
    path: 'stores',
    select: '-prices'
  })
    .populate({
      path: 'prices',
      populate: {
        path: 'product',
      },
    });
  if (!chain) {
    res.status(404);
    throw new Error("No Chain found");
  }
  // Update the chain's fields
  if (isValidChain(req.body) == true) {
    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        if (req.body[key] == "" || (typeof req.body[key] === 'string' && req.body[key].trim() == "")) {
          res.status(400);
          throw new Error(`Invalid ${key}`);
        }
        const value = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
        chain[key] = value;
      }
    }
    // Update the image of all the chain's stores
    if (req.body.image) {
      await Store.updateMany(
        { chain: chain._id },
        { $set: { 'image': req.body.image } }
      );
    }
    // Save changes
    const updatedChain = await chain.save();
    res.status(201).json(updatedChain);
  }

});

// @desc    Get a chain by Id
// @route   GET /chains/:id
// @access  Subscribe
const getChainById = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  let chain = null;
  // Admin case for get the prices, stores and products
  if (req.user.isAdmin) {
    chain = await Chain.findById(req.params.id).populate({
      path: 'stores',
      select: '-prices'
    })
      .populate({
        path: 'prices',
        populate: {
          path: 'product',
        },
      });
    // Not admin case to get less data
  } else {
    chain = await Chain.findById(req.params.id).select("-prices").populate({ path: 'stores' }).select("-prices");
  }
  if (!chain) {
    res.status(404);
    throw new Error("Chain not found");
  }
  res.status(201).json(chain);
});

// @desc    Delete a chain
// @route   DELETE /chains/:id
// @access  Admin
const deleteChain = asyncHandler(async (req, res) => {
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Check if chain exist
  const deletedDocument = await Chain.findOneAndDelete({ _id: req.params.id });
  if (!deletedDocument) {
    res.status(404);
    throw new Error("Chain not found");
  }
  // Delete chain's stores
  if (deletedDocument.stores && deletedDocument.stores.length > 0) {
    await Store.deleteMany({ chain: req.params.id });
  }
  // Delete chain's prices
  if (deletedDocument.prices && deletedDocument.prices.length > 0) {
    await Price.deleteMany({ chain: req.params.id });
  }

  res.json({ message: "Chain removed" });
});




export {
  getChains,
  createChain,
  updateChain,
  getChainById,
  deleteChain,
};