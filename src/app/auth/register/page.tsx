"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Registration failed");

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok)
        throw new Error(loginData?.error || "Login after register failed");

      window.location.href = "/";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-40 bg-neutral-950 text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-24 lg:grid-cols-2">
        {/* Left side */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-base text-slate-300">
            No credit card required. Upgrade anytime.
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-base text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-md border border-white/10 bg-neutral-950 py-3 pl-10 pr-3 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
            </div>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-md border border-white/10 bg-neutral-950 py-3 pl-10 pr-3 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-md border border-white/10 bg-neutral-950 py-3 pl-10 pr-12 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold tracking-wide text-neutral-950 transition hover:opacity-95 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Continue with email"}
            </button>

            <p className="mt-4 text-base text-slate-300">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>

        {/* Right side */}
        <div className="hidden lg:block">
          <div>
            <p className="inline-flex items-center gap-2 text-base text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary" />{" "}
              Try Teams plan free
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Explore premium features with your 14‑day Teams trial
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                "Multi-person and co-hosted meetings",
                "Round Robin meeting distribution",
                "Meeting reminders, follow-ups, and notifications",
                "Connect payment tools like Stripe",
                "Remove branding",
              ].map((text, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-primary ring-1 ring-white/10">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <p className="text-base text-slate-300">{text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-400">
              Join teams who schedule with confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
