import mongoose from "mongoose";

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
export default Job;