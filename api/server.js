import path from "path";
import dotenv from "dotenv";
import express from "express";
import colors from "colors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import chainRouts from "./routes/chainRoutes.js";
import priceRouts from "./routes/priceRoutes.js";
import cartRouts from "./routes/cartRoutes.js";
import storeRouts from "./routes/storeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subscriptionRoute from "./routes/subscriptionRoutes.js";
import unitOfMeasureRoutes from "./routes/unitOfMeasureRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import logger, { systemLogStream } from "./middleware/loggerMiddleware.js";





const port = process.env.PORT || 5000;


const app = express();

connectDB();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logger);

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/chains", chainRouts);
app.use("/prices", priceRouts);
app.use("/carts", cartRouts);
app.use("/stores", storeRouts);
app.use("/categories", categoryRoutes);
app.use("/subscriptions", subscriptionRoute);
app.use("/unitsOfMeasure", unitOfMeasureRoutes);
app.use('/uploads', uploadRoutes);






const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get('/', (req, res) => {
  res.send('API is running....');
});


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
  );

  systemLogStream.write(
    `Server running in ${process.env.NODE_ENV
    } mode on port ${port} at ${new Date().toISOString()}\n`
  );


});
export default app;
