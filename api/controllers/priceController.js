import asyncHandler from '../middleware/asyncHandler.js';
import Price from '../models/priceModel.js';
import Store from '../models/storeModel.js';
import Chain from '../models/chainModel.js';
import Product from "../models/productModel.js";



// @desc    Fetch Prices
// @route   GET /prices/
// @access  Admin
const getPrices = asyncHandler(async (req, res) => {
  // PAGINATION
  const pageSize = process.env.PAGINATION_LIMIT;

  // Keyword to search
  const query = req.query.keyword ? {
    $or: [
      { 'store.name': { $regex: req.query.keyword, $options: 'i' } },
      { 'chain.name': { $regex: req.query.keyword, $options: 'i' } },
      { 'product.name': { $regex: req.query.keyword, $options: 'i' } },
      { 'product.barcode': { $regex: req.query.keyword, $options: 'i' } },
    ]
  } : {};

  const prices = await Price.aggregate([
    {
      $lookup: {
        from: 'stores', 
        localField: 'store', 
        foreignField: '_id',
        as: 'store'
      }
    },
    {
      $lookup: {
        from: 'chains', 
        localField: 'chain', 
        foreignField: '_id', 
        as: 'chain'
      }
    },
    {
      $lookup: {
        from: 'products', 
        localField: 'product', 
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $unwind: {
        path: '$store',
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $unwind: {
        path: '$chain',
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $unwind: {
        path: '$product',
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $match: query
    },
  ]);


  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  // Apply pagination
  const paginatedResults = prices.slice(skip, skip + limit);

  // Count of total results for pagination purposes
  const count = prices.length;

  // Return the results
  return res.json({
    page,
    pages: Math.ceil(count / limit),
    prices: paginatedResults,
  });


  // res.json({ prices, page, pages: Math.ceil(count / pageSize) });
});



// @desc    Create a price
// @route   POST /prices
// @access  Admin
const createPrice = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Check if price is already exist
  let existPrice = null;
  if (req.body.storeId) {
    existPrice = await Price.findOne({ product: req.body.productId, store: req.body.storeId });
  } else if (req.body.chainId) {
    existPrice = await Price.findOne({ product: req.body.productId, chain: req.body.chainId });
  }
  if (!existPrice) {
    // Create new price
    const price = await Price.create({
      product: req.body.productId,
      store: req.body.storeId !== "" ? req.body.storeId : undefined,
      chain: req.body.chainId !== "" ? req.body.chainId : undefined,
      number: req.body.number
    });
    const newPrice = await price.save();
    // If the price belong to store case
    if (newPrice.store) {
      const store = await Store.findById(newPrice.store);
      const prices = [
        ...store.prices,
        newPrice
      ];
      store.prices = prices;
      await store.save();
      // If the price belong to chain case
    } else {
      // Add the price to the chain
      const chain = await Chain.findById(newPrice.chain);
      const prices = [
        ...chain.prices,
        newPrice
      ];
      chain.prices = prices;
      await chain.save();
      // Add the price to the chain's stores
      await Store.updateMany(
        { chain: newPrice.chain },
        { $push: { 'prices': price._id } }
      );
    }
    let product = await Product.findOne({ _id: req.body.productId });
    product.prices = [...product.prices, newPrice];
    await product.save();
    res.status(201).json(newPrice);
  } else {
    res.status(400);
    throw new Error("Price already exist");
  }


});


// @desc    Update a price
// @route   PUT /prices/:id
// @access  Admin
const updatePrice = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.body || !req.body.number) {

    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the price
  const price = await Price.findById(req.params.id);
  // .populate({
  //   path: 'chain',
  //   select: '-prices'
  // })
  // .populate({
  //   path: 'store',
  //   select: '-prices'
  // })
  // .populate({
  //   path: 'product',
  //   select: '-category -subCategory -prices'
  // });
  if (!price) {
    res.status(404);
    throw new Error("No Price found");
  }
  // Update the price number
  price.number = req.body.number != undefined ? req.body.number : price.number;
  // Save changes
  let updatedPrice = await price.save();
  res.status(201).json(updatedPrice);
});

// @desc    Get a price by Id
// @route   GET /prices/:id
// @access  Subscribe
const getPriceById = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const price = await Price.findById(req.params.id)
    .populate({
      path: 'chain',
      select: '-prices'
    })
    .populate({
      path: 'store',
      select: '-prices'
    })
    .populate({
      path: 'product',
      select: '-category -prices'
    });
  if (!price) {
    res.status(404);
    throw new Error("Price not found");
  }
  res.status(201).json(price);
});

// @desc    Delete a price
// @route   DELETE /prices/:id
// @access  Admin
const deletePrice = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Get the price which deleted
  const price = await Price.findOneAndDelete({ _id: req.params.id });
  // Case the price belong to a store
  if (price.store) {
    const store = await Store.findById(price.store);
    const prices = store.prices.filter((p) => p._id == price._id);
    store.prices = [...prices];
    await store.save();
    // Case the price belong to a chain
  } else {
    const chain = await Chain.findById(price.chain);
    const prices = chain.prices.filter((p) => p._id == price._id);
    chain.prices = [...prices];
    await chain.save();
    // Delete the price from all the chain's stores
    await Store.updateMany(
      { 'prices': price._id },
      { $pull: { 'prices': price._id } },
    );
  }
  // Delete from product
  const product = await Product.findOne({ _id: price.product });
  product.prices = product.prices.filter((p) => p != req.params.id);
  await product.save();
  res.json({ message: "Price removed" });
});




export {
  getPrices,
  createPrice,
  updatePrice,
  getPriceById,
  deletePrice,
};