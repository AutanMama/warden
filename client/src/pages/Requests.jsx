import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { TableSkeleton } from "../components/Skeleton";
import { can } from "../lib/permissions";
import { listRequests } from "../api/requests";

export default function Requests() {
  const { user } = useAuth();
  const isApprover = can(user?.role, "approve_request");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listRequests()
      .then(setRows)
      .catch(() => setError("Couldn't load requests."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title={isApprover ? "Requests" : "My Requests"}
        subtitle={isApprover ? "All requests submitted across the organization." : "Requests you've submitted."}
        action={
          <Link
            to="/requests/new"
            className="text-sm font-medium text-white bg-[var(--color-navy)] hover:bg-[var(--color-midnight)] px-3.5 py-2 rounded-[6px]"
          >
            New Request
          </Link>
        }
      />

      <Card className="overflow-hidden">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--color-danger)]">{error}</p>
        ) : rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-slate-500">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
                <th className="px-4 py-2.5 font-semibold">Request</th>
                <th className="px-4 py-2.5 font-semibold">Department</th>
                {isApprover && <th className="px-4 py-2.5 font-semibold">Maker</th>}
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Submitted</th>
                <th className="px-4 py-2.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <Link to={`/requests/${r.id}`} className="text-slate-900 font-medium hover:text-[var(--color-navy)]">
                      {r.title}
                    </Link>
                    <p className="text-xs text-slate-500 font-mono">{r.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{r.department}</td>
                  {isApprover && <td className="px-4 py-2.5 text-slate-600">{r.maker.name}</td>}
                  <td className="px-4 py-2.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {new Date(r.submittedAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      to={`/requests/${r.id}`}
                      className="text-xs font-medium text-[var(--color-navy)] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View request →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </Card>
    </div>
  );
}
