import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/overview");
    } catch (err) {
      const message = err.response
        ? err.response.data?.message || "Invalid email or password."
        : "Can't reach the server. Is the API running on port 4000?";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
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

        <p className="text-xs text-slate-400 text-center mt-6">
          Demo: admin@warden.dev · manager@warden.dev · staff@warden.dev — password123
        </p>
      </div>
    </div>
  );
}
