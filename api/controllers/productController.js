import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import Category from "../models/categoryModel.js";
import isValidProduct from "../models/modelsValidation/ProductValidation.js";

// @desc    Fetch products by query
// @route   GET /products
// @access  Admin
const getProducts = asyncHandler(async (req, res) => {
  console.log(req.query);
  // PAGINATION
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  // Keyword to search
  const keyword = req.query.keyword
    ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { manufacturer: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { barcode: { $regex: req.query.keyword, $options: 'i' } },
        { country: { $regex: req.query.keyword, $options: 'i' } },
        { country_code: { $regex: req.query.keyword, $options: 'i' } },
      ],
    }
    : {};
  // Query to search by category
  const categoryQuery = req.query.category || null;
  let count = null;
  let products = null;
  // Case search by category
  if (categoryQuery) {
    const category = await Category.findOne({ name: categoryQuery });
    // Count number of elements
    count = await Product.countDocuments({ category: category._id });
    // Find elements with pagination
    products = await Product.find({ category: category._id }).limit(pageSize).skip(pageSize * (page - 1))
      .populate({
        path: 'category',
        select: '-products',
      })
      .populate({
        path: 'prices',
        select: '-product'
      });
    // Normal case
  } else {
    // Count number of elements
    count = await Product.countDocuments({ ...keyword });
    // Find elements with pagination
    products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
      .populate({
        path: 'category',
        select: '-products',
      })
      .populate({
        path: 'prices',
        select: '-product'
      });
  }
  // console.log({ products, page, pages: Math.ceil(count / pageSize) });
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /products/:id
// @access  Subscribe
const getProductById = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'category',
      select: '-products',
    })
    .populate({
      path: 'prices',
      select: '-product',
      populate: {
        path: 'store chain'
      }
    });
  if (!product) {
    res.status(404);
    throw new Error("Product Not found");
  }
  return res.json(product);
});

// @desc    Create a product
// @route   POST /products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    manufacturer: "Sample manufacturer",
    barcode: 123456789,
    unitOfMeasure: "Sample unit",
    measure: 0,
    country: "Sample country",
    country_code: "Sample country code",
    image: '/images/sample.jpg',
    category: "6485b40046107ff153cb8e1c",
    description: 'Sample description',
  });

  let createdProduct = await product.save();
  createdProduct = await Product.populate(createdProduct, { path: 'category' });
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id || !req.body) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the product
  const product = await Product.findById(req.params.id);
  if (product) {
    if (isValidProduct(req.body)) {
      // Update the product's fields
      for (let key in req.body) {
        if (req.body.hasOwnProperty(key) && key !== 'category') {
          // product's fields validation
          if (req.body[key] == "" || (typeof req.body[key] === 'string' && req.body[key].trim() == "")) {
            res.status(400);
            throw new Error(`Invalid ${key}`);
          }
          const value = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
          product[key] = value;
        }
        // Get the category by Id
        if (key == 'category') {
          const category = await Category.findOne({ name: req.body[key] });
          if (!category) {
            res.status(400);
            throw new Error(`Invalid ${key}`);
          }
          product[key] = category._id;
        }
      }

    }

    // Save changes
    let updatedProduct = await product.save();
    updatedProduct = await Product.populate(updatedProduct,
      {
        path: 'category',
        select: '-products',
      },
      {
        path: 'prices',
        select: '-product'
      },
    );
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
