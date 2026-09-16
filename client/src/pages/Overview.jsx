import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { TableSkeleton } from "../components/Skeleton";
import { can } from "../lib/permissions";
import { listRequests } from "../api/requests";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function buildActivitySeries(rows) {
  const counts = Object.fromEntries(WEEKDAYS.map((d) => [d, 0]));
  rows.forEach((r) => {
    const day = new Date(r.submittedAt).toLocaleDateString("en-GB", { weekday: "short" });
    if (day in counts) counts[day] += 1;
  });
  return WEEKDAYS.map((day) => ({ day, count: counts[day] }));
}

function buildDepartmentSeries(rows) {
  return Object.values(
    rows.reduce((acc, r) => {
      acc[r.department] = acc[r.department] || { department: r.department, count: 0 };
      acc[r.department].count += 1;
      return acc;
    }, {})
  );
}

function RequestsTable({ rows, emptyLabel }) {
  if (rows.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
            <th className="px-4 py-2.5 font-medium">Request</th>
            <th className="px-4 py-2.5 font-medium">Maker</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Date</th>
            <th className="px-4 py-2.5 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="px-4 py-2.5">
                <Link to={`/requests/${r.id}`} className="text-slate-900 font-medium hover:text-[var(--color-navy)]">
                  {r.title}
                </Link>
                <p className="text-xs text-slate-400">{r.id.slice(0, 8)}</p>
              </td>
              <td className="px-4 py-2.5 text-slate-600">{r.maker.name}</td>
              <td className="px-4 py-2.5">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-2.5 text-slate-500">
                {new Date(r.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
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
  );
}

const TODAY = new Date().toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Overview() {
  const { user } = useAuth();
  const isApprover = can(user?.role, "approve_request");
  const isAdmin = can(user?.role, "manage_users");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listRequests()
      .then(setRows)
      .catch(() => setError("Couldn't load requests."))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  };

  const activitySeries = buildActivitySeries(rows);
  const departmentSeries = buildDepartmentSeries(rows);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
        <p className="text-sm text-slate-500">{TODAY}</p>
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
          All systems operational
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger-bg)] rounded-[6px] px-3 py-2 mb-5">
          {error}
        </p>
      )}

      {/* Decision-first: one primary queue card + compact supporting metrics — each number appears once. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Link
          to={isApprover ? "/approvals" : "/requests"}
          className="sm:col-span-2 group flex items-center justify-between gap-4 rounded-[8px] px-5 py-4 text-white bg-[var(--color-navy)] hover:bg-[var(--color-midnight)] transition-colors"
        >
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold leading-none">
              {loading ? "—" : String(counts.pending).padStart(2, "0")}
            </p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                {isApprover ? "Pending Approvals" : "My Pending Requests"}
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                {isApprover ? "Requests requiring your attention" : "Awaiting a checker's decision"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium shrink-0">
            {isApprover ? "Review" : "View"}
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Card padded className="!py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Approved</p>
            <p className="text-lg font-semibold text-[var(--color-success)]">{loading ? "—" : counts.approved}</p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div>
            <p className="text-xs text-slate-500">Rejected</p>
            <p className="text-lg font-semibold text-[var(--color-danger)]">{loading ? "—" : counts.rejected}</p>
          </div>
          {isAdmin && (
            <>
              <div className="w-px h-8 bg-slate-100" />
              <div>
                <p className="text-xs text-slate-500">Team</p>
                <p className="text-lg font-semibold text-slate-900">3</p>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Two distinct cuts of the data — activity over time, and by department — nothing restated. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <Card padded>
          <h2 className="text-[15px] font-semibold text-slate-900 mb-0.5">Request Activity</h2>
          <p className="text-xs text-slate-500 mb-3">Requests submitted this week</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={activitySeries} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#172033" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#172033" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ stroke: "#e2e8f0" }} />
              <Area type="monotone" dataKey="count" stroke="#172033" strokeWidth={2} fill="url(#activityFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card padded>
          <h2 className="text-[15px] font-semibold text-slate-900 mb-0.5">By Department</h2>
          <p className="text-xs text-slate-500 mb-3">Where requests are coming from</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={departmentSeries} margin={{ left: -20 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="count" fill="#172033" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-900">
            {isApprover ? "Recent Requests" : "My Recent Requests"}
          </h2>
          <Link to="/requests" className="text-xs font-medium text-[var(--color-navy)] hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
          <RequestsTable
            rows={rows.slice(0, 6)}
            emptyLabel={isApprover ? "No requests yet." : "You haven't submitted any requests yet."}
          />
        )}
      </Card>
    </div>
  );
}
