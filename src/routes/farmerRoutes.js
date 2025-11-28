import express from "express";
import { 
  getFarmerByIFMS, 
  getAllFarmers,
  updateFarmer
} from "../controllers/farmerController.js";

const router = express.Router();

router.get("/", getAllFarmers);
router.get("/:id", getFarmerByIFMS);

// 🔥 New API for updating farmer
router.put("/:id", updateFarmer);

export default router;
