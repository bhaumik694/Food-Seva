import  DonorFood  from "../models/foodItemModel.js"; 

export const uploadFood = async (req, res) => {
  try {
    const { donor, foodItems, pickupLocation } = req.body;

    if (!donor || !foodItems || foodItems.length === 0 || !pickupLocation) {
      return res.status(400).json({ message: "Donor, food items, and pickup location are required" });
    }

    const newDonorFood = new DonorFood({
      donor,
      foodItems,
      pickupLocation
    });

    const savedDonorFood = await newDonorFood.save();

    return res.status(201).json({
      message: "Food uploaded successfully",
      donorFood: savedDonorFood,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in food upload",
      error: error.message,
    });
  }
};



