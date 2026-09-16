import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { listRequests } from "../api/requests";

export default function Approvals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listRequests()
      .then((rows) => setPending(rows.filter((r) => r.status === "pending")))
      .catch(() => setError("Couldn't load approvals."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Approvals" subtitle="Requests waiting on a checker decision." />

      {loading ? (
        <Card padded className="text-center text-sm text-slate-500 !py-10">
          Loading…
        </Card>
      ) : error ? (
        <Card padded className="text-center text-sm text-[var(--color-danger)] !py-10">
          {error}
        </Card>
      ) : pending.length === 0 ? (
        <Card padded className="text-center text-sm text-slate-500 !py-10">
          Nothing pending — you're caught up.
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium">Request</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Maker</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-900 font-medium">{r.title}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.amount}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.maker.name}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      to={`/requests/${r.id}`}
                      className="text-xs font-medium text-[var(--color-navy)] hover:underline"
                    >
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      )}
    </div>
  );
}
