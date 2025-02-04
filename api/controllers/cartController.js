import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/cartModel.js';
import Chain from "../models/chainModel.js";
import distance from "../utils/distance.js";


// @desc    Get all user's carts
// @route   GET /carts/
// @access  Subscribe
const getCartsByUser = asyncHandler(async (req, res) => {
  let carts = null;
  if (!carts) {
    carts = await Cart.find({ user: req.user._id }).populate({
      path: 'user',
      select: '-orders -carts -password'
    })
      .populate('orderItems.product');
  }
  res.json(carts);
});




// @desc    Create a cart
// @route   POST /carts
// @access  Subtribe
const createCart = asyncHandler(async (req, res) => {
  const cart = await Cart.create({
    user: req.user._id,
    orderItems: [...req.body.orderItems],
    price: req.body.price,
  });
  const newCart = await cart.save();
  res.status(201).json(newCart);
});


// @desc    Update a cart
// @route   PUT /carts/:id
// @access  Subscribe
const updateCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findById(req.params.id).populate({
    path: 'user',
    select: '-orders -carts -password'
  })
    .populate('orderItems.product');
  if (!cart) {
    throw new Error("No Cart found");
  }
  for (let key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      const value = req.body[key];
      cart[key] = value;
    }
  }
  let updatedCart = await Cart.save();
  updatedCart = await Cart.populate(updatedCart, { path: "orderItems.product" });
  res.status(201).json(updatedCart);
});

// @desc    Get a cart by Id
// @route   GET /carts/:id
// @access  Subscribe
const getCartById = asyncHandler(async (req, res) => {
  const cart = await Cart.findById(req.params.id).populate({
    path: 'user',
    select: '-orders -carts -password'
  })
    .populate('orderItems.product');
  if (!cart) {
    throw new Error("Cart not found");
  }
  res.status(201).json(cart);
});

// @desc    Delete a cart
// @route   DELETE /carts/:id
// @access  Subscribe
const deleteCart = asyncHandler(async (req, res) => {
  await Cart.deleteOne({ _id: req.params.id });
  res.json({ message: "Cart removed" });
});

// @desc    calc cart
// @route   PUT /calc
// @access  Open
const CartCalc = asyncHandler(async (req, res) => {
  const chain = await Chain.findOne({ _id: req.body.chainId })
    .populate({
      path: 'prices',
    })
    .populate({
      path: 'stores',
      select: "-prices"
    });
  console.log(req.body.position);
  let sum = 0;
  const items = req.body.cartItems;

  for (const price of chain.prices) {
    for (const item of items) {
      if (price.product == item._id) {
        sum += (item.qty * price.number).toFixed(2);
      }
    }
  }

  let arr = [...chain.stores];

  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      ...arr[i]._doc,
      dis: distance(req.body.position.latitude, arr[i].location.latitude, req.body.position.longitude, arr[i].location.longitude)
    };
  }

  arr = sortByDis(arr);
  console.log(arr[0]);
  res.json({ sum, store: arr[0] });

});








export {
  createCart,
  updateCart,
  getCartById,
  deleteCart,
  getCartsByUser,
  CartCalc
};

function sortByDis(arr) {
  return arr.sort((a, b) => {
    if (a.dis < b.dis) {
      return -1;
    }
    if (a.dis > b.dis) {
      return 1;
    }
    return 0;
  });
}