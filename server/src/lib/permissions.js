// Mirrors client/src/lib/permissions.js. This is the copy that actually
// matters — the client's copy only controls what the UI shows, this one
// decides what the API allows.
const ROLE_PERMISSIONS = {
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
