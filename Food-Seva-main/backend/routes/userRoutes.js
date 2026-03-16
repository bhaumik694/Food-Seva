import express from "express";
import {
  signup,
  login,
  logout,
  sendOtp,
  verifyOtp,
  updatePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/update-password", updatePassword);

export default router;
