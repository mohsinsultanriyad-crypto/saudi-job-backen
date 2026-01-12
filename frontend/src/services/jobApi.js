import axios from "axios";

// ✅ Local: http://localhost:8000/api
// ✅ Live (Render): same domain => "/api"
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV
  ? "http://localhost:8000/api"
  : "/api");

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// ✅ Get Jobs (backend returns {items,page,totalPages,total})
export async function getJobs({ page = 1, limit = 30, q = "" } = {}) {
  return api.get("/jobs", { params: { page, limit, q } });
}

export async function postJob(payload) {
  return api.post("/jobs", payload);
}

export async function deleteJob(id, email) {
  return api.delete(`/jobs/${id}`, { data: { email } });
}

export async function updateJob(id, payload) {
  return api.put(`/jobs/${id}`, payload);
}