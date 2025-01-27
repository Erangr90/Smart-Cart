import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|['-][A-Z]{1}[a-z]{1,}|['-][a-z]{1,})*$/.test(v) ||
            !/ ^(?=.{1,50}$)[\u0590-\u05FF\uFB2A-\uFB4E0-9]{1,}(?:['"-\s][\u0590-\u05FF\uFB2A-\uFB4E0-9]{1,})*$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{1,5}(\.\d{1,2})?$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    discount: {
      type: Number,
      default: 0.0,
      validate: {
        validator: function (v) {
          return /^\d{1,5}(\.\d{1,2})?$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    description: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(?=.{1,255}$)[a-zA-Z\u0590-\u05FF\uFB2A-\uFB4E0-9!@#\[\]\{\}\s\$%\^\&*\)\(\\+=._:';/<>|?"`~,-]*$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    ]
  },
  {
    timestamps: true,
  }
);





const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
