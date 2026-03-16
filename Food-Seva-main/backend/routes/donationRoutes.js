import express from "express";
import { recordOnChain, getDonationsFromChain, getDonations} from "../controllers/donationController.js";
const router = express.Router();

router.get("/:donorId", getDonations);

router.post("/record", recordOnChain) ;

router.get("/get-donations", getDonationsFromChain);
export default router;
