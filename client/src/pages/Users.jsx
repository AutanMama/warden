import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { roleStyle } from "../lib/roleStyles";

const users = [
  { name: "Amina Bello", email: "admin@warden.dev", role: "ADMIN" },
  { name: "Chidi Okafor", email: "manager@warden.dev", role: "MANAGER" },
  { name: "Tunde Adebayo", email: "staff@warden.dev", role: "STAFF" },
];

export default function Users() {
  return (
    <div>
      <PageHeader title="Users" subtitle="People with access to this platform." />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-2.5 text-slate-900 font-medium">{u.name}</td>
                <td className="px-4 py-2.5 text-slate-600">{u.email}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-[4px] text-xs font-medium ${roleStyle(u.role).badge}`}>
                    {roleStyle(u.role).label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
