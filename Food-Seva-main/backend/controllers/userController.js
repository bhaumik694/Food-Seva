import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already in use");
  }

  const user = await User.create({ name, email, password, phone });

  if (user) {
    const token = generateToken(res, user._id);
    res
      .status(201)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token,
      });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res
      .status(200)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token,
      });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
};

export const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  try {
    const otpResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });

    res
      .status(200)
      .json({ success: true, message: "OTP sent successfully!", otpResponse });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error sending OTP", error });
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status === "approved") {
      res
        .status(200)
        .json({ success: true, message: "OTP Verified Successfully!" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error verifying OTP", error });
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
      { $or: [{ email: identifier }, { phone: identifier }] },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});
