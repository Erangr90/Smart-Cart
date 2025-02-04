import express from "express";
const router = express.Router();
import {
  getStores,
  createStore,
  updateStore,
  getStoreById,
  deleteStore,
  convertAddress
} from "../controllers/storeController.js";
import { subscribe, admin } from "../middleware/authMiddleware.js";

router.route("/").get(subscribe, getStores).post(subscribe, admin, createStore);

router.route("/convert/:id").get(subscribe, admin, convertAddress);

router
  .route("/:id")
  .put(subscribe, admin, updateStore)
  .get(subscribe, getStoreById)
  .delete(subscribe, admin, deleteStore);


export default router;
