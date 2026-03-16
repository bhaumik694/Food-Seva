
import mongoose from "mongoose";

const foodClaimSchema = new mongoose.Schema({
  donorFood: { type: mongoose.Schema.Types.ObjectId, ref: "DonorFood", required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
  claimedItems: [{
    foodName: { type: String, required: true },
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
    claimedQuantity: { type: Number, required: true }

  }],
  claimedAt: { type: Date, default: Date.now },
  deliveryTracking: { 
    started: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    liveLocation: { type: Object, default: null }
  }
});
// Middleware to update `DonorFood.foodItems` quantity
foodClaimSchema.pre("save", async function (next) {
  const claim = this;
  const donorFood = await mongoose.model("DonorFood").findById(claim.donorFood);

  if (!donorFood) return next(new Error("DonorFood not found"));

  claim.claimedItems.forEach(claimedItem => {
    const foodItem = donorFood.foodItems.id(claimedItem.foodItemId);
    if (foodItem) {
      if (foodItem.totalQuantity < claimedItem.claimedQuantity) {
        return next(new Error(`Not enough quantity for ${foodItem.foodName}`));
      }
      foodItem.totalQuantity -= claimedItem.claimedQuantity;
      if (foodItem.totalQuantity === 0) foodItem.status = "Claimed";
    }
  });

  await donorFood.save();
  next();
});

const FoodClaim = mongoose.model("FoodClaim", foodClaimSchema);
export default FoodClaim;






// import mongoose from "mongoose";

// const foodClaimSchema = new mongoose.Schema({
//   donorFood: { type: mongoose.Schema.Types.ObjectId, ref: "DonorFood", required: true },
//   ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
//   claimedItems: [{
//     foodItemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Points to foodItems inside DonorFood
//     foodName: { type: String, required: true }, 
//     claimedQuantity: { type: Number, required: true },
//     // deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" } // Links each food item to its delivery
//   }],
//   claimedAt: { type: Date, default: Date.now }
// });

// // Middleware to update `DonorFood.foodItems` quantity
// foodClaimSchema.pre("save", async function (next) {
//   const claim = this;
//   const donorFood = await mongoose.model("DonorFood").findById(claim.donorFood);

//   if (!donorFood) return next(new Error("DonorFood not found"));

//   claim.claimedItems.forEach(claimedItem => {
//     const foodItem = donorFood.foodItems.id(claimedItem.foodItemId);
//     if (foodItem) {
//       if (foodItem.totalQuantity < claimedItem.claimedQuantity) {
//         return next(new Error(`Not enough quantity for ${foodItem.foodName}`));
//       }
//       foodItem.totalQuantity -= claimedItem.claimedQuantity;
//       if (foodItem.totalQuantity === 0) foodItem.status = "Claimed";
//     }
//   });

//   await donorFood.save();
//   next();
// });

// const FoodClaim = mongoose.model("FoodClaim", foodClaimSchema);
// export default FoodClaim;
