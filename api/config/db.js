import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    // Connection String uri
    const uri = process.env.MONGO_URI

    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME, // Name of the database
      useNewUrlParser: true, // Parser for the format of the connection string
      useUnifiedTopology: true, // To opt in to using the new topology engine for the replica set
      // Authenticaion
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

