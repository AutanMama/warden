import { Check, Minus } from "lucide-react";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { permissionMatrix } from "../data/mockData";

function Cell({ granted }) {
  return granted ? (
    <Check size={15} className="text-[var(--color-success)] mx-auto" />
  ) : (
    <Minus size={15} className="text-slate-300 mx-auto" />
  );
}

export default function RolesPermissions() {
  return (
    <div>
      <PageHeader title="Roles & Permissions" subtitle="What each role is authorized to do." />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
              <th className="px-4 py-2.5 font-medium">Permission</th>
              <th className="px-4 py-2.5 font-medium text-center">Admin</th>
              <th className="px-4 py-2.5 font-medium text-center">Manager</th>
              <th className="px-4 py-2.5 font-medium text-center">Staff</th>
            </tr>
          </thead>
          <tbody>
            {permissionMatrix.map((row) => (
              <tr key={row.permission} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-2.5 text-slate-900">{row.permission}</td>
                <td className="px-4 py-2.5"><Cell granted={row.admin} /></td>
                <td className="px-4 py-2.5"><Cell granted={row.manager} /></td>
                <td className="px-4 py-2.5"><Cell granted={row.staff} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>

      <p className="text-xs text-slate-500 mt-3">
        This matrix is designed to be enforced by API middleware, not just hidden in the UI —
        a Staff account should get a 403 from the server even if it calls the approve endpoint
        directly. That enforcement lands in Milestone 2.
      </p>
    </div>
  );
}
