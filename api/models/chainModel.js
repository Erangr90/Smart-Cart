import mongoose from 'mongoose';

const chainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|['\-&][A-Z]{1}[a-z]{1,}|['\-&][a-z]{1,})*$/.test(v) ||
            !/^(?=.{1,50}$)[\u05D0-\u05EA]{2,}(?:[\s\&\-]+[\u05D0-\u05EA0-9]{2,}|[\"\]+[\u05D0-\u05EA]+)*$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
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
    // businessNumber: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   validate: {
    //     validator: function (v) {
    //       return /^\d{2,10}$/.test(v);
    //     },
    //     message: props => `${props.value} is not valid`
    //   }

    // },
    // email: {
    //   type: String,
    //   required: true,
    //   unique: true,
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
    stores: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // unique: true,
      sparse: true,
      ref: 'Store',
    }],
    prices: [{
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      // unique: true,
      // sparse: true,
      ref: 'Price',
    }]
  },
  { timestamps: true }
);



chainSchema.index({ name: 1 });
chainSchema.index({ businessNumber: 1 });


const Chain = mongoose.model('Chain', chainSchema);

// const changeStream = Chain.watch();

// changeStream.on('change', async (change) => {

//   const { operationType, fullDocument, updateDescription, documentKey, ns } = change;

//   switch (operationType) {
//     case "insert":
//       let chain = await Chain.findById(fullDocument._id).populate({
//         path: 'stores',
//         select: '-prices'
//       })
//       .populate({
//         path: 'prices',
//         populate: {
//           path: 'product',
//         },
//       });
//       await redisClient.set(
//         `${ns.coll}:${fullDocument._id}`,
//         JSON.stringify(chain),
//       );
//       break;
//     case "update":
//       const updatedFields = updateDescription.updatedFields;
//       let redisCache = await redisClient.get(`${ns.coll}:${documentKey._id}`);
//       if(updatedFields.stores || updatedFields.prices || !redisCache){
//         let chain = await Chain.findById(documentKey._id).populate({
//           path: 'stores',
//           select: '-prices'
//         })
//         .populate({
//           path: 'prices',
//           populate: {
//             path: 'product',
//           },
//         });
//         await redisClient.set(`${ns.coll}:${documentKey._id}`, JSON.stringify(chain));
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

export default Chain;