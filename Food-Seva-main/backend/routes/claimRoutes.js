import express from "express";
import { getClaims } from "../controllers/claimController.js"; // Adjust path if needed

const router = express.Router();

router.get("/:ngoId", getClaims);

export default router;
