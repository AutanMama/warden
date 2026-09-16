import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-center px-6">
      <div className="w-11 h-11 rounded-[8px] bg-slate-100 flex items-center justify-center mb-4">
        <FileQuestion size={20} className="text-slate-400" />
      </div>
      <h1 className="text-lg font-semibold text-slate-900 mb-1">Page not found</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/overview"
        className="text-sm font-medium text-white bg-[var(--color-navy)] hover:bg-[var(--color-midnight)] px-4 py-2 rounded-[6px]"
      >
        Back to Overview
      </Link>
    </div>
  );
}
