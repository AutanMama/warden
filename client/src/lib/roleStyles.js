// Role identity stays within the navy/neutral family — blue is reserved
// for informational UI states only, never for branding a role.
const STYLES = {
  ADMIN: { badge: "bg-[var(--color-navy)] text-white", avatar: "bg-[var(--color-navy)] text-white", label: "Admin" },
  MANAGER: { badge: "bg-slate-200 text-slate-700", avatar: "bg-slate-200 text-slate-700", label: "Manager" },
  STAFF: { badge: "bg-slate-100 text-slate-500", avatar: "bg-slate-100 text-slate-500", label: "Staff" },
};

export function roleStyle(role) {
  return STYLES[role] || STYLES.STAFF;
}
