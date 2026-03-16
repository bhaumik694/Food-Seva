import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { 
    street: String, 
    city: String, 
    state: String, 
    pincode: String,
    coordinates: { lat: Number, lng: Number } 
  },
  registeredNumber: { type: String, required: true },
  claimedFood: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
  createdAt: { type: Date, default: Date.now },
  password: { type: String , required: true },
  role: { type: String , required: true },
});

const NGO = mongoose.model("NGO", ngoSchema);
export default NGO;
