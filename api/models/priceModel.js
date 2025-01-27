import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema(
  {
    product:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Store',
    },
    chain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chain',
    },
    number: {
      type: Number,
      required:true,
    },
  },
  { timestamps: true } 
);

priceSchema.index({ product: 1 });
priceSchema.index({ store: 1 });
priceSchema.index({ chain: 1 });


const Price = mongoose.model('Price', priceSchema);

// const changeStream = Price.watch();

// changeStream.on('change', async (change) => {

//   const { operationType, fullDocument, updateDescription, documentKey, ns } = change;
//   let price =null
//   switch (operationType) {
//     case "insert":
//       price = await Price.findById(fullDocument._id).populate({
//         path: 'chain',
//         select: '-prices'
//       })
//       .populate({
//         path: 'store',
//         select: '-prices'
//       })
//       .populate('product');
//       await redisClient.set(
//         `${ns.coll}:${price.product._id}:${price._id}`,
//         JSON.stringify(price),
//       );
//       break;
//     case "update":
//       price = await Price.findById(documentKey._id).populate({
//         path: 'chain',
//         select: '-prices'
//       })
//       .populate({
//         path: 'store',
//         select: '-prices'
//       })
//       .populate('product');
//       await redisClient.set(
//         `${ns.coll}:${price.product._id}:${price._id}`,
//         JSON.stringify(price),
//       );
//       break;
//     case "delete":
//       price = await Price.findById(documentKey._id).populate({
//         path: 'chain',
//         select: '-prices'
//       })
//       .populate({
//         path: 'store',
//         select: '-prices'
//       })
//       .populate('product');
//       await redisClient.del(`${ns.coll}:${price.product._id}:${price._id}`);
//       break;
//     default:
//       break;
//   }
// });

// changeStream.on('error', (error) => {
//   console.error('Change stream error:', error);
// });

export default Price;