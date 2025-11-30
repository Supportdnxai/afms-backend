import express from "express";
import { getMaoByPhone, getAllMao, getMaoByMandal } from "../controllers/maoController.js";

const router = express.Router();

// Get MAO by phone number
router.get("/phone/:phone", getMaoByPhone);

// Get MAO by mandal
router.get("/mandal/:mandal", getMaoByMandal);

// Get all MAO records
router.get("/", getAllMao);

export default router;
