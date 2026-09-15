// Mirrors the Roles & Permissions matrix. Single source of truth for what
// each role can see and do — the sidebar, route guards, and page content
// all read from this instead of checking `role === "ADMIN"` ad hoc.
export const ROLE_PERMISSIONS = {
  ADMIN: [
    "view_requests",
    "create_request",
    "approve_request",
    "reject_request",
    "manage_users",
    "manage_roles",
    "view_audit_log",
  ],
  MANAGER: ["view_requests", "create_request", "approve_request", "reject_request", "view_audit_log"],
  STAFF: ["view_requests", "create_request"],
};

export function can(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
