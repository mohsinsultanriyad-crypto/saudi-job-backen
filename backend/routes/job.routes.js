import express from "express";
import Job from "../models/job.model.js";

const router = express.Router();

// POST job
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

// DELETE job (email verify)
router.delete("/:id", async (req, res) => {
  const { email } = req.body;

  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  if (job.email !== email) {
    return res.status(403).json({ error: "Email not match" });
  }

  await job.deleteOne();
  res.json({ message: "Job deleted" });
});

// DELETE job
router.delete('/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});
// MARK JOB AS VIEWED
router.patch('/:id/viewed', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { viewed: true },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark viewed' });
  }
});


// GET VIEWED JOBS
router.get('/viewed/all', async (req, res) => {
  const jobs = await Job.find({ viewed: true });
  res.json(jobs);
});




export default router;
