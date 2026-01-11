// backend/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// ---------------- ENV ----------------
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("❌ MONGO_URI missing");
  process.exit(1);
}

// ---------------- MONGO CONNECT ----------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.log("❌ Mongo Error:", err.message);
    process.exit(1);
  });

// ---------------- JOB MODEL ----------------
const jobSchema = new mongoose.Schema(
  {
    name: String,
    companyName: String,
    phone: String,
    email: { type: String, required: true },
    city: String,
    jobRole: String,
    description: String,
  },
  { timestamps: true }
);

// Auto delete after 30 days
jobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Job = mongoose.model("Job", jobSchema);

// ---------------- HEALTH ----------------
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ---------------- JOB ROUTES ----------------

// GET Jobs (pagination + search)
app.get("/api/jobs", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.min(parseInt(req.query.limit || "30"), 50);
    const q = (req.query.q || "").trim();

    const search = q
      ? {
          $or: [
            { jobRole: new RegExp(q, "i") },
            { city: new RegExp(q, "i") },
            { companyName: new RegExp(q, "i") },
          ],
        }
      : {};

    const total = await Job.countDocuments(search);
    const totalPages = Math.ceil(total / limit);

    const items = await Job.find(search)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ items, page, totalPages });
  } catch (e) {
    res.status(500).json({ error: "Load failed" });
  }
});

// POST Job
app.post("/api/jobs", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch {
    res.status(400).json({ error: "Create failed" });
  }
});

// DELETE Job
app.delete("/api/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ error: "Not found" });

  if (job.email.toLowerCase() !== email.toLowerCase())
    return res.status(403).json({ error: "Email verify failed" });

  await Job.deleteOne({ _id: id });
  res.json({ ok: true });
});

// ---------------- SERVE FRONTEND ----------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// frontend/dist path
const distPath = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(distPath));

// FIXED wildcard
app.get("/*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ---------------- START ----------------
app.listen(PORT, () => console.log("✅ Server Running on", PORT));