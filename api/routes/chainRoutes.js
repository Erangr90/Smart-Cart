import express from "express";
const router = express.Router();
import {
    getChains,
    createChain,
    updateChain,
    getChainById,
    deleteChain,
} from "../controllers/chainController.js";
import { subscribe, admin } from "../middleware/authMiddleware.js";
// import {getCacheById} from "../middleware/cacheMiddleware.js"

router.route("/").get(subscribe, getChains).post(subscribe, admin, createChain);
router
  .route("/:id")
  .put(subscribe, admin, updateChain)
  .get(subscribe, getChainById)
  .delete(subscribe, admin, deleteChain);

export default router;
