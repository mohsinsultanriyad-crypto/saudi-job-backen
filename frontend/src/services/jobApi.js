import axios from "axios";

// ✅ Backend base URL (WITHOUT /api here)
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://saudijob.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ All endpoints must include /api
export function getJobs() {
  return api.get("/api/jobs");
}

export function postJob(payload) {
  return api.post("/api/jobs", payload);
}

export function deleteJob(id, email) {
  return api.delete(`/api/jobs/${id}`, { data: { email } });
}