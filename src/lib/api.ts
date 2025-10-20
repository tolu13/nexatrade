import axios from "axios";
import { useAuthStore } from "./store/authstore";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://nexatradeserver.onrender.com/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ FIX: Only trigger redirect on 401 for *protected* routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Ignore 401s from login or signup routes
    if (
      status === 401 &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/signup")
    ) {
      toast.error("Session expired. Please log in again.");
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
