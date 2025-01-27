import express from "express";
import {
    uploadImg
} from "../controllers/uploadController.js";
import { subscribe, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/uploadImag").post(subscribe, admin, uploadImg)

export default router;