import express from 'express';
import { sendOtp, verifyOtp, signup, login } from '../controllers/authController.js';
import {loginwithweb3 , reward} from "../controllers/web3controller.js"

const router = express.Router();

router.post('/sendOtp', sendOtp);   
router.post('/verifyOtp', verifyOtp);

router.post('/signup', signup);
router.post('/login', login);
router.post('/loginwithweb3', loginwithweb3);
router.post('/reward', reward);

export default router;
