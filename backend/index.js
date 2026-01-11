import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// In-memory DB
let jobs = [];

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SAUDI JOB backend running ✅" });
});

// APIs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

app.post("/api/jobs", (req, res) => {
  const { name, companyName, phone, email, city, jobRole, description } = req.body;

  if (!name || !phone || !email || !city || !jobRole || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newJob = {
    _id: Date.now().toString(),
    name,
    companyName: companyName || "",
    phone,
    email,
    city,
    jobRole,
    description,
    createdAt: new Date().toISOString(),
  };

  jobs.unshift(newJob);
  return res.status(201).json(newJob);
});

app.delete("/api/jobs/:id", (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const idx = jobs.findIndex((j) => j._id === id);
  if (idx === -1) return res.status(404).json({ error: "Job not found" });

  const job = jobs[idx];

  if (!email || email.trim().toLowerCase() !== job.email.trim().toLowerCase()) {
    return res.status(401).json({ error: "Email verification failed" });
  }

  jobs.splice(idx, 1);
  return res.json({ message: "Job deleted successfully ✅" });
});

// ✅ Serve frontend build
const distPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(distPath));

// ✅ Express v5 safe fallback (NO app.get("*") / "/*")
app.use((req, res, next) => {
  // API routes ko touch mat karo
  if (req.path.startsWith("/api")) return next();

  // SPA fallback
  return res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running ✅ http://localhost:${PORT}`));