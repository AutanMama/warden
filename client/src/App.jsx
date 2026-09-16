import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import RequirePermission from "./components/RequirePermission";

const Login = lazy(() => import("./pages/Login"));
const Overview = lazy(() => import("./pages/Overview"));
const Requests = lazy(() => import("./pages/Requests"));
const NewRequest = lazy(() => import("./pages/NewRequest"));
const RequestDetail = lazy(() => import("./pages/RequestDetail"));
const Approvals = lazy(() => import("./pages/Approvals"));
const Users = lazy(() => import("./pages/Users"));
const RolesPermissions = lazy(() => import("./pages/RolesPermissions"));
const AuditLog = lazy(() => import("./pages/AuditLog"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const Forbidden = lazy(() => import("./pages/Forbidden"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <LoaderCircle size={20} className="animate-spin text-slate-300" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/overview" element={<Overview />} />
          <Route path="/forbidden" element={<Forbidden />} />

          <Route
            path="/requests"
            element={
              <RequirePermission permission="view_requests">
                <Requests />
              </RequirePermission>
            }
          />
          <Route
            path="/requests/new"
            element={
              <RequirePermission permission="create_request">
                <NewRequest />
              </RequirePermission>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <RequirePermission permission="view_requests">
                <RequestDetail />
              </RequirePermission>
            }
          />
          <Route
            path="/approvals"
            element={
              <RequirePermission permission="approve_request">
                <Approvals />
              </RequirePermission>
            }
          />
          <Route
            path="/users"
            element={
              <RequirePermission permission="manage_users">
                <Users />
              </RequirePermission>
            }
          />
          <Route
            path="/roles"
            element={
              <RequirePermission permission="manage_roles">
                <RolesPermissions />
              </RequirePermission>
            }
          />
          <Route
            path="/audit-log"
            element={
              <RequirePermission permission="view_audit_log">
                <AuditLog />
              </RequirePermission>
            }
          />

          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
