import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// In-memory Jobs
let jobs = [];

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SAUDI JOB backend running" });
});

// APIs
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

app.post("/api/jobs", (req, res) => {
  const job = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  jobs.unshift(job);
  res.status(201).json(job);
});

app.delete("/api/jobs/:id", (req, res) => {
  const { id } = req.params;
  jobs = jobs.filter(j => j._id !== id);
  res.json({ message: "Deleted" });
});

// Serve React Frontend
const distPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on " + PORT));