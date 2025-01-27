import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/cartModel.js';
// import redisClient from "../config/redis.js";


// @desc    Get all user's carts
// @route   GET /carts/
// @access  Subscribe
const getCartsByUser = asyncHandler(async (req, res) => {
  let carts= null
  // try {
  //   const keys = await redisClient.get(`carts:${req.user.id}:*`)
  //   if(keys && keys.length > 0){
  //     carts = []
  //     for (const key of keys) {
  //       const value = await redisClient.get(key);
  //       const parseValue = await JSON.parse(value);
  //       carts.push(parseValue);
  //     }
  //   }
  // } catch (error) {
  //   console.error(error)
  // }
  if(!carts){
    carts = await Cart.find({user:req.user._id}).populate({
      path: 'user',
      select: '-orders -carts -password'
    })
    .populate('orderItems.product')
  }
  res.json(carts)
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
  .populate('orderItems.product')
  if(!cart){
    throw new Error("No Cart found")
  }
  for (let key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      const value = req.body[key];
      cart[key] = value;
    }
  }
  let updatedCart = await Cart.save();
  updatedCart = await Cart.populate(updatedCart,{path:"orderItems.product"})
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
  .populate('orderItems.product')
  if(!cart){
    throw new Error("Cart not found")
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






  export {
    createCart,
    updateCart,
    getCartById,
    deleteCart,
    getCartsByUser
  };