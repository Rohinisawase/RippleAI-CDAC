import axios from "axios";
import API_CONFIG from "../config/apiConfig";

const postApi = axios.create({
  baseURL: API_CONFIG.POST_SERVICE,
});

postApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Removed X-User-Email
  }

  return config;
});

export default postApi;


