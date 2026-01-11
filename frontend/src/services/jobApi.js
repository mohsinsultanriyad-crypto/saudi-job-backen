import axios from "axios";

// FORCE LIVE BACKEND URL
const BASE_URL = "https://saudijob.onrender.com/api";

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
  return api.delete(`/jobs/${id}`, {
    data: { email },
  });
                    }
