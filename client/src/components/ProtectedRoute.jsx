import { Navigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <LoaderCircle size={20} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
