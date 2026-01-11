import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    name: { type: String, required: true },
    companyName: { type: String, default: "" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    jobRole: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

// -------------------- API ROUTES --------------------
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SAUDI JOB backend running" });
});

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

app.post("/api/jobs", async (req, res) => {
  try {
    const { name, companyName, phone, email, city, jobRole, description } = req.body || {};

    if (!name || !phone || !email || !city || !jobRole || !description) {
      return res.status(400).json({
        message: "Missing required fields: name, phone, email, city, jobRole, description",
      });
    }

    const created = await Job.create({
      name,
      companyName: companyName || "",
      phone,
      email,
      city,
      jobRole,
      description,
    });

    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

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
    res.json({ ok: true, message: "Deleted ✅" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// -------------------- SERVE FRONTEND --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Auto-detect dist path (root & backend dono handle)
const distCandidates = [
  path.join(__dirname, "frontend", "dist"),           // index.js at root
  path.join(__dirname, "..", "frontend", "dist"),    // index.js inside backend folder
];

let distPath = distCandidates.find((p) => fs.existsSync(p));
if (distPath) {
  app.use(express.static(distPath));

  // SPA fallback
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.warn("⚠️ frontend/dist not found. Only API will work.");
}

// -------------------- START --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
