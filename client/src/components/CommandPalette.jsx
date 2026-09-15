import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Inbox, CheckSquare, Users, ShieldCheck, History, LogOut, CornerDownLeft, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { can } from "../lib/permissions";

const ALL_COMMANDS = [
  { label: "Overview", to: "/overview", icon: LayoutGrid, permission: null },
  { label: "Requests", to: "/requests", icon: Inbox, permission: "view_requests" },
  { label: "Approvals", to: "/approvals", icon: CheckSquare, permission: "approve_request" },
  { label: "Users", to: "/users", icon: Users, permission: "manage_users" },
  { label: "Roles & Permissions", to: "/roles", icon: ShieldCheck, permission: "manage_roles" },
  { label: "Audit Log", to: "/audit-log", icon: History, permission: "view_audit_log" },
];

export default function CommandPalette({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const commands = useMemo(() => {
    const withAccess = ALL_COMMANDS.map((c) => ({
      ...c,
      locked: c.permission ? !can(user?.role, c.permission) : false,
    }));
    const withSignOut = [...withAccess, { label: "Sign out", action: logout, icon: LogOut, locked: false }];
    if (!query) return withSignOut;
    return withSignOut.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  }, [query, user, logout]);

  const selectable = commands.filter((c) => !c.locked);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, selectable.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && selectable[activeIndex]) {
        select(selectable[activeIndex]);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, selectable, activeIndex]);

  function select(cmd) {
    if (cmd.locked) return;
    if (cmd.to) navigate(cmd.to);
    if (cmd.action) cmd.action();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-slate-900/25" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[10px] shadow-xl border border-slate-200 overflow-hidden">
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          placeholder="Jump to…"
          className="w-full px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 border-b border-slate-100 focus:outline-none"
        />
        <div className="max-h-72 overflow-y-auto py-1.5">
          {commands.length === 0 && (
            <p className="px-4 py-6 text-sm text-slate-400 text-center">No matches.</p>
          )}
          {commands.map((cmd) => {
            const Icon = cmd.icon;
            const selIndex = selectable.indexOf(cmd);
            const isActive = !cmd.locked && selIndex === activeIndex;
            return (
              <button
                key={cmd.label}
                onClick={() => select(cmd)}
                onMouseEnter={() => !cmd.locked && setActiveIndex(selIndex)}
                disabled={cmd.locked}
                title={cmd.locked ? "Restricted for your role" : undefined}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-left ${
                  cmd.locked
                    ? "text-slate-300 cursor-not-allowed"
                    : isActive
                    ? "bg-slate-50 text-slate-900"
                    : "text-slate-600"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={15} className={cmd.locked ? "text-slate-300" : "text-slate-400"} />
                  {cmd.label}
                </span>
                {cmd.locked ? (
                  <Lock size={12} className="text-slate-300" />
                ) : (
                  isActive && <CornerDownLeft size={13} className="text-slate-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
