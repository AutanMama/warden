import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { roleStyle } from "../lib/roleStyles";

export default function Settings() {
  const { user } = useAuth();
  const style = roleStyle(user?.role);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Account and workspace preferences." />

      <Card padded>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Account</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${style.avatar}`}>
            {(user?.name || "?")[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <dl className="text-sm divide-y divide-slate-100">
          <div className="flex py-2.5 first:pt-0">
            <dt className="w-32 shrink-0 text-slate-500">Role</dt>
            <dd className={`px-2 py-0.5 rounded-[4px] text-xs font-medium ${style.badge}`}>{style.label}</dd>
          </div>
          <div className="flex py-2.5 last:pb-0">
            <dt className="w-32 shrink-0 text-slate-500">Role changes</dt>
            <dd className="text-slate-600">
              {user?.role === "ADMIN" ? "Manage from the Users page" : "Contact an admin to change your role"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card padded className="mt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Appearance</h2>
        <p className="text-sm text-slate-600">Light mode. Warden doesn't offer a dark theme yet.</p>
      </Card>
    </div>
  );
}
