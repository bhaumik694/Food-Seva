import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { 
    street: String, 
    city: String, 
    state: String, 
    pincode: String,
    coordinates: { lat: Number, lng: Number } // For GPS tracking
  },
  foodPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
  createdAt: { type: Date, default: Date.now },
  password: { type: String , required: true },
  role: { type: String , required: true },
  wallet: { type: String },
  rewards: { type: Number, default: 0 },
  privateKey: { type: String},
});

const Donor = mongoose.model("Donor", donorSchema);
export default Donor;
