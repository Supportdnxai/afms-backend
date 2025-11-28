import express from "express";
import { getDealerByIFMS, getAllDealers  } from "../controllers/dealerController.js";

const router = express.Router();

router.get("/:id", getDealerByIFMS);

// Get all dealers
router.get("/", getAllDealers);

export default router;
