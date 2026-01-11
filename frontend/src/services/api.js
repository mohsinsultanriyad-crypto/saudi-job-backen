import axios from "axios";

const API = axios.create({
  baseURL: "https://saudi-job-backen.onrender.com/api",
});

export default API;
