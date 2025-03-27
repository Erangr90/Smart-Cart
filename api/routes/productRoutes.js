import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductTopPrices,
  getTopViewsProducts,
  updateProductViews,
  getProductsByUser,
  getProductByIdByUser
} from '../controllers/productController.js';
import { subscribe, admin } from '../middleware/authMiddleware.js';


router.route("/top").get(getTopViewsProducts);
router.route("/query").get(getProductsByUser);
router.route('/').get(subscribe, getProducts).post(subscribe, admin, createProduct);
router
  .route('/:id/prices').get(getProductByIdByUser);
router
  .route('/:id')
  .get(subscribe, admin, getProductById)
  .put(subscribe, admin, updateProduct)
  .delete(subscribe, admin, deleteProduct);
router
  .route('/:id/top_prices')
  .get(getProductTopPrices);
router.route("/update_views/:id").put(subscribe, updateProductViews);




export default router;
