import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import Dealer from "./src/models/dealerModel.js";

dotenv.config();

async function importDealers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // ---- DELETE OLD TABLE (COLLECTION) ----
    const collectionExists = await mongoose.connection.db
      .listCollections({ name: "dealers" })
      .next();

    if (collectionExists) {
      await mongoose.connection.db.dropCollection("dealers");
      console.log("🗑️ Existing 'dealers' collection deleted");
    } else {
      console.log("ℹ️ No existing 'dealers' collection found");
    }

    // ---- READ EXCEL FILE ----
    const workbook = xlsx.readFile("Fertilizer.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // ---- MAP DATA ----
    const mapped = data.map((row) => ({
      serialNo: row["S.No."],
      name: row["Name of the Dealer"],
      iFMSId: row["iFMS Id"],
      village: row["Village Name"],
      mandal: row["Mandal Name"],
      phone: row["Phone no."],
    }));

    // ---- INSERT NEW DATA ----
    await Dealer.insertMany(mapped);
    console.log("✅ Dealers imported successfully");

    process.exit();
  } catch (error) {
    console.error("❌ ERROR:", error);
    process.exit(1);
  }
}

importDealers();
