import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { createRequest } from "../api/requests";

const DEPARTMENTS = ["Engineering", "Finance", "Design", "Marketing", "Operations"];

const FIELD_CLASS =
  "w-full rounded-[6px] bg-white border border-[var(--color-border)] px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400";

export default function NewRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", item: "", amount: "", department: DEPARTMENTS[0], reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const request = await createRequest(form);
      navigate(`/requests/${request.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit this request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <Link to="/requests" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft size={14} /> Back to requests
      </Link>

      <PageHeader title="New Request" subtitle="Submit a request for approval." />

      <Card padded>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger-bg)] rounded-[6px] px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              required
              value={form.title}
              onChange={update("title")}
              placeholder="e.g. Laptop Procurement"
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="item">
              Item
            </label>
            <input
              id="item"
              required
              value={form.item}
              onChange={update("item")}
              placeholder="What exactly are you requesting?"
              className={FIELD_CLASS}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="amount">
                Amount <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="amount"
                value={form.amount}
                onChange={update("amount")}
                placeholder="₦0"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="department">
                Department
              </label>
              <select id="department" value={form.department} onChange={update("department")} className={FIELD_CLASS}>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="reason">
              Reason
            </label>
            <textarea
              id="reason"
              required
              rows={3}
              value={form.reason}
              onChange={update("reason")}
              placeholder="Why is this needed?"
              className={FIELD_CLASS}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/requests"
              className="px-4 py-2 rounded-[6px] border border-[var(--color-border)] text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[var(--color-navy)] text-sm font-medium text-white hover:bg-[var(--color-midnight)] disabled:opacity-60"
            >
              {submitting && <LoaderCircle size={14} className="animate-spin" />}
              Submit Request
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
