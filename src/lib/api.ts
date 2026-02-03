import axios from "axios";
import { useAuthStore } from "./store/authstore";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://nexatradeserver.onrender.com",
  // ❌ REMOVE unless you are using httpOnly cookies
  // withCredentials: true,
});

/**
 * REQUEST INTERCEPTOR
 * - Attach Authorization ONLY for protected routes
 * - Avoid preflight on login/signup
 */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/signup");

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * - Logout only when protected routes fail
 * - Do NOT redirect on auth routes
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";

    const isAuthRoute =
      url.includes("/auth/login") || url.includes("/auth/signup");

    if (status === 401 && !isAuthRoute) {
      toast.error("Session expired. Please log in again.");
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
