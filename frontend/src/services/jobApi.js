import axios from "axios";

// Live Render automatically proxy /api to same domain
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000/api" : "/api");

export const api = axios.create({
  baseURL: BASE_URL,
});

// Get Jobs
export function getJobs() {
  return api.get("/jobs");
}

// Post Job
export function postJob(payload) {
  return api.post("/jobs", payload);
}

// Delete Job
export function deleteJob(id, email) {
  return api.delete(`/jobs/${id}`, { data: { email } });
}