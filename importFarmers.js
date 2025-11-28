import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import Farmer from "./src/models/farmerModel.js";

dotenv.config();

async function importFarmers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const workbook = xlsx.readFile("Final.xlsx"); 
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const farmers = rows.map((row) => ({
      ppbNumber: row["PPBNO"]?.toString().trim(),
      name: row["FarmerName"],
      fatherName: row["FatherName"],
      phone: row["Mobileno"]?.toString(),
      aadharNumber: row["AdharNo"],
      mandal: row["Mandal"],
      village: row["Village"],
      district: "PEDDAPALLE",

      finalArableAreaAcres: row["FinalArableAreaAcres"],
      finalArableAreaGuntas: row["FinalArableAreaGuntas"],

      paddySownExtentAcres: row["PaddySownExtentAcres"],
      paddySownExtentGuntas: row["PaddySownExtentGuntas"],

      maizeSownExtentAcres: row["MaizeSownExtentAcres"],
      maizeSownExtentGuntas: row["MaizeSownExtentGuntas"],

      totalSownExtentAcres: row["TotalSownExtentAcres"],
      totalSownExtentGuntas: row["TotalSownExtentGuntas"],

      // Will be calculated later
      othersAcres: 0,
      othersGuntas: 0,

      bagsConsumed: 0,
      bagsLeft: 0,
      eligibility: 0,
      consumptionHistory: [],
    }));

    // Clear and insert fresh data
    const exists = await mongoose.connection.db
      .listCollections({ name: "farmers" })
      .next();

    if (exists) {
      await mongoose.connection.db.dropCollection("farmers");
      console.log("🗑 Collection cleared");
    }

    await Farmer.insertMany(farmers);

    console.log("🎯 Farmers imported successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Import Error:", error);
    process.exit(1);
  }
}

importFarmers();
