import express from "express";
const router = express.Router();
import {
    createCart,
    updateCart,
    getCartById,
    deleteCart,
    getCartsByUser
} from "../controllers/cartController.js";
import { subscribe} from "../middleware/authMiddleware.js";

router.route("/").post(subscribe, createCart).get(subscribe, getCartsByUser);
router
  .route("/:id")
  .put(subscribe, updateCart)
  .get(subscribe, getCartById)
  .delete(subscribe, deleteCart);

export default router;
