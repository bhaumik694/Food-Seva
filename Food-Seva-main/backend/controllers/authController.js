import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Donor from '../models/donorModel.js';
import NGO from '../models/ngoModel.js';
import twilio from 'twilio';
import asyncHandler from "express-async-handler"
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = 'your_secret_key';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  try {
    const otpResponse = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: formattedPhone, channel: 'sms' });

    res.status(200).json({ success: true, message: 'OTP sent successfully!', otpResponse });
  } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, message: 'Error sending OTP', error });
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
  try {
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: formattedPhone, code: otp });

    if (verificationCheck.status === 'approved') {
      res.status(200).json({ success: true, message: 'OTP Verified Successfully!' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP', error });
  }
});


export const signup = async (req, res) => {
  const { name, email, phone, role, registeredNumber, password,address } = req.body;

  try {
    const Model = role === 'donor' ? Donor : NGO;
    const existingUser = await Model.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Model({
      name,
      email,
      phone,
      role, 
      address,
      ...(role === 'donor' ? {} : { registeredNumber }),
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Signup successful. ' });

  } catch (error) {
    res.status(500).json({ message: 'Error in signup', error: error.message });
  }
};
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const Model = role === 'donor' ? Donor : NGO;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ token, message: 'Login successful', user });

  } catch (error) {
    res.status(500).json({ message: 'Error in login', error: error.message });
  }
};

  
