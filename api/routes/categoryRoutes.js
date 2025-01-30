import express from "express";
const router = express.Router();
import {
  getCategories,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
  deleteProductFromCategory,
  addProductToCategory,
  getAllCategories
} from "../controllers/categoryController.js";
import { subscribe, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(getCategories)
  .post(subscribe, admin, createCategory);
router
  .route("/all")
  .get(getAllCategories);
router
  .route("/:id")
  .put(subscribe, admin, updateCategory)
  .get(getCategoryById)
  .delete(subscribe, admin, deleteCategory);

router
  .route("/:id/:product")
  .delete(subscribe, admin, deleteProductFromCategory)
  .post(subscribe, admin, addProductToCategory);

export default router;
