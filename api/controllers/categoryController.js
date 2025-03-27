import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';
import isValidCategory from '../models/modelsValidation/CategoryValidation.js';
import Product from '../models/productModel.js';


// @desc    Fetch all categories per Page
// @route   GET /categories
// @access  Subscribe
const getCategories = asyncHandler(async (req, res) => {
  // PAGINATION
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  // Keyword to search
  const keyword = req.query.keyword
    ? {

      name: { $regex: req.query.keyword, $options: 'i' }
    }
    : {};
  // Count number of elements
  const count = await Category.countDocuments({ ...keyword });
  // Find elements with pagination
  let categories = await Category.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate({
      path: 'products',
      select: '-category',
      populate: {
        path: 'prices',
        select: '-product',
      }
    });

  categories = sortByName(categories);




  res.status(200).json({ categories, page, pages: Math.ceil(count / pageSize) });


});

// @desc    Fetch all categories
// @route   GET /categories
// @access  Subscribe
const getAllCategories = asyncHandler(async (req, res) => {

  let categories = await Category.find().select("-products");
  categories = sortByName(categories);
  res.status(200).json(categories);


});

// @desc    Create a category
// @route   POST /categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: 'קטגוריה חדשה',
  });
  const newCategory = await category.save();
  res.status(201).json(newCategory);
});



// @desc    Update a category
// @route   PUT /categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id || req.params.id.length < 2 || !req.body || !req.body.name) {

    res.status(400);
    throw new Error("Invalid request");

  }
  // Find the Category
  const category = await Category.findById(req.params.id);
  if (!category) {

    res.status(404);
    throw new Error("No category found");

  }
  // Check if category already exist
  const exists = await Category.findOne({ name: req.body.name });
  if (exists) {

    res.status(400);
    throw new Error("Category name already exists");

  }
  // Update the category
  if (!isValidCategory({ name: req.body.name.trim() })) {
    res.status(400);
    throw new Error("Name is not valid");
  }
  category.name = req.body.name.trim();
  const updatedCategory = await category.save();
  res.status(201).json(updatedCategory);


});



// @desc    Get a category by Id
// @route   GET /categories/:id
// @access  Subscribe
const getCategoryById = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id || req.params.id.length < 2) {
    res.status(400);
    throw new Error("Invalid category id");

  }
  const category = await Category.findById(req.params.id)
    .populate({
      path: 'products',
      select: '-category',
      populate: {
        path: 'prices',
        select: '-product',
        populate: {
          path: 'chain',
          select: '-prices',
          populate: {
            path: 'stores',
            select: '-prices',
          }
        }
      }
    });
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.status(201).json(category);

});



// @desc    Delete a category
// @route   DELETE /categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  if (!req.params || !req.params.id || req.params.id < 2) {
    res.status(400);
    throw new Error("Invalid category id");
  }
  await Category.deleteOne({ _id: req.params.id });
  res.json({ message: "Category removed" });

});


const deleteProductFromCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.body.categoryId });
  let products = [...category.products];
  products = products.filter((prod) => prod._id != req.body.productId);
  category.products = products;
  await category.save();
  res.json(category);

});

const addProductToCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne(req.query.categoryId);
  let products = [...category.products];
  let include = false;


  for (const prod of products) {
    if (prod == req.body.productId) {
      include = true;
    }
  }
  if (!include) {
    const product = await Product.findOne({ _id: req.body.productId });
    products = [...products, product];
    category.products = products;
    await category.save();
  }

  res.json(category);

});



export {
  getCategories,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
  deleteProductFromCategory,
  addProductToCategory,
  getAllCategories
};


function sortByName(arr) {
  return arr.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}