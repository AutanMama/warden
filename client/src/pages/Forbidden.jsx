import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Forbidden() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-11 h-11 rounded-[8px] bg-slate-100 flex items-center justify-center mb-4">
        <ShieldOff size={20} className="text-slate-400" />
      </div>
      <h1 className="text-lg font-semibold text-slate-900 mb-1">You don't have access to this page</h1>
      <p className="text-sm text-slate-500 max-w-sm">
        Your role ({user?.role?.toLowerCase()}) doesn't include this permission. Ask an admin if you
        believe this is a mistake.
      </p>
      <Link
        to="/overview"
        className="mt-6 text-sm font-medium text-white bg-[var(--color-navy)] hover:bg-[var(--color-midnight)] px-4 py-2 rounded-[6px]"
      >
        Back to Overview
      </Link>
    </div>
  );
}
