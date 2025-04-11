import mongoose from "mongoose";
import colors from "colors";

import users from "./data/users.js";
import products from "./data/products.json" assert { type: "json" };
import categories from "./data/categories.js";
import subscription from "./data/subscription.js";
import unitOfMeasures from "./data/unitOfMeasures.js";
import chains from "./data/chains.js";
import stores from "./data/stores.js";

import User from "./models/userModel.js";
import Chain from "./models/chainModel.js";
import Store from "./models/storeModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import Cart from "./models/cartModel.js";
import Category from "./models/categoryModel.js";
import Subscription from "./models/subscriptionModel.js";
import UnitOfMeasure from "./models/unitOfMeasureModel.js";
import BlackToken from "./models/blackTokenModel.js";

import connectDB from "./config/db.js";

connectDB();

const importData = async () => {
  try {
    // await Product.deleteMany();
    // await Chain.deleteMany();
    // await Store.deleteMany();
    // await Cart.deleteMany();
    // await Category.deleteMany();
    // await Subscription.deleteMany();
    // await UnitOfMeasure.deleteMany();
    // await User.deleteMany();
    // await BlackToken.deleteMany();

    await User.insertMany(users);
    await Subscription.insertMany(subscription);
    // await Chain.insertMany(chains);
    // await Store.insertMany(stores);

    const initUnitOfMeasures = await UnitOfMeasure.insertMany(unitOfMeasures);
    const initCategories = await Category.insertMany(categories);

    const categoryProducts = products.map((product) => {
      switch (product.category) {
        case 1:
          return {
            ...product,
            category: initCategories.find((cat) => cat.name == "חטיפים")._id,
          };
        case 2:
          return {
            ...product,
            category: initCategories.find((cat) => cat.name == "ניקיון")._id,
          };
        case 3:
          return {
            ...product,
            category: initCategories.find((cat) => cat.name == "בשר")._id,
          };
        case 4:
          return {
            ...product,
            category: initCategories.find((cat) => cat.name == "חלבי")._id,
          };
        default:
          break;
      }
    });

    const measuresProducts = categoryProducts.map((product) => {
      if (
        initUnitOfMeasures.find((unit) => unit.name == product.unitOfMeasure) !=
        undefined
      ) {
        return {
          ...product,
          unitOfMeasure: initUnitOfMeasures.find(
            (unit) => unit.name == product.unitOfMeasure
          )._id,
        };
      } else {
        return { ...product };
      }
    });

    await Product.insertMany(measuresProducts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Chain.deleteMany();
    await Store.deleteMany();
    await Cart.deleteMany();
    await Category.deleteMany();
    await Subscription.deleteMany();
    await UnitOfMeasure.deleteMany();
    await User.deleteMany();
    await BlackToken.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
