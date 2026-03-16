import Food from "../models/foodItemModel.js";
import Donor from "../models/donorModel.js";
import NGO from "../models/ngoModel.js";
import asyncHandler from "express-async-handler";

export const addFood = asyncHandler(async (req, res) => {
  const { foodType, quantity, expiryDate, pickupLocation } = req.body;
  const donorId = req.user.id;

  const donor = await Donor.findById(donorId);
  if (!donor) {
    return res.status(404).json({ message: "Donor not found" });
  }

  const food = new Food({
    donor: donorId,
    foodType,
    quantity,
    expiryDate,
    pickupLocation,
  });

  await food.save();
  res.status(201).json({ message: "Food donation added successfully", food });
});

export const getAvailableFood = asyncHandler(async (req, res) => {
  const availableFood = await Food.find({ status: "Available" }).populate(
    "donor",
    "name phone"
  );
  res.status(200).json({ success: true, food: availableFood });
});

export const claimFood = asyncHandler(async (req, res) => {
  const foodId = req.params.foodId;
  const ngoId = req.user.id; // Extracted from JWT

  const ngo = await NGO.findById(ngoId);
  if (!ngo) {
    return res.status(404).json({ message: "NGO not found" });
  }

  const food = await Food.findById(foodId);
  if (!food) {
    return res.status(404).json({ message: "Food not found" });
  }

  if (food.status !== "Available") {
    return res.status(400).json({ message: "Food already claimed or expired" });
  }

  food.claimedByNGO = ngoId;
  food.status = "Claimed";
  await food.save();

  res.status(200).json({ message: "Food claimed successfully", food });
});

export const deleteFood = asyncHandler(async (req, res) => {
  const foodId = req.params.foodId;
  const donorId = req.user.id;

  const food = await Food.findById(foodId);
  if (!food) {
    return res.status(404).json({ message: "Food not found" });
  }

  if (food.donor.toString() !== donorId) {
    return res
      .status(403)
      .json({ message: "You can only delete your own food posts" });
  }

  await food.deleteOne();
  res.status(200).json({ message: "Food deleted successfully" });
});
