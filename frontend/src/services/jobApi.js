import axios from "axios";

// ✅ backend URL (tumhara local backend 8000 pe hai)
const BASE_URL = import.meta.env.VITE_API_URL || "https://saudijob.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
});

export function getJobs() {
  return api.get("/jobs");
}

export function postJob(payload) {
  return api.post("/jobs", payload);
}

export function deleteJob(id, email) {
  return api.delete(`/jobs/${id}`, { data: { email } });
}
