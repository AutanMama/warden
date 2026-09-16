import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, ShieldCheck, GitBranch, History, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@warden.dev", detail: "Full access — users, roles, audit log" },
  { role: "Manager", email: "manager@warden.dev", detail: "Can approve requests and view the audit log" },
  { role: "Staff", email: "staff@warden.dev", detail: "Can submit requests, nothing else" },
];
const DEMO_PASSWORD = "password123";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Server-enforced RBAC",
    body: "Three roles, each with genuinely different access, checked on every request.",
  },
  {
    icon: GitBranch,
    title: "Maker/checker workflow",
    body: "Nobody can approve a request they submitted themselves.",
  },
  {
    icon: History,
    title: "Full audit trail",
    body: "Every approval, rejection, and role change is recorded and attributable.",
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin(loginEmail, loginPassword) {
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate("/overview");
    } catch (err) {
      const message = err.response
        ? err.response.data?.message || "Invalid email or password."
        : "Can't reach the server right now — please try again in a moment.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    doLogin(email, password);
  }

  function handleDemoLogin(demoEmail) {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    doLogin(demoEmail, DEMO_PASSWORD);
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Context panel — explains what this is to a stranger landing here cold */}
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-[var(--color-navy)] text-white flex-col justify-between p-14"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Logo withWordmark />
          <span className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-success)]/15 border border-[var(--color-success)]/30 text-[13px] font-medium text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            System Operational
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-[2.5rem] leading-[1.1] font-bold tracking-tight mb-4">
            Real approvals.
            <br />
            Real permissions.
            <br />
            <span className="text-white/50">No hidden shortcuts.</span>
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed mb-10 max-w-md">
            This is a live demo. Every restriction below is enforced by the API itself — try to
            break it.
          </p>

          <div className="space-y-6">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="w-9 h-9 rounded-[8px] bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-white">{title}</p>
                  <p className="text-sm text-white/55 leading-relaxed mt-0.5">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/35">Operations &amp; Control Platform</p>
      </div>

      {/* Sign-in panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <Logo withWordmark={false} size="lg" />
            <p className="mt-3 font-semibold tracking-wide text-slate-900">WARDEN</p>
            <p className="text-xs text-slate-500 mt-0.5">Operations &amp; Control Platform</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[var(--color-border)] rounded-[10px] p-8 space-y-5"
          >
            <div>
              <h1 className="text-lg font-semibold text-slate-900 mb-1">Sign in</h1>
              <p className="text-sm text-slate-500">Access the operations platform.</p>
            </div>

            {error && (
              <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger-bg)] rounded-[6px] px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[6px] bg-white border border-[var(--color-border)] px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[6px] bg-white border border-[var(--color-border)] px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-navy)] hover:bg-[var(--color-midnight)] disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-[6px] transition-colors"
            >
              {loading && <LoaderCircle size={15} className="animate-spin" />}
              Sign in
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3 text-center">
              Or explore instantly as
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin(acc.email)}
                  className="group w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-[8px] border border-[var(--color-border)] bg-white hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60 text-left transition-colors"
                >
                  <span>
                    <span className="block text-sm font-medium text-slate-900">{acc.role}</span>
                    <span className="block text-xs text-slate-500">{acc.detail}</span>
                  </span>
                  <ArrowRight
                    size={15}
                    className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
