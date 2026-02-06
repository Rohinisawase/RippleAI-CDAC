import axios from "axios";

const API_BASE_URL = "http://localhost:8765/"
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default api;
