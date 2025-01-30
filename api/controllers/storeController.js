import asyncHandler from "../middleware/asyncHandler.js";
import Store from "../models/storeModel.js";
import Chain from "../models/chainModel.js";
import Price from "../models/priceModel.js";
import isValidStore from "../models/modelsValidation/StoreValidation.js";
import getCord from "../utils/adreess_cord.js";


// @desc    Fetch stores query
// @route   GET /stores/
// @access  Subtribe
const getStores = asyncHandler(async (req, res) => {
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
  const count = await Store.countDocuments({ ...keyword });
  let stores = null;
  // Admin case for get the chain and prices
  if (req.user.isAdmin) {
    // Find elements with pagination
    stores = await Store.find({ ...keyword })
      .populate({
        path: "chain",
        select: "-prices",
      })
      .populate({
        path: "prices",
        populate: {
          path: "product",
        },
      })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    // Not admin case for get less data
  } else {
    // Find elements with pagination
    stores = await Store.find({ ...keyword })
      .select("-prices")
      .populate("chain")
      .select("-prices")
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  }

  res.json({ stores, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Create a store
// @route   POST /stores
// @access  Admin
const createStore = asyncHandler(async (req, res) => {
  let store = null;

  // Case for add store to a chain
  if (req.body && req.body.name) {
    const chain = await Chain.findById(req.body.chainId);
    if (!chain) {
      throw new Error("chain not found");
    }
    store = {
      name: `${req.body.name} סניף חדש`,
      businessNumber: 1234567890,
      address: {
        city: "באר שבע",
        street: "רחוב 112",
        postalCode: 12345,
      },
      email: "store@mail.com",
      phone: "08-0000000",
      chain: req.body.chainId,
      branchNumber: 123,
    };
    if (isValidStore(store)) {
      store = await Store.create(store);
      chain.stores = [...chain.stores, store];
      await chain.save();
    }

    // Case for create a new store 
  } else {
    store = {
      name: "חנות חדשה",
      businessNumber: 1234567890,
      address: {
        city: "באר שבע",
        street: "רחוב 112",
        postalCode: 12345,
      },
      email: "store@mail.com",
      phone: "08-0000000",
      chain: req.body.chainId,
      branchNumber: 123,
    };
    if (isValidStore(store)) {
      store = await Store.create(store);
    }
  }
  // Save changes
  let newStore = await store.save();
  newStore = await Store.populate(
    newStore,
    {
      path: "chain",
      select: "-prices",
    },
    {
      path: "prices",
      populate: {
        path: "product",
      },
    }
  );

  res.status(201).json(newStore);
});

// @desc    Update a store
// @route   PUT /stores/:id
// @access  Admin
const updateStore = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id || !req.body) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the store
  const store = await Store.findById(req.params.id)
    .populate({
      path: "chain",
      select: "-prices",
    })
    .populate({
      path: "prices",
      populate: {
        path: "product",
      },
    });
  if (!store) {
    throw new Error("No Store found");
  }
  // Update the store's fields
  if (isValidStore(req.body)) {
    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        const value = req.body[key];
        store[key] = value;
      }
    }
  }

  // Save changes
  let updatedStore = await store.save();
  updatedStore = await Store.populate(
    updatedStore,
    {
      path: "chain",
      select: "-prices",
    },
    {
      path: "prices",
      populate: {
        path: "product",
      },
    }
  );
  res.status(201).json(updatedStore);
});

// @desc    Get a store by Id
// @route   GET /stores/:id
// @access  Subscribe
const getStoreById = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  let store = null;
  // Admin case for get the chain and prices
  if (req.user.isAdmin) {
    store = await Store.findById(req.params.id)
      .populate({
        path: "chain",
        select: "-prices",
      })
      .populate({
        path: "prices",
        populate: {
          path: "product store chain",
        },
      });
    // Not admin case for get less data 
  } else {
    store = await Store.findById(req.params.id)
      .select("-prices")
      .populate("chain")
      .select("-prices");
  }
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.status(201).json(store);
});

// @desc    Delete a store
// @route   DELETE /stores/:id
// @access  Admin
const deleteStore = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Delete the chain from the dataBase
  const deletedDocument = await Store.findOneAndDelete({ _id: req.params.id });
  // Delete the prices
  await Price.deleteMany({ store: req.params.id });
  // Case the store belong to a chain
  if (deletedDocument.chain) {
    const chain = await Chain.findById(deletedDocument.chain);
    chain.stores = chain.stores.filter(
      (store) => store.toString() == req.params.id
    );

    chain.save();
  }
  res.json({ message: "Store removed" });
});

// @desc    Convert address
// @route   GET /stores/convert
// @access  Admin
const convertAddress = asyncHandler(async (req, res) => {
  await getCord(req.params.id);
  res.json({ "ok": "1" });
});

export { getStores, createStore, updateStore, getStoreById, deleteStore, convertAddress };
