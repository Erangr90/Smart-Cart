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


export default Price;