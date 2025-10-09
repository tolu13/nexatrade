import { Navigate } from "react-router-dom";
import { useAuthStore } from "../lib/store/authstore";
import type { JSX, ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const token = useAuthStore((state) => state.token);

  // If not logged in, redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render children
  return <>{children}</>;
};
