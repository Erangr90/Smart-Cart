import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import Category from "../models/categoryModel.js";
import Chain from "../models/chainModel.js";
import isValidProduct from "../models/modelsValidation/ProductValidation.js";

// @desc    Fetch products by query
// @route   GET /products
// @access  Admin
const getProducts = asyncHandler(async (req, res) => {
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

  let count = null;
  let products = null;
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
      select: '-product',
      populate: {
        path: 'chain',
        select: '-prices',
        populate: {
          path: 'stores',
          select: '-prices',
        }
      }
    });

  products = await sortByCategory(products);
  for (let product of products) {
    product.prices = await sortByPrice(product.prices);
  }

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});
// @desc    Fetch products by query by user
// @route   GET /products/query
// @access  Admin
const getProductsByUser = asyncHandler(async (req, res) => {
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

  let count = null;
  let products = null;
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
      select: '-product',
      populate: {
        path: 'chain',
        select: '-prices',
        populate: {
          path: 'stores',
          select: '-prices',
        }
      }
    });

  products = await sortByCategory(products);
  for (let product of products) {
    product.prices = await sortByPrice(product.prices);
  }
  for (let product of products) {
    product.prices = [
      product.prices[0],
      product.prices[1],
      product.prices[2]
    ];
  }

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
  let product = await Product.findById(req.params.id)
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
  product.prices = await sortByPrice(product.prices);
  return res.json(product);
});

// @desc    Fetch single product by User
// @route   GET /products/:id/prices
// @access  Subscribe
const getProductByIdByUser = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  let product = await Product.findById(req.params.id)
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
  product.prices = await sortByPrice(product.prices);
  product.prices = [
    product.prices[0],
    product.prices[1],
    product.prices[2],
  ];

  return res.json(product);
});

// @desc    Fetch single product by chipest prices
// @route   GET /products/:id/top_prices
// @access  Subscribe
const getProductTopPrices = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  let product = await Product.findById(req.params.id)
    .populate({
      path: 'category',
      select: '-products',
    })
    .populate({
      path: 'prices',
      select: '-product',
      populate: {
        path: 'store chain',
        select: '-prices',
      },
    });
  if (!product._id) {
    res.status(404);
    throw new Error("Product Not found");
  }
  product.prices = await sortByPrice(product.prices);
  product.prices = [
    product.prices[0],
    product.prices[1],
    product.prices[2],
  ];

  // Get store locations
  for (let price of product.prices) {
    if (price.chain) {
      let temp = await Chain.findOne({ _id: price.chain._id }).populate({
        path: 'stores',
        select: '-prices',
      });
      price.chain.stores = temp.stores;
    }
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
          const category = await Category.findOne({ _id: req.body[key] });
          if (!category) {
            res.status(400);
            throw new Error(`Invalid ${key}`);
          }
          product[key] = category._id;
          category.products = category.products.filter((id) => id != req.body.productId);
          category.products = [...category.products, product._id];
          await category.save();
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

const getTopViewsProducts = asyncHandler(async (req, res) => {


  let products = await Product.find({}).sort({ views: -1 }).limit(30).populate({
    path: 'category',
    select: '-products',
  })
    .populate({
      path: 'prices',
      select: '-product',
      populate: {
        path: 'store chain',
        select: '-prices',
      },
    });

  for (let product of products) {
    product.prices = await sortByPrice(product.prices);
    product.prices = [
      product.prices[0],
      product.prices[1],
      product.prices[2],
    ];
    // if (product.prices[0]) {
    //   console.log(product.prices);

    // }
    // Get store locations
    for (let price of product.prices) {
      if (price?.chain) {
        let temp = await Chain.findOne({ _id: price.chain._id }).populate({
          path: 'stores',
          select: '-prices',
        });
        price.chain.stores = temp.stores;
      }
    }
  }
  // console.log(products);
  return res.json(products);

});

const updateProductViews = asyncHandler(async (req, res) => {

  // Request validation
  if (!req.params || !req.params.id || !req.body) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the product
  const product = await Product.findById(req.params.id);
  if (product) {
    product.views = req.body.views;
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


export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductTopPrices,
  getTopViewsProducts,
  updateProductViews,
  getProductsByUser,
  getProductByIdByUser
};
// --------------------------------------- Help Functions ------------------------------------
function sortByCategory(arr) {
  return arr.sort((a, b) => {
    if (a.category.name < b.category.name) {
      return -1;
    }
    if (a.category.name > b.category.name) {
      return 1;
    }
    return 0;
  });
}

function sortByPrice(arr) {
  return arr.sort((a, b) => {
    if (a.number < b.number) {
      return -1;
    }
    if (a.number > b.number) {
      return 1;
    }
    return 0;
  });
}

