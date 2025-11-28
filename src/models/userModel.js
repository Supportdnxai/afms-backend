import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
  role: { type: String, enum: ["farmer", "admin"], default: "farmer" }
});

export default mongoose.model("User", userSchema);
