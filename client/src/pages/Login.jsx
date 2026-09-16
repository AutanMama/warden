import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, ShieldCheck, GitBranch, History } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@warden.dev", detail: "Full access — users, roles, audit log" },
  { role: "Manager", email: "manager@warden.dev", detail: "Can approve requests and view the audit log" },
  { role: "Staff", email: "staff@warden.dev", detail: "Can submit requests, nothing else" },
];
const DEMO_PASSWORD = "password123";

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
      <div className="hidden lg:flex lg:w-[42%] bg-[var(--color-navy)] text-white flex-col justify-between p-12">
        <Logo withWordmark />

        <div>
          <h1 className="text-2xl font-semibold leading-snug mb-3">
            A role-based operations platform with real maker/checker approvals.
          </h1>
          <p className="text-sm text-white/70 leading-relaxed mb-8">
            This is a live demo. Permissions are enforced by the API itself, not just hidden in the
            UI — a Staff account genuinely cannot approve requests, even by calling the endpoint directly.
          </p>

          <div className="space-y-5">
            <div className="flex gap-3">
              <ShieldCheck size={18} className="text-white/50 shrink-0 mt-0.5" />
              <p className="text-sm text-white/70">
                <span className="text-white font-medium">Server-enforced RBAC</span> — three roles,
                each with genuinely different access, checked on every request.
              </p>
            </div>
            <div className="flex gap-3">
              <GitBranch size={18} className="text-white/50 shrink-0 mt-0.5" />
              <p className="text-sm text-white/70">
                <span className="text-white font-medium">Maker/checker workflow</span> — nobody can
                approve a request they submitted themselves.
              </p>
            </div>
            <div className="flex gap-3">
              <History size={18} className="text-white/50 shrink-0 mt-0.5" />
              <p className="text-sm text-white/70">
                <span className="text-white font-medium">Full audit trail</span> — every approval,
                rejection, and role change is recorded and attributable.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/40">Operations &amp; Control Platform</p>
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
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-[8px] border border-[var(--color-border)] bg-white hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60 text-left transition-colors"
                >
                  <span>
                    <span className="block text-sm font-medium text-slate-900">{acc.role}</span>
                    <span className="block text-xs text-slate-500">{acc.detail}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
