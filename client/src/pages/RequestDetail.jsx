import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, X, CircleAlert, History as HistoryIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { requests as seedRequests } from "../data/mockData";

function formatTime(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STEPS = ["Created", "Submitted", "Pending Approval", "Approved"];

function Workflow({ status }) {
  const stepIndex = status === "approved" ? 3 : status === "rejected" ? 2 : 2;
  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const isRejectedStop = status === "rejected" && step === "Approved";
        const done = i < stepIndex || (i === stepIndex && status === "approved");
        const current = i === stepIndex && status === "pending";
        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] ${
                  isRejectedStop
                    ? "border-slate-300 text-slate-300"
                    : done
                    ? "bg-[var(--color-navy)] border-[var(--color-navy)] text-white"
                    : current
                    ? "border-[var(--color-warning)] text-[var(--color-warning)]"
                    : "border-slate-300 text-slate-300"
                }`}
              >
                {done ? "✓" : current ? "●" : "○"}
              </div>
              {i < STEPS.length - 1 && <div className="w-px h-6 bg-slate-200" />}
            </div>
            <p className={`text-sm pb-6 ${done || current ? "text-slate-900 font-medium" : "text-slate-400"}`}>
              {step}
            </p>
          </div>
        );
      })}
      {status === "rejected" && (
        <p className="text-sm text-[var(--color-danger)] font-medium -mt-4">Rejected</p>
      )}
    </div>
  );
}

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(() => seedRequests.find((r) => r.id === id));

  if (!request) {
    return (
      <div className="text-sm text-slate-500">
        Request not found. <Link to="/requests" className="text-[var(--color-navy)] hover:underline">Back to requests</Link>
      </div>
    );
  }

  const isMaker = user?.email === request.maker.email;
  const canApprove = user?.role === "ADMIN" || user?.role === "MANAGER";
  const blockedReason = isMaker
    ? "You cannot approve a request you submitted."
    : !canApprove
    ? "You do not have permission to approve requests."
    : null;

  function decide(decision) {
    setRequest((r) => ({ ...r, status: decision, decidedBy: user.name, decidedAt: new Date().toISOString() }));
  }

  const history = [
    { time: request.submittedAt, actor: request.maker.name, label: "Created request" },
    { time: request.submittedAt, actor: "System", label: "Routed for approval" },
  ];
  if (request.status !== "pending") {
    history.push({
      time: request.decidedAt || request.submittedAt,
      actor: request.decidedBy || "—",
      label: request.status === "approved" ? "Approved request" : "Rejected request",
    });
  }

  return (
    <div className="max-w-3xl">
      <Link to="/requests" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft size={14} /> Back to requests
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-slate-500 mb-1">{request.id}</p>
          <h1 className="text-2xl font-semibold text-slate-900">{request.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{request.amount}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Workflow</h2>
          <Workflow status={request.status} />
        </div>

        <div className="col-span-2 space-y-6">
          <Card padded>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Request Details
            </h2>
            <dl className="text-sm divide-y divide-slate-100">
              {[
                ["Item", request.item],
                ["Amount", request.amount],
                ["Department", request.department],
                ["Reason", request.reason],
              ].map(([label, value]) => (
                <div key={label} className="flex py-2 first:pt-0 last:pb-0">
                  <dt className="w-32 shrink-0 text-slate-500">{label}</dt>
                  <dd className="text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card padded>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Maker</h2>
            <p className="text-sm text-slate-900 font-medium">{request.maker.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {request.maker.role} ·{" "}
              {new Date(request.submittedAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </Card>

          {request.status === "pending" && (
            <Card padded>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">
                Checker Action
              </h2>

              {blockedReason ? (
                <p className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-[6px] px-3 py-2.5">
                  <CircleAlert size={15} className="text-slate-400 shrink-0" />
                  {blockedReason}
                </p>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => decide("rejected")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-[var(--color-border)] text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button
                    onClick={() => decide("approved")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[var(--color-navy)] text-sm font-medium text-white hover:bg-[var(--color-midnight)]"
                  >
                    <Check size={14} /> Approve
                  </button>
                </div>
              )}
            </Card>
          )}

          <Card padded>
            <div className="flex items-center gap-2 mb-4">
              <HistoryIcon size={14} className="text-slate-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Audit History</h2>
            </div>
            <ul className="space-y-3">
              {history.map((h, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xs text-slate-400 font-mono w-28 shrink-0">{formatTime(h.time)}</span>
                  <span className="text-slate-900 font-medium w-32 shrink-0 truncate">{h.actor}</span>
                  <span className="text-slate-500">{h.label}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
