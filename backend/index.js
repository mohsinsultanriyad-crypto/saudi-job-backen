import express from "express";
import cors from "cors";
import path from "path";

const app = express();

// middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// In-memory Jobs DB (temporary)
let jobs = [];

// ✅ Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SAUDI JOB backend running" });
});

// ✅ Get all jobs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// ✅ Post a job
app.post("/api/jobs", (req, res) => {
  const newJob = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  jobs.unshift(newJob);
  res.status(201).json(newJob);
});

// ✅ Delete job
app.delete("/api/jobs/:id", (req, res) => {
  const { id } = req.params;
  jobs = jobs.filter((j) => j.id !== id);
  res.json({ message: "Job deleted successfully" });
});

// ✅ Serve React build
const __dirname = path.resolve();
const distPath = path.join(__dirname, "frontend", "dist");

app.use(express.static(distPath));

// ✅ SPA fallback (Express v5 safe)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Backend running on port:", PORT));