import mongoose from 'mongoose';


const productSchema = mongoose.Schema(
  {
    // product_id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   validate: {
    //     validator: function(v) {
    //       return v.length >= 2 && v.length <= 25;
    //     },
    //     message: props => `${props.value} exceeds the bounders of 2-25 characters`
    //   }
    // },
    name: {
      type: String,
      // required: true,
      // validate: {
      //   validator: function (v) {
      //     return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-\&\s][A-Z]{1}[a-z]{1,}|[\'\-\&\s][a-z]{1,})*$/.test(v) ||
      //       !/^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\&\%][\u05D0-\u05EA]{1,})*$/.test(v);
      //   },
      //   message: props => `${props.value} is not valid`
      // }
    },
    image: {
      type: String,
      // required: true,
      // unique: true,
      // sparse: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[\w\d\/\/\-\.\u05D0-\u05EA]{2,80}$/.test(v);
      //   },
      //   message: props => `${props.value} is not valid`
      // }
    },
    manufacturer: {
      type: String,
      // required: true,
      // validate: {
      //   validator: function(v) {
      //     return v.length >= 2 && v.length <= 25;
      //   },
      //   message: props => `${props.value} exceeds the bounders of 2-25 characters`
      // }
    },
    // manufacturer_id: {
    //     type: String,
    //     required: true,
    //     validate: {
    //       validator: function(v) {
    //         return v.length >= 2 && v.length <= 25;
    //       },
    //       message: props => `${props.value} exceeds the bounders of 2-25 characters`
    //     }
    // },
    category:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      // required: true
    }],
    prices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        // required: true
      }
    ],
    description: {
      type: String,
      // required: true,
      // validate: {
      //   validator: function (v) {
      //     return /^(?=.{1,255}$)[a-zA-Z\u05D0-\u05EA0-9\!\@\#\[\]\{\}\s\$\%\^\&\*\)\(\\\+\=\.\_\:\'\;\/\<\>\|\?\"\`\~\,\-]*$/.test(v);
      //   },
      //   message: props => `${props.value} is not valid`
      // }
    },
    barcode: {
      type: String,
      unique: true,
      // required: true,
      // validate: {
      //   validator: function (v) {
      //     return /^\d{2,50}$/.test(v);
      //   },
      //   message: props => `${props.value} is not valid`
      // }
    },
    // product_is_real_barcode:{
    //   type: String,
    //   required: true,
    //   validate: {
    //     validator: function(v) {
    //       return v.length >= 2 && v.length <= 25;
    //     },
    //     message: props => `${props.value} exceeds the bounders of 2-25 characters`
    //   }
    // },
    unitOfMeasure: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'UnitOfMeasure',
      // required:true
      // type: String,
      // required:true
    },
    measure: {
      type: Number,
      // required: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[0-9]{1,7}$/.test(v);
      //   },
      //   message: props => `${props.value} is not valid`
      // }
    },
    country: {
      type: String,
      // required: true,
      // validate: {
      //   validator: function (v) {
      //     return !/^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-\&\s][A-Z]{1}[a-z]{1,}|[\'\-\&\s][a-z]{1,})*$/.test(v) ||
      //       !/^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\&\%][\u05D0-\u05EA]{1,})*$/.test(v);
      //   },
      //   message: props => `${props.value} is not valid`
      // }
    },
    // country_id:{
    //   type: String,
    //   required: true,
    //   validate: {
    //     validator: function(v) {
    //       return v.length >= 2 && v.length <= 50;
    //     },
    //     message: props => `${props.value} exceeds the bounders of 2-50 characters`
    //   }
    // },

    country_code: {
      type: String,
      // required: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[A-Z]{2,3}$/.test(v);
      //   },
      //   message: props => `${props.value} is not valid`
      // }
    },

  },
  {
    productSchema: true,
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ manufacturer: 1 });



const Product = mongoose.model('Product', productSchema);

// const changeStream = Product.watch();

// changeStream.on('change', async (change) => {

//   const { operationType, fullDocument, updateDescription, documentKey, ns } = change;

//   switch (operationType) {
//     case "insert":
//       let product = await Product.findById(fullDocument._id).populate('category');
//       await redisClient.set(
//         `${ns.coll}:${fullDocument._id}`,
//         JSON.stringify(product),
//       );
//       break;
//     case "update":
//       const updatedFields = updateDescription.updatedFields;
//       let redisCache = await redisClient.get(`${ns.coll}:${documentKey._id}`);
//       if(updatedFields.category || !redisCache){
//         let product = await Product.findById(documentKey._id).populate('category');
//         await redisClient.set(`${ns.coll}:${documentKey._id}`, JSON.stringify(product));
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

export default Product;
