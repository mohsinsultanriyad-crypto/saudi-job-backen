import express from "express";
import cors from "cors";
import path from "path";

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ============================
// In-memory Jobs Database
// ============================
let jobs = [];

// ============================
// Health Check
// ============================
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SAUDI JOB backend running ✅" });
});

// ============================
// Get All Jobs
// ============================
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// ============================
// Post New Job
// ============================
app.post("/api/jobs", (req, res) => {
  const newJob = {
    id: Date.now().toString(),
    ...req.body,
  };

  jobs.unshift(newJob);
  res.status(201).json(newJob);
});

// ============================
// Delete Job
// ============================
app.delete("/api/jobs/:id", (req, res) => {
  const { id } = req.params;
  jobs = jobs.filter((job) => job.id !== id);
  res.json({ message: "Job deleted successfully ✅" });
});

// ============================
// Serve React Frontend Build
// ============================
const distPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(distPath));

// ============================
// SPA Fallback (Express v5 Safe)
// ============================
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  return res.sendFile(path.join(distPath, "index.html"));
});

// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Backend running on port:", PORT);
});