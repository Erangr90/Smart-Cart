import mongoose from 'mongoose';


const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-\&][A-Z]{1}[a-z]{1,}|[\'\-\&\s][a-z0-9]{1,})*$/.test(v) ||
            !/^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\s\&][\u05D0-\u05EA0-9]{1,})*$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    // businessNumber: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    //   validate: {
    //     validator: function (v) {
    //       return /^\d{2,10}$/.test(v);
    //     },
    //     message: props => `${props.value} is not valid`
    //   }

    // },
    address: {
      city: {
        type: String, required: true,
        validate: {
          validator: function (v) {
            return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[\'\-\s][A-Z]{1}[a-z]{1,}|[\'\-\s][a-z])*$/.test(v) ||
              !/^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\s][\u05D0-\u05EA]{1,})*$/.test(v);
          },
          message: props => `${props.value} is not valid`
        }
      },
      street: {
        type: String, required: true,
        validate: {
          validator: function (v) {
            return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[\'\-\s][A-Z]{1}[a-z]{1,}\s[0-9]+|[\'\-\s][a-z]\s[0-9]+)*$/.test(v) ||
              !/^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\s][\u05D0-\u05EA]{1,}|[\u05D0-\u05EA]+\s[0-9]+)*$/.test(v);
          },
          message: props => `${props.value} is not valid`
        }
      },
      postalCode: {
        type: Number, unique: true, sparse: true, validate: {
          validator: function (v) {
            return /^\d{3,10}$/.test(v);
          },
          message: props => `${props.value} is not valid`
        }
      }
    },
    // email: {
    //   type: String,
    //   required: true,
    //   validate: {
    //     validator: function (v) {
    //       return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
    //     },
    //     message: props => `${props.value} is not valid`
    //   }

    // },
    // phone: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   validate: {
    //     validator: function (v) {
    //       return /^0\d{1,2}-?\d{7}$/.test(v);
    //     },
    //     message: props => `${props.value} is not valid`
    //   }

    // },
    chain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chain',
    },
    // branchNumber: {
    //   type: Number,
    //   validate: {
    //     validator: function (v) {
    //       return /^\d{2,10}$/.test(v);
    //     },
    //     message: props => `${props.value} is not valid`
    //   }
    // },
    image: {
      type: String,
      // required: true,
      // unique: true,
      sparse: true,
      validate: {
        validator: function (v) {
          return /^[\w\d\/\/\-\.\u05D0-\u05EA]{2,80}$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    location: {
      longitude: {
        type: String,
        validate: {
          validator: function (v) {
            return /^(\d{2,3}.\d{6,7})|(\-\d{2,3}.\d{6,7})$/.test(v);
          },
          message: props => `${props.value} is not valid`
        }

      },
      latitude: {
        type: String,
        validate: {
          validator: function (v) {
            return /^(\d{2,3}.\d{6,7})|(\-\d{2,3}.\d{6,7})$/.test(v);
          },
          message: props => `${props.value} is not valid`
        }
      }
    },
    prices: [{
      type: mongoose.Schema.Types.ObjectId,
      // unique: true,
      // required: true,
      sparse: true,
      ref: 'Price',
    }]
  },
  { timestamps: true }
);

storeSchema.index({ name: 1 });
storeSchema.index({ location: 1 });
storeSchema.index({ chain: 1 });
storeSchema.index({ prices: 1 });



const Store = mongoose.model('Store', storeSchema);


const changeStream = Store.watch();

// changeStream.on('change', async (change) => {

//   const { operationType, fullDocument, updateDescription, documentKey, ns } = change;

//   switch (operationType) {
//     case "insert":
//       let store = await Store.findById(fullDocument._id).populate({
//         path: 'chain',
//         select: '-prices'
//       })
//       .populate({
//         path: 'prices',
//         populate: {
//           path: 'product',
//         },
//       });;
//       await redisClient.set(
//         `${ns.coll}:${fullDocument._id}`,
//         JSON.stringify(store),
//       );
//       break;
//     case "update":

//       const updatedFields = updateDescription.updatedFields;
//       let redisCache = await redisClient.get(`${ns.coll}:${documentKey._id}`);
//       if(!redisCache || updatedFields.prices || updatedFields.chain){
//         let store = await Store.findById(documentKey._id).populate({
//           path: 'chain',
//           select: '-prices'
//         })
//         .populate({
//           path: 'prices',
//           populate: {
//             path: 'product',
//           },
//         });
//         await redisClient.set(
//           `${ns.coll}:${documentKey._id}`,
//           JSON.stringify(store),
//         );
//       }else{
//         redisCache = await JSON.parse(redisCache);
//         for (const field in updatedFields) {
//           if (field !== 'chain') {
//             redisCache[field] = updatedFields[field];
//           }   
//         }   
//         await redisClient.set(`${ns.coll}:${documentKey._id}`, JSON.stringify(redisCache));
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

export default Store;