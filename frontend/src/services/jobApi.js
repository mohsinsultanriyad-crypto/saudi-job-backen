import axios from "axios";

// ✅ Always point to your live Render backend
const BASE_URL = "https://saudijob.onrender.com/api";

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
  return api.delete(`/jobs/${id}`, { data: { email } });
}
