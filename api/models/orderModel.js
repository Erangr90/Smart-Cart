import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Store',
    },
    orderItems: [
      {
        qty: { type: Number, required: true,validate: {
          validator: function(v) {
            return v >= 1 && v <= 500;
          },
          message: props => `${props.value} exceeds the bounders of 1-500`
        } },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        price: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Price',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true,validate: {
        validator: function(v) {
          return v.length >= 2 && v.length <= 50;
        },
        message: props => `${props.value} exceeds the bounders of 2-50 characters`
      } },
      city: { type: String, required: true,validate: {
        validator: function(v) {
          return v.length >= 2 && v.length <= 50;
        },
        message: props => `${props.value} exceeds the bounders of 2-50 characters`
      } },
      postalCode: { type: String, required: true,validate: {
        validator: function(v) {
          return v.length >= 2 && v.length <= 25;
        },
        message: props => `${props.value} exceeds the bounders of 2-25 characters`
      } },
      country: { type: String, required: true,validate: {
        validator: function(v) {
          return v.length >= 2 && v.length <= 50;
        },
        message: props => `${props.value} exceeds the bounders of 2-50 characters`
      } },
    },
    paymentMethod: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v.length >= 2 && v.length <= 25;
        },
        message: props => `${props.value} exceeds the bounders of 2-25 characters`
      }
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

// const changeStream = Order.watch();

// changeStream.on('change', async (change) => {

//   const { operationType, fullDocument, updateDescription, documentKey, ns } = change;
//   let order =null
//   switch (operationType) {
//     case "insert":
//       order = await Order.findById(fullDocument._id).populate({
//         path: 'user',
//         select: '-orders -carts -password'
//       })
//       .populate('orderItems.product');
//       await redisClient.set(
//         `${ns.coll}:${order.user._id}:${order._id}`,
//         JSON.stringify(order),
//       );
//       break;
//     case "update":
//       order = await Order.findById(documentKey._id).populate({
//         path: 'user',
//         select: '-orders -carts -password'
//       })
//       .populate('orderItems.product');
//       await redisClient.set(
//         `${ns.coll}:${order.user._id}:${order._id}`,
//         JSON.stringify(order),
//       );
//       break;
//     case "delete":
//       order = await Order.findById(documentKey._id).populate({
//         path: 'user',
//         select: '-orders -carts -password'
//       })
//       .populate('orderItems.product');
//       await redisClient.del(`${ns.coll}:${order.user._id}:${order._id}`);
//       break;
//     default:
//       break;
//   }
// });

// changeStream.on('error', (error) => {
//   console.error('Change stream error:', error);
// });

export default Order;
