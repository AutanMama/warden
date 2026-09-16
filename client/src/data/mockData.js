// Requests and audit events now come from the real API (see api/requests.js).
// This file only keeps the static permission matrix — a display of the same
// role -> permission map the server enforces, not data fetched from anywhere.

export const permissionMatrix = [
  { permission: "View Requests", admin: true, manager: true, staff: true },
  { permission: "Create Request", admin: true, manager: true, staff: true },
  { permission: "Approve Request", admin: true, manager: true, staff: false },
  { permission: "Reject Request", admin: true, manager: true, staff: false },
  { permission: "Manage Users", admin: true, manager: false, staff: false },
  { permission: "Manage Roles", admin: true, manager: false, staff: false },
  { permission: "View Audit Log", admin: true, manager: true, staff: false },
];
