import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Inbox,
  CheckSquare,
  Users,
  ShieldCheck,
  History,
  Settings,
  HelpCircle,
  Lock,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { can } from "../lib/permissions";

const NAV = [
  { to: "/overview", label: "Overview", icon: LayoutGrid, permission: null },
  { to: "/requests", label: "Requests", icon: Inbox, permission: "view_requests" },
  { to: "/approvals", label: "Approvals", icon: CheckSquare, permission: "approve_request" },
  { to: "/users", label: "Users", icon: Users, permission: "manage_users" },
  { to: "/roles", label: "Roles & Permissions", icon: ShieldCheck, permission: "manage_roles" },
  { to: "/audit-log", label: "Audit Log", icon: History, permission: "view_audit_log" },
];

const FOOTER_NAV = [
  { to: "/settings", label: "Settings", icon: Settings, permission: null },
  { to: "/help", label: "Help", icon: HelpCircle, permission: null },
];

function NavItem({ to, label, icon: Icon, locked, onNavigate }) {
  if (locked) {
    return (
      <div
        title={`Requires a higher role — ${label} is restricted for your account.`}
        className="flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-[6px] text-[13.5px] text-slate-300 cursor-not-allowed select-none"
      >
        <Icon size={16} strokeWidth={2} className="text-slate-300" />
        <span className="flex-1">{label}</span>
        <Lock size={12} className="text-slate-300" />
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-[6px] text-[13.5px] transition-colors ${
          isActive
            ? "bg-slate-50 text-slate-900 font-medium"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[var(--color-navy)]" />
          )}
          <Icon size={16} strokeWidth={2} className={isActive ? "text-[var(--color-navy)]" : "text-slate-400"} />
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-slate-900/30 z-30 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`w-64 md:w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen fixed md:sticky top-0 left-0 z-40 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200">
          <Logo />
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              locked={item.permission && !can(user?.role, item.permission)}
              onNavigate={onClose}
            />
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-slate-200 space-y-0.5">
          {FOOTER_NAV.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onClose} />
          ))}
        </div>
      </aside>
    </>
  );
}
