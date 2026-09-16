import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, LogOut, Bell, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleStyle } from "../lib/roleStyles";
import { can } from "../lib/permissions";
import { listRequests } from "../api/requests";
import CommandPalette from "./CommandPalette";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const menuRef = useRef(null);
  const style = roleStyle(user?.role);
  const isApprover = can(user?.role, "approve_request");

  useEffect(() => {
    if (!isApprover) return;
    listRequests()
      .then((rows) => setPendingCount(rows.filter((r) => r.status === "pending").length))
      .catch(() => {});
  }, [isApprover]);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button onClick={onMenuClick} className="md:hidden text-slate-500 hover:text-slate-800 shrink-0">
          <Menu size={20} />
        </button>

        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center justify-between w-full sm:w-72 max-w-full pl-2.5 pr-2 py-1.5 rounded-[6px] border border-slate-200 bg-slate-50 text-sm text-slate-400 hover:border-slate-300 hover:bg-white transition-colors"
        >
          <span className="flex items-center gap-2 truncate">
            <Search size={15} className="shrink-0" />
            <span className="hidden sm:inline">Search anything…</span>
            <span className="sm:hidden">Search…</span>
          </span>
          <kbd className="hidden sm:inline text-[10px] font-sans font-medium text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {isApprover && (
          <Link
            to="/approvals"
            className="relative p-2 rounded-[6px] text-slate-400 hover:text-slate-700 hover:bg-slate-50"
            aria-label="Pending approvals"
          >
            <Bell size={17} />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[var(--color-danger)] text-white text-[9px] font-semibold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Link>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${style.avatar}`}>
              {(user?.name || "?")[0]}
            </div>
            <span className="hidden sm:inline font-medium">{user?.name}</span>
            <span className={`hidden sm:inline text-[10px] font-medium px-1.5 py-0.5 rounded ${style.badge}`}>{style.label}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-[8px] shadow-lg py-1">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
