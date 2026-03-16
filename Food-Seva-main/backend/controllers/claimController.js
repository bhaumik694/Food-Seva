import FoodClaim from "../models/foodClaimModel.js";

export const getClaims = async (req, res) => {
  try {
    const ngoId = req.params.ngoId;
    console.log("Fetching claims for NGO ID:", ngoId);

    // Fetch claims directly with required fields
    const claimedFood = await FoodClaim.find({ ngo: ngoId }).select(
      "claimedItems deliveryTracking claimedAt"
    );

    if (!claimedFood.length) {
      return res.status(404).json({ message: "No claims found for this NGO" });
    }

    const formattedClaims = claimedFood.map((claim) => ({
      claimedAt: claim.claimedAt,
      claimedItems: claim.claimedItems.map((item) => ({
        foodName: item.foodName,
        claimedQuantity: item.claimedQuantity,
      })),
      deliveryTracking: claim.deliveryTracking,
    }));

    console.log("Total claims found:", formattedClaims);
    res.status(200).json(formattedClaims);
  } catch (error) {
    console.error("Error fetching claimed food:", error);
    res.status(500).json({ message: "Error fetching claimed food", error });
  }
};
