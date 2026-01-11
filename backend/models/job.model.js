import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  // ✅ YAHI ADD KARNA HAI (Already Viewed feature)
  viewed: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;
