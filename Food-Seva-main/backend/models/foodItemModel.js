import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  foodType: { type: String, required: true },
  totalQuantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  imgUrl: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Available", "Claimed", "Expired"],
    default: "Available",
  },
});

const donorFoodSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  foodItems: [foodItemSchema],
  pickupLocation: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: { lat: Number, lng: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

donorFoodSchema.pre("save", function (next) {
  const now = new Date();

  this.foodItems.forEach((item) => {
    if (item.expiryDate < now) {
      item.status = "Expired";
    } else if (item.totalQuantity === 0) {
      item.status = "Claimed";
    } else {
      item.status = "Available";
    }
  });

  next();
});

donorFoodSchema.post("save", async function (doc, next) {
  await doc.updateOne({ $pull: { foodItems: { status: "Expired" } } });
  next();
});

const DonorFood = mongoose.model("DonorFood", donorFoodSchema);

export default DonorFood;
