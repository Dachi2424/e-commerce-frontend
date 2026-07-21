import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { state } = useAuth();
  const location = useLocation();

  if (!state.authChecked) {
    return <div className="protected-route__loading" />;
  }

  if (!state.user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (state.user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}