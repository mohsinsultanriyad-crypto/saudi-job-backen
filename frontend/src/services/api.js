import axios from "axios";

const API = axios.create({
  baseURL: "https://saudi-job-backen.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
