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
    totalPrice: {
      type: Number,
      default: 0.0,
      validate: {
        validator: function (v) {
          return /^\d{1,7}(\.\d{1,2})?$/.test(v);
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

export default Cart;
