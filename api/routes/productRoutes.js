import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductTopPrices
  // getSaleProducts,
} from '../controllers/productController.js';
import { subscribe, admin } from '../middleware/authMiddleware.js';

router.route('/').get(subscribe, getProducts).post(subscribe, admin, createProduct);
router
  .route('/:id')
  .get(subscribe, getProductById)
  .put(subscribe, admin, updateProduct)
  .delete(subscribe, admin, deleteProduct);
router
  .route('/:id/top_prices')
  .get(getProductTopPrices);


export default router;
