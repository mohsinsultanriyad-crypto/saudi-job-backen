import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Mongo Connect
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

// ✅ Model
const jobSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    companyName: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    city: { type: String, default: "" },
    jobRole: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

// ✅ Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ Get Jobs (IMPORTANT: returns {items})
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
      return res
        .status(400)
        .json({ message: "jobRole, city, description required" });
    }

    const created = await Job.create(payload);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ✅ Update Job (to avoid frontend errors)
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};

    const updated = await Job.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: "Job not found" });

    res.json(updated);
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

// ✅ Serve Frontend (Vite build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(distPath));

// ✅ SPA fallback (avoid api route)
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});