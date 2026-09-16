import { useEffect, useState } from "react";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { TableSkeleton } from "../components/Skeleton";
import { roleStyle } from "../lib/roleStyles";
import { useAuth } from "../context/AuthContext";
import { can } from "../lib/permissions";
import { listUsers, updateUserRole, updateUserStatus } from "../api/requests";

const ROLES = ["ADMIN", "MANAGER", "STAFF"];

export default function Users() {
  const { user: me } = useAuth();
  const canManageRoles = can(me?.role, "manage_roles");
  const canManageUsers = can(me?.role, "manage_users");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [rowError, setRowError] = useState({ id: null, message: "" });

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch(() => setError("Couldn't load users."))
      .finally(() => setLoading(false));
  }, []);

  async function handleRoleChange(userId, role) {
    setSavingId(userId);
    setRowError({ id: null, message: "" });
    try {
      const updated = await updateUserRole(userId, role);
      setUsers((rows) => rows.map((r) => (r.id === userId ? updated : r)));
    } catch (err) {
      setRowError({ id: userId, message: err.response?.data?.message || "Couldn't update role." });
    } finally {
      setSavingId(null);
    }
  }

  async function handleStatusToggle(userId, nextActive) {
    setSavingId(userId);
    setRowError({ id: null, message: "" });
    try {
      const updated = await updateUserStatus(userId, nextActive);
      setUsers((rows) => rows.map((r) => (r.id === userId ? updated : r)));
    } catch (err) {
      setRowError({ id: userId, message: err.response?.data?.message || "Couldn't update status." });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <PageHeader title="Users" subtitle="People with access to this platform." />

      <Card className="overflow-hidden">
        {loading ? (
          <TableSkeleton rows={3} />
        ) : error ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--color-danger)]">{error}</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Email</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === me?.id;
                const roleEditable = canManageRoles && !isSelf;
                const statusEditable = canManageUsers && !isSelf;
                const saving = savingId === u.id;
                return (
                  <tr key={u.email} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-900 font-medium">
                      {u.name}
                      {isSelf && <span className="text-xs text-slate-400 font-normal ml-1.5">(you)</span>}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{u.email}</td>
                    <td className="px-4 py-2.5">
                      {roleEditable ? (
                        <select
                          value={u.role}
                          disabled={saving}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`text-xs font-medium rounded-[4px] border-0 pl-2 pr-6 py-0.5 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-60 ${roleStyle(u.role).badge}`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {roleStyle(r).label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-[4px] text-xs font-medium ${roleStyle(u.role).badge}`}>
                          {roleStyle(u.role).label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={u.isActive ? "approved" : "rejected"} label={u.isActive ? "Active" : "Disabled"} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {statusEditable && (
                        <button
                          onClick={() => handleStatusToggle(u.id, !u.isActive)}
                          disabled={saving}
                          className="text-xs font-medium text-slate-500 hover:text-slate-900 disabled:opacity-60"
                        >
                          {u.isActive ? "Disable" : "Enable"}
                        </button>
                      )}
                      {rowError.id === u.id && (
                        <p className="text-xs text-[var(--color-danger)] mt-0.5">{rowError.message}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </Card>
    </div>
  );
}
