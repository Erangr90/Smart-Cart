import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return !/^(?=.{1,50}$)[A-Z]{1}[a-z0-9&\s]{1,}(?:[A-Z]{1}[a-z0-9&\s]{1,}|['-\s][A-Z]{1}[a-z0-9&\s]{1,}|['-\s][a-z0-9]{1,})*$/.test(v) ||
            !/ ^(?=.{1,50}$)[\u0590-\u05FF\uFB2A-\uFB4E0-9]{1,}(?:['"-\s][\u0590-\u05FF\uFB2A-\uFB4E0-9]{1,})*$/.test(v);
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

const Category = mongoose.model('Category', categorySchema);

export default Category;
