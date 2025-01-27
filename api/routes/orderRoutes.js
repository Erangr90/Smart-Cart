import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from '../controllers/orderController.js';
import { subscribe, admin } from '../middleware/authMiddleware.js';

router.route('/').post(subscribe, addOrderItems).get(subscribe, admin, getOrders);
router.route('/mine').get(subscribe, getMyOrders);
router.route('/:id').get(subscribe, getOrderById);
router.route('/:id/pay').put(subscribe, updateOrderToPaid);
router.route('/:id/deliver').put(subscribe, admin, updateOrderToDelivered);

export default router;
