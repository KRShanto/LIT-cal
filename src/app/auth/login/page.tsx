"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Show success message if redirected from registration
    if (searchParams.get("registered")) {
      setSuccess("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to dashboard on successful login
      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during login");
      } else {
        setError("An unknown error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-16 lg:grid-cols-2">
        {/* Left: login form (flat) */}
        <div className="w-full">
          <div className="mb-6 text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Log in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-md border border-white/10 bg-neutral-950 py-3 pl-10 pr-3 text-base text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
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
                className="w-full rounded-md border border-white/10 bg-neutral-950 py-3 pl-10 pr-12 text-base text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
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

            <div className="flex items-center justify-end text-sm">
              <Link
                href="/auth/forget-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-3 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-neutral-950 transition hover:opacity-95 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-4 text-left text-sm text-slate-300">
              Don’t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-primary hover:underline"
              >
                Create one free
              </Link>
            </p>
          </form>
        </div>

        {/* Right: simple feature list */}
        <div className="hidden lg:block">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Stay on top of your scheduling
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                "Access your event types and schedules",
                "Manage upcoming bookings and reschedules",
                "Configure buffers, questions, and reminders",
              ].map((text, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-primary ring-1 ring-white/10">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <p className="text-sm text-slate-300">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
