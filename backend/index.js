import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// In-memory DB
let jobs = [];

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SAUDI JOB backend running" });
});

// Get jobs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// Post job
app.post("/api/jobs", (req, res) => {
  const job = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  jobs.unshift(job);
  res.status(201).json(job);
});

// Delete job
app.delete("/api/jobs/:id", (req, res) => {
  const { id } = req.params;
  jobs = jobs.filter(j => j._id !== id);
  res.json({ message: "Deleted" });
});

// Serve frontend
const distPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(distPath));

// React SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on " + PORT));