import axios from "axios";

// ✅ Always use relative API path on production
// Because frontend + backend same Render service
const BASE_URL = "/api";

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