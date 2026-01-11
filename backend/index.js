// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// ===== Middlewares =====
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

// ===== Helpers =====
const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;

// ===== Mongo Model =====
const jobSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    companyName: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" }, // used for delete verify
    city: { type: String, trim: true, default: "" },
    jobRole: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },

    // expiry logic
    expiresAt: { type: Date, default: () => new Date(Date.now() + DAYS_30_MS) },
  },
  { timestamps: true }
);

// Auto delete after expiresAt (MongoDB TTL index)
jobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Search index (optional but helpful)
jobSchema.index({ jobRole: "text", city: "text", companyName: "text", name: "text", description: "text" });

const Job = mongoose.model("Job", jobSchema);

// ===== Routes =====
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SAUDI JOB backend running ✅" });
});

// GET jobs (pagination + search + non-expired)
app.get("/api/jobs", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "30", 10), 1), 100);
    const q = (req.query.q || "").trim();

    const now = new Date();

    const filter = { expiresAt: { $gt: now } };

    if (q) {
      // regex search across multiple fields
      const r = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { jobRole: r },
        { city: r },
        { companyName: r },
        { name: r },
        { description: r },
      ];
    }

    const total = await Job.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const items = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      items,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST job
app.post("/api/jobs", async (req, res) => {
  try {
    const { name, companyName, phone, email, city, jobRole, description } = req.body || {};

    // basic validation
    if (!jobRole || !city || !phone) {
      return res.status(400).json({ message: "jobRole, city, phone are required" });
    }

    const newJob = await Job.create({
      name: name || "",
      companyName: companyName || "",
      phone: phone || "",
      email: email || "",
      city: city || "",
      jobRole: jobRole || "",
      description: description || "",
      expiresAt: new Date(Date.now() + DAYS_30_MS),
    });

    res.status(201).json(newJob);
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE job (verify by email)
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body || {};

    if (!email) return res.status(400).json({ message: "Email required for delete verification" });

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // verify email (case-insensitive)
    const saved = (job.email || "").toLowerCase().trim();
    const provided = (email || "").toLowerCase().trim();

    if (!saved || saved !== provided) {
      return res.status(401).json({ message: "Email verification failed" });
    }

    await Job.deleteOne({ _id: id });
    res.json({ message: "Job deleted successfully ✅" });
  } catch (err) {
    console.error("DELETE /api/jobs/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== Mongo Connect + Start =====
const PORT = process.env.PORT || 8000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Mongo connect error:", err.message);
    process.exit(1);
  });