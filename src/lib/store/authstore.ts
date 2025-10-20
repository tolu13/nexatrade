import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import api from "../api";
import type { AxiosError } from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other user fields as needed
}

interface LoginResponse {
  access_token: string;
  user: User;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post<LoginResponse>("/auth/login", {
            email,
            password,
          });
          console.log("🔹 Login API response:", response);

          if (!response.data?.access_token) {
            throw new Error("No token received from server");
          }
          set({
            token: response.data.access_token,
            user: response.data.user,
            loading: false,
          });
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data?.message || "Login failed",
            loading: false,
          });
          throw err;
        }
        
      },

      signup: async (email: string, password: string, role: string) => {
        set({ loading: true, error: null });
        try {
          await api.post("/auth/signup", { email, password, role });
          set({ loading: false });
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data?.message || "Signup failed",
            loading: false,
          });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem("auth-storage");
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
