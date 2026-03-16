import express from "express";
import { uploadFood } from "../controllers/donorController.js";
import { getAvailableFood } from "../controllers/ngoController.js";
import { claimFood, confirmClaim } from "../controllers/ngoController.js";

const router = express.Router();

// Donor routes
router.post("/upload-food", uploadFood);

// NGO routes
router.get("/available-food", getAvailableFood);
router.post("/claim-food", claimFood);

// Food claim routes
router.post("/confirm-claim", confirmClaim);

export default router;
