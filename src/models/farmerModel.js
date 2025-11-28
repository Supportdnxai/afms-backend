import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    ppbNumber: { type: String, required: true, unique: true },
    name: String,
    fatherName: String,
    phone: String,
    aadharNumber: Number,
    mandal: String,
    village: String,
    district: String,

    // From Excel
    finalArableAreaAcres: Number,
    finalArableAreaGuntas: Number,

    paddySownExtentAcres: Number,
    paddySownExtentGuntas: Number,

    maizeSownExtentAcres: Number,
    maizeSownExtentGuntas: Number,

    totalSownExtentAcres: Number,
    totalSownExtentGuntas: Number,

    // Later update fields
    othersAcres: { type: Number, default: 0 },
    othersGuntas: { type: Number, default: 0 },

    bagsConsumed: { type: Number, default: 0 },
    bagsLeft: { type: Number, default: 0 },
    eligibility: { type: Number, default: 0 },

    consumptionHistory: [
      {
        date: Date,
        bagsConsumed: Number,
        bagsLeft: Number,
        dealerName: { type: String, default: "" },
        iFMSId: { type: Number, default: "" },
      },
    ],

    // GET API calculated field (not stored)
    // dealerName: { type: String, default: "" },
    // iFMSId: { type: Number, default: "" },
    // note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Farmer", farmerSchema);
