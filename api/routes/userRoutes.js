import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  userClicksAndSubtribe
} from "../controllers/userController.js";
import { subscribe, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(registerUser).get(subscribe, admin, getUsers);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(subscribe, getUserProfile)
  .put(subscribe, updateUserProfile);
router
  .route("/:id")
  .delete(subscribe, admin, deleteUser)
  .get(subscribe, admin, getUserById)
  .put(subscribe, admin, updateUser);

router.route("/update/:id").put(subscribe, userClicksAndSubtribe);

export default router;
