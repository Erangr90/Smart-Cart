import mongoose from 'mongoose';

const unitOfMeasureSchema = mongoose.Schema(
  {
    name_he: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(?=.{1,25}$)[\u0590-\u05FF\uFB2A-\uFB4E]{1,}(?:['"-][\u0590-\u05FF\uFB2A-\uFB4E]{1,})*$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
    name_en: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(?=.{1,25}$)[A-Z]{1}[a-z]{1,}|[a-z]+(?:[A-Z]{1}[a-z]{1,}|['-][A-Z]{1}[a-z]{1,}|['-][a-z]{1,})*$/.test(v);
        },
        message: props => `${props.value} is not valid`
      }
    },
  },
  {
    timestamps: true,
  }
);

const UnitOfMeasure = mongoose.model('UnitOfMeasure', unitOfMeasureSchema);

export default UnitOfMeasure;
