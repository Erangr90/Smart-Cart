import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  // getSaleProducts,
} from '../controllers/productController.js';
import { subscribe, admin } from '../middleware/authMiddleware.js';

router.route('/').get(subscribe, admin, getProducts).post(subscribe, admin, createProduct);
router
  .route('/:id')
  .get(subscribe, getProductById)
  .put(subscribe, admin, updateProduct)
  .delete(subscribe, admin, deleteProduct);


export default router;
