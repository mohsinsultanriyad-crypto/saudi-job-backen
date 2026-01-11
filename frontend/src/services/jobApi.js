import axios from "axios";

// ✅ Local dev => localhost
// ✅ Live => same domain (Render) => "/api"
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000/api" : "/api");

export const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Get jobs
export function getJobs({ page = 1, limit = 30, q = "" } = {}) {
  return api.get(`/jobs`, {
    params: { page, limit, q },
  });
}

// ✅ Post job
export function postJob(payload) {
  return api.post("/jobs", payload);
}

// ✅ Delete job
export function deleteJob(id, email) {
  return api.delete(`/jobs/${id}`, { data: { email } });
}
