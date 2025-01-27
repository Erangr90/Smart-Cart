import express from "express";
const router = express.Router();
import {
    getSubscriptions,
    createSubscription,
    updateSubscription,
    getSubscription,
    deleteSubscription
} from "../controllers/subscriptionController.js";
import { subscribe, admin } from "../middleware/authMiddleware.js";
import {getCacheById, getCacheByRoute} from "../middleware/cacheMiddleware.js"

router.route("/").get(subscribe,getCacheByRoute, getSubscriptions).post(subscribe, admin, createSubscription);
router
  .route("/:id")
  .put(subscribe, admin, updateSubscription)
  .get(subscribe,getCacheById, getSubscription)
  .delete(subscribe, admin, deleteSubscription);

export default router;

