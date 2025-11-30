import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dealerRoutes from "./routes/dealerRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import maoRoutes from "./routes/maoRoutes.js";

connectDB();

const app = express();

// ✅ Allow Frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/mao", maoRoutes);

app.get("/", (req, res) => {
  res.send("Fertilizer Distribution API is running...");
});

export default app;

