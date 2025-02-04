import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|['-][A-Z]{1}[a-z]{1,}|['-][a-z]{1,})*$/.test(v) ||
            !/ ^(?=.{1,50}$)[\u0590-\u05FF\uFB2A-\uFB4E]{1,}(?:['-][\u0590-\u05FF\uFB2A-\uFB4E]{1,})*$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|['-][A-Z]{1}[a-z]{1,}|['-][a-z]{1,})*$/.test(v) ||
            !/ ^(?=.{1,50}$)[\u0590-\u05FF\uFB2A-\uFB4E]{1,}(?:['-][\u0590-\u05FF\uFB2A-\uFB4E]{1,})*$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    password: {
      type: String,
      required: true,
    },
    clicks: {
      date: {
        type: Date,
        default: new Date()
      },
      numOfClicks: {
        type: Number,
        default: 0
      }
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
    isSubtribe: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

const changeStream = User.watch();



export default User;
