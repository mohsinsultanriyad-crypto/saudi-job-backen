import axios from "axios";

const API = axios.create({
  baseURL: "https://saudijob.onrender.com",
});

export default API;
