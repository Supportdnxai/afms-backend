import mongoose from "mongoose";

const maoSchema = new mongoose.Schema({
  employeeID: Number,
  name: String,
  designation: String,
  headQuarters: String,
  phone: { type: String, unique: true },
});

export default mongoose.model("Mao", maoSchema);
