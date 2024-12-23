import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/services/stores/useAuthStore";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
