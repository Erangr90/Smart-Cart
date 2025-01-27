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
    subscriptions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    }],
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
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

// changeStream.on('change', async (change) => {

//   const { operationType, fullDocument, updateDescription, documentKey, ns } = change;

//   switch (operationType) {
//     case "insert":
//       let user = await User.findById(fullDocument._id);
//       await redisClient.set(
//         `${ns.coll}:${fullDocument._id}`,
//         JSON.stringify(user),
//       );
//       break;
//     case "update":
//       const updatedFields = updateDescription.updatedFields;
//       let redisCache = await redisClient.get(`${ns.coll}:${documentKey._id}`);
//       if(updatedFields.stores || !redisCache){
//         let user = await User.findById(documentKey._id);
//         await redisClient.set(`${ns.coll}:${documentKey._id}`, JSON.stringify(user));
//       } else{
//           redisCache = await JSON.parse(redisCache);
//           for (const field in updatedFields) {
//             redisCache[field] = updatedFields[field];
//           } 
//           await redisClient.set(`${ns.coll}:${documentKey._id}`, JSON.stringify(redisCache));
//       }
//       break;
//     case "delete":
//       await redisClient.del(`${ns.coll}:${documentKey._id}`);
//       break;
//     default:
//       break;
//   }
// });

// changeStream.on('error', (error) => {
//   console.error('Change stream error:', error);
// });


export default User;
