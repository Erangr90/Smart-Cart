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


export default Store;