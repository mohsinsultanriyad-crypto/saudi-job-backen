import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Health Check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ API routes
app.use("/api/jobs", jobRoutes);

// ✅ DB connect
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.log("❌ MONGO_URI missing in env");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("✅ Server running on port " + PORT));
