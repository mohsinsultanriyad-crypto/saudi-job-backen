import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders: ["Content-Type"]
}));

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// ---------------- CONNECT MONGO ----------------
async function connectDB() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI missing");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB Connected");
}
connectDB();

// ---------------- MODEL ----------------
const jobSchema = new mongoose.Schema({
  name: String,
  companyName: String,
  phone: String,
  email: String,
  city: String,
  jobRole: String,
  description: String,
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

// ---------------- ROUTES ----------------

// Health check
app.get("/api/health", (req,res)=>{
  res.json({ ok:true });
});

// Get jobs
app.get("/api/jobs", async (req,res)=>{
  const jobs = await Job.find().sort({createdAt:-1});
  res.json(jobs);
});

// Post job  ✅ FIXED to accept any frontend keys
app.post("/api/jobs", async (req,res)=>{
  try {
    const p = req.body;

    const jobRole = p.jobRole || p.role || p.jobrole;
    const city = p.city || p.location;
    const description = p.description || p.jobDescription;

    if (!jobRole || !city || !description) {
      return res.status(400).json({ message:"Missing fields", received:p });
    }

    const created = await Job.create({
      name: p.name || "",
      companyName: p.companyName || "",
      phone: p.phone || "",
      email: p.email || "",
      city,
      jobRole,
      description
    });

    res.status(201).json(created);
  } catch(e){
    res.status(500).json({message:e.message});
  }
});

// Delete job
app.delete("/api/jobs/:id", async (req,res)=>{
  const {id} = req.params;
  const {email} = req.body;

  const job = await Job.findById(id);
  if(!job) return res.status(404).json({message:"Not found"});

  if(job.email !== email){
    return res.status(401).json({message:"Email mismatch"});
  }

  await Job.deleteOne({_id:id});
  res.json({ok:true});
});

// ---------------- SERVE FRONTEND ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname,"..","frontend","dist");

app.use(express.static(distPath));

app.get(/^(?!\/api).*$/, (req,res)=>{
  res.sendFile(path.join(distPath,"index.html"));
});

app.listen(PORT, ()=>{
  console.log("✅ Server running on",PORT);
});
