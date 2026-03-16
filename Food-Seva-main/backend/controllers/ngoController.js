import DonorFood from "../models/foodItemModel.js";
import FoodClaim from "../models/foodClaimModel.js";
import NGO from "../models/ngoModel.js";

export const getAvailableFood = async (req, res) => {
  try {
    const availableFood = await DonorFood.find().populate("donor", "name");

    const filteredFood = availableFood
      .map((donation) => ({
        ...donation.toObject(),
        foodItems: donation.foodItems.filter(
          (item) => item.status === "Available"
        ),
      }))
      .filter((donation) => donation.foodItems.length > 0);

    res.status(200).json({ availableFood: filteredFood });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching available food", error: error.message });
  }
};

export const claimFood = async (req, res) => {
  try {
    console.log("==== Incoming Request ====");
    console.log("Request Body:", req.body);

    const { donateFoodId, ngoId, items } = req.body;

    // Check if request body is properly received
    if (!donateFoodId || !ngoId || !items || !Array.isArray(items)) {
      console.log("Invalid request body structure");
      return res.status(400).json({ message: "Invalid request format" });
    }

    console.log("Parsed donateFoodId:", donateFoodId);
    console.log("Parsed ngoId:", ngoId);
    console.log("Parsed items:", items);

    // Fetch DonorFood record
    const donorFood = await DonorFood.findById(donateFoodId);
    console.log("Fetched DonorFood Record:", donorFood);

    if (!donorFood) {
      console.log("Donor food record not found");
      return res.status(404).json({ message: "Donor's food record not found" });
    }

    // Fetch NGO record
    const ngo = await NGO.findById(ngoId);
    console.log("Fetched NGO Record:", ngo);

    if (!ngo) {
      console.log("NGO record not found");
      return res.status(404).json({ message: "NGO not found" });
    }

    let claimedItems = [];

    // Loop through items and update food quantities
    for (const item of items) {
      const { foodItemId, claimedQuantity } = item;
      console.log("Processing Food Item ID:", foodItemId);
      console.log("Requested Claimed Quantity:", claimedQuantity);

      if (!foodItemId || typeof claimedQuantity !== "number") {
        console.log("Invalid item structure:", item);
        return res
          .status(400)
          .json({ message: "Invalid item data in request" });
      }

      const foodItem = donorFood.foodItems.id(foodItemId);
      console.log("Found Food Item:", foodItem);

      if (!foodItem) {
        console.log(`Food item with ID ${foodItemId} not found`);
        return res
          .status(404)
          .json({ message: `Food item with ID ${foodItemId} not found` });
      }
      if (foodItem.status === "Claimed") {
        return res
          .status(400)
          .json({ message: "Food item has already been claimed !!" });
      }

      console.log(
        `Existing Quantity of ${foodItem.foodName}:`,
        foodItem.totalQuantity
      );

      if (foodItem.totalQuantity < claimedQuantity) {
        console.log(`Insufficient quantity for ${foodItem.foodName}`);
        return res
          .status(400)
          .json({ message: `Insufficient quantity for ${foodItem.foodName}` });
      }

      // Deduct the claimed quantity
      foodItem.totalQuantity -= claimedQuantity;
      console.log(
        `Updated Quantity of ${foodItem.foodName}:`,
        foodItem.totalQuantity
      );

      if (foodItem.totalQuantity === 0) {
        foodItem.status = "Claimed";
        console.log(`${foodItem.foodName} is now fully claimed`);
      }

      claimedItems.push({
        foodItemId: foodItem._id,
        foodName: foodItem.foodName,
        claimedQuantity,
      });
    }

    console.log("Final Claimed Items Array:", claimedItems);

    // Create new food claim record
    const foodClaim = new FoodClaim({
      donorFood: donateFoodId,
      ngo: ngoId,
      claimedItems,
      deliveryTracking: { started: true, completed: false, liveLocation: null },
    });

    console.log("Saving Food Claim Record:", foodClaim);
    await foodClaim.save();

    console.log("Updating Donor Food Record:", donorFood);
    await donorFood.save();

    console.log("Food items claimed successfully!");

    res
      .status(200)
      .json({ message: "Food items claimed successfully", foodClaim });
  } catch (error) {
    console.error("🚨 Error in claiming food items:", error.message);
    console.error(error.stack);

    res
      .status(500)
      .json({ message: "Error in claiming food items", error: error.message });
  }
};

export const confirmClaim = async (req, res) => {
  const { claimId } = req.body;

  try {
    const claim = await FoodClaim.findById(claimId);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.deliveryTracking.completed = true;
    await claim.save();

    res
      .status(200)
      .json({ message: "Food claim successfully delivered", claim });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in confirming claim", error: error.message });
  }
};
