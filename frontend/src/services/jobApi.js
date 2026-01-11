import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ pagination + search
export function getJobs({ page = 1, limit = 30, q = "" } = {}) {
  return api.get(`/jobs?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`);
}

export function postJob(payload) {
  return api.post("/jobs", payload);
}

export function deleteJob(id, email) {
  return api.delete(`/jobs/${id}`, { data: { email } });
}

export function updateJob(id, payload) {
  return api.put(`/jobs/${id}`, payload);
}
