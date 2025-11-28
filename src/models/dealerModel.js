import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema({
  serialNo: Number,
  name: String,
  iFMSId: { type: Number, unique: true },
  village: String,
  mandal: String,
  phone: String,
});

export default mongoose.model("Dealer", dealerSchema);
