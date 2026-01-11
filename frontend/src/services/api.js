import axios from "axios";

const API = axios.create({
  baseURL: "https://saudi-job-backend.onrender.com",
});

export default API;
