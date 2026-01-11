// backend/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// --------------------
// ✅ BASIC MIDDLEWARE
// --------------------
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// CORS (safe default - allow all)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// --------------------
// ✅ ENV
// --------------------
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in environment variables");
  process.exit(1);
}

// --------------------
// ✅ MONGOOSE CONNECT
// --------------------
mongoose
  .connect(MONGO_URI, {
    dbName: process.env.DB_NAME || "saudi_jobs",
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// --------------------
// ✅ JOB SCHEMA + MODEL
// --------------------
const jobSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    companyName: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, required: true }, // used for delete verification
    city: { type: String, default: "" },
    jobRole: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Auto delete after 30 days (TTL Index)
jobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

// --------------------
// ✅ HEALTH ROUTES (both work)
// --------------------
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/api/health", (req, res) => res.json({ ok: true }));

// --------------------
// ✅ HELPERS
// --------------------
function buildQuery(q) {
  const text = (q || "").trim();
  if (!text) return {};
  const rx = new RegExp(text, "i");
  return {
    $or: [{ jobRole: rx }, { city: rx }, { companyName: rx }, { name: rx }],
  };
}

// --------------------
// ✅ JOB API (both /jobs and /api/jobs supported)
// --------------------
async function listJobs(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "30"), 1), 100);
    const q = (req.query.q || "").trim();

    const filter = buildQuery(q);

    const total = await Job.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const items = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load jobs" });
  }
}

async function createJob(req, res) {
  try {
    const { name, companyName, phone, email, city, jobRole, description } =
      req.body || {};

    if (!email || !String(email).includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    if (!jobRole || String(jobRole).trim().length < 2) {
      return res.status(400).json({ error: "Job role is required" });
    }

    const job = await Job.create({
      name: name || "",
      companyName: companyName || "",
      phone: phone || "",
      email: String(email).trim().toLowerCase(),
      city: city || "",
      jobRole: jobRole || "",
      description: description || "",
    });

    res.status(201).json(job);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create job" });
  }
}

async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: "Email required for delete verify" });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (String(job.email).toLowerCase() !== String(email).toLowerCase()) {
      return res.status(403).json({ error: "Email verification failed" });
    }

    await Job.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete job" });
  }
}

// GET
app.get("/jobs", listJobs);
app.get("/api/jobs", listJobs);

// POST
app.post("/jobs", createJob);
app.post("/api/jobs", createJob);

// DELETE
app.delete("/jobs/:id", deleteJob);
app.delete("/api/jobs/:id", deleteJob);

// --------------------
// ✅ SERVE FRONTEND + FIX "Cannot GET /viewed"
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If your repo structure is:
// /backend/index.js
// /frontend/dist
const distPath = path.join(__dirname, "..", "frontend", "dist");

// serve static if dist exists
app.use(express.static(distPath));

// SPA fallback (ONLY for non-API routes)
app.get("*", (req, res) => {
  // if API route, return 404 json
  if (req.path.startsWith("/api") || req.path.startsWith("/jobs")) {
    return res.status(404).json({ error: "Route not found" });
  }
  return res.sendFile(path.join(distPath, "index.html"));
});

// --------------------
// ✅ START
// --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});