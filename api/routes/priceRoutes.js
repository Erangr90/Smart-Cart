import express from "express";
const router = express.Router();
import {
  getPrices,
  createPrice,
  updatePrice,
  getPriceById,
  deletePrice,
} from "../controllers/priceController.js";
import { subscribe , admin} from "../middleware/authMiddleware.js";

router.route("/").post(subscribe, admin, createPrice).get(subscribe,admin,getPrices);
router
  .route("/:id")
  .put(subscribe, admin, updatePrice)
  .get(subscribe,admin, getPriceById)
  .delete(subscribe, admin, deletePrice);

export default router;
