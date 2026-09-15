import { useState } from "react";
import { X } from "lucide-react";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { auditEvents } from "../data/mockData";

function DetailDrawer({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/20" onClick={onClose} />
      <div className="relative w-full max-w-96 bg-white border-l border-[var(--color-border)] h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Audit Event</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <dl className="space-y-4 text-sm">
          {[
            ["Action", event.action],
            ["Performed by", event.user],
            ["Resource", event.resource],
            ["Timestamp", `${event.date} ${event.time}`],
            ["Before", event.before],
            ["After", event.after],
            ["Event ID", event.id],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-slate-500 mb-0.5">{label}</dt>
              <dd className="text-slate-900 font-medium">{value}</dd>
            </div>
          ))}
          <div>
            <dt className="text-xs text-slate-500 mb-0.5">Result</dt>
            <dd><StatusBadge status={event.result} /></dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function AuditLog() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Every sensitive action, recorded and attributable." />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
              <th className="px-4 py-2.5 font-medium">Time</th>
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Action</th>
              <th className="px-4 py-2.5 font-medium">Resource</th>
              <th className="px-4 py-2.5 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {auditEvents.map((e) => (
              <tr
                key={e.id}
                onClick={() => setSelected(e)}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
              >
                <td className="px-4 py-2.5 text-slate-500">{e.time}</td>
                <td className="px-4 py-2.5 text-slate-900 font-medium">{e.user}</td>
                <td className="px-4 py-2.5 text-slate-600">{e.actionLabel}</td>
                <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">{e.resource}</td>
                <td className="px-4 py-2.5"><StatusBadge status={e.result} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>

      <DetailDrawer event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
