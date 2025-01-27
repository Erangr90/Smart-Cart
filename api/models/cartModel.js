import mongoose from "mongoose";


const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        qty: {
          type: Number,
          required: true,
          validate: {
            validator: function (v) {
              return /^[0-9]{1,3}$/.test(v);
            },
            message: (props) => `${props.value} is not valid`,
          },
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        price: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Price",
        },
      },
    ],
    store: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Store",
    },
    totalPrice: {
      type: Number,
      default: 0.0,
      validate: {
        validator: function (v) {
          return /^\d{1,5}(\.\d{1,2})?$/.test(v);
        },
        message: (props) => `${props.value} is not valid`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

// const changeStream = Cart.watch();

// changeStream.on('change', async (change) => {

//   const { operationType, fullDocument, updateDescription, documentKey, ns } = change;
//   let cart =null
//   switch (operationType) {
//     case "insert":
//       cart = await Cart.findById(fullDocument._id).populate({
//         path: 'user',
//         select: '-orders -carts -password'
//       })
//       .populate('orderItems.product');
//       await redisClient.set(
//         `${ns.coll}:${cart.user._id}:${cart._id}`,
//         JSON.stringify(cart),
//       );
//       break;
//     case "update":
//       cart = await Cart.findById(documentKey._id).populate({
//         path: 'user',
//         select: '-orders -carts -password'
//       })
//       .populate('orderItems.product');
//       await redisClient.set(
//         `${ns.coll}:${cart.user._id}:${cart._id}`,
//         JSON.stringify(cart),
//       );
//       break;
//     case "delete":
//       cart = await Cart.findById(documentKey._id).populate({
//         path: 'user',
//         select: '-orders -carts -password'
//       })
//       .populate('orderItems.product');
//       await redisClient.del(`${ns.coll}:${cart.user._id}:${cart._id}`);
//       break;
//     default:
//       break;
//   }
// });

// changeStream.on('error', (error) => {
//   console.error('Change stream error:', error);
// });

export default Cart;
