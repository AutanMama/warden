import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { can } from "../lib/permissions";

export default function RequirePermission({ permission, children }) {
  const { user } = useAuth();

  if (!can(user?.role, permission)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
