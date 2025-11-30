import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import Mao from "./src/models/maoModel.js";

dotenv.config();

async function importMao() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // ---- DELETE OLD TABLE (COLLECTION) ----
    const collectionExists = await mongoose.connection.db
      .listCollections({ name: "maos" })
      .next();

    if (collectionExists) {
      await mongoose.connection.db.dropCollection("maos");
      console.log("🗑️ Existing 'maos' collection deleted");
    } else {
      console.log("ℹ️ No existing 'maos' collection found");
    }

    // ---- READ EXCEL FILE ----
    const workbook = xlsx.readFile("mao.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[1]]; // Assuming MAO data is in the second sheet
    const data = xlsx.utils.sheet_to_json(sheet);

    // ---- MAP DATA ----
    const mapped = data.map((row) => ({
      employeeID: row["EmpID"],
      designation : row["Designation"],
      headQuarters: row["Head_Quarters"],
      phone: row["Phone"],
    }));

    // ---- INSERT NEW DATA ----
    await Mao.insertMany(mapped);
    console.log("✅ MAO data imported successfully");

    process.exit();
  } catch (error) {
    console.error("❌ ERROR:", error);
    process.exit(1);
  }
}

importMao();
