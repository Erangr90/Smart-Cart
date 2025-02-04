import express from "express";
const router = express.Router();
import {
    getUnitsOfMeasure,
    createUnitOfMeasure,
    updateUnitOfMeasure,
    getUnitOfMeasureById,
    deleteUnitsOfMeasure
} from "../controllers/unitOfMeasureController.js";
import { subscribe, admin } from "../middleware/authMiddleware.js";

router.route("/").get(subscribe, admin, getUnitsOfMeasure).post(subscribe, admin, createUnitOfMeasure);
router
  .route("/:id")
  .put(subscribe, admin, updateUnitOfMeasure)
  .get(subscribe, getUnitOfMeasureById)
  .delete(subscribe, admin, deleteUnitsOfMeasure);

export default router;

