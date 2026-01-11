import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// -------------------- CONFIG --------------------
dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS (simple)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// -------------------- MONGO CONNECT --------------------
async function connectDB() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI missing in env");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB Connected");
}
connectDB().catch((e) => {
  console.error("❌ Mongo connect failed:", e.message);
  process.exit(1);
});

// -------------------- MODEL --------------------
const jobSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    companyName: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    city: { type: String, default: "" },
    jobRole: { type: String, default: "" },
    description: { type: String, default: "" },

    // optional: auto-expire after 30 days (agar chaho)
    // expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

// -------------------- API ROUTES --------------------

// ✅ Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ Get Jobs (pagination + search)
app.get("/api/jobs", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "30"), 1), 100);
    const q = (req.query.q || "").trim();

    const filter = q
      ? {
          $or: [
            { jobRole: { $regex: q, $options: "i" } },
            { city: { $regex: q, $options: "i" } },
            { companyName: { $regex: q, $options: "i" } },
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const total = await Job.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const items = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ items, page, totalPages, total });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ✅ Post Job
app.post("/api/jobs", async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.jobRole || !payload.city || !payload.description) {
      return res.status(400).json({ message: "jobRole, city, description required" });
    }
    const created = await Job.create(payload);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ✅ Delete Job (verify by email)
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body || {};

    if (!email) return res.status(400).json({ message: "Email required for delete" });

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if ((job.email || "").toLowerCase() !== String(email).toLowerCase()) {
      return res.status(401).json({ message: "Email verification failed" });
    }

    await Job.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// -------------------- SERVE FRONTEND (VITE BUILD) --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Vite build path: projectRoot/frontend/dist
const distPath = path.join(__dirname, "..", "frontend", "dist");

// static assets
app.use(express.static(distPath));

// ✅ IMPORTANT: Express v5 safe SPA fallback (NO "/*" error)
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// -------------------- START --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});