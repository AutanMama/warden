// Routes are code-split (see App.jsx) to keep the initial bundle small —
// but that means React.lazy shows a loading flash on first visit to each
// page, which feels janky for in-app navigation. Once the user is past
// login, there's no more reason to wait: warm every chunk in the
// background so by the time they click a nav link, it's already cached
// and Suspense resolves instantly.
export function prefetchRoutes() {
  import("../pages/Overview");
  import("../pages/Requests");
  import("../pages/NewRequest");
  import("../pages/RequestDetail");
  import("../pages/Approvals");
  import("../pages/Users");
  import("../pages/RolesPermissions");
  import("../pages/AuditLog");
  import("../pages/Settings");
  import("../pages/Help");
}
