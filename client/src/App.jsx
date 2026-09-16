import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Requests from "./pages/Requests";
import NewRequest from "./pages/NewRequest";
import RequestDetail from "./pages/RequestDetail";
import Approvals from "./pages/Approvals";
import Users from "./pages/Users";
import RolesPermissions from "./pages/RolesPermissions";
import AuditLog from "./pages/AuditLog";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Forbidden from "./pages/Forbidden";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import RequirePermission from "./components/RequirePermission";

export default function App() {
  return (
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
    </Routes>
  );
}
