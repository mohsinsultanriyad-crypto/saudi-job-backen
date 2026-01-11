import axios from "axios";

// ✅ Always use Render backend URL in production
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000/api"
    : "https://saudijob.onrender.com/api");

export const api = axios.create({
  baseURL: BASE_URL,
});

// Get Jobs
export function getJobs({ page = 1, limit = 30, q = "" } = {}) {
  return api.get("/jobs", {
    params: { page, limit, q },
  });
}

// Post Job
export function postJob(payload) {
  return api.post("/jobs", payload);
}

// Delete Job
export function deleteJob(id, email) {
  return api.delete(`/jobs/${id}`, {
    data: { email },
  });
}
