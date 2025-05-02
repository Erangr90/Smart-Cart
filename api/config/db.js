import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME,
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD
    }

    );

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);


  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


export default connectDB;

