import React from "react";
import Image from "next/image";
import {
  CalendarClock,
  Clock,
  ShieldCheck,
  Globe,
  Link2,
  Sparkles,
} from "lucide-react";

/**
 * LandingPage
 * A modern, dark-only marketing page for LIT Cal.
 *
 * - Uses Tailwind CSS v4 utilities and CSS theme tokens
 * - Single dark aesthetic with lime primary accents
 * - Sections: Navbar, Hero, Features, How It Works, CTA, Footer
 */
export default function LandingPage() {
  // Feature items using lucide-react icons (user will install the package)
  const features = [
    {
      title: "Calendly-style booking",
      description: "Share a link, get booked. Clean and fast scheduling.",
      Icon: CalendarClock,
    },
    {
      title: "Smart availability",
      description: "Weekly schedules and buffers to protect your focus.",
      Icon: Clock,
    },
    {
      title: "No double-booking",
      description: "We prevent overlaps so your time stays yours.",
      Icon: ShieldCheck,
    },
    {
      title: "Timezone aware",
      description: "Invitees see local times; everything stored in UTC.",
      Icon: Globe,
    },
    {
      title: "Shareable links",
      description: "One URL for all your event types and schedules.",
      Icon: Link2,
    },
    {
      title: "Delightful UX",
      description: "Fast, minimal, and accessible booking flows.",
      Icon: Sparkles,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Create an event",
      description: "Pick duration, add buffers, and set your questions.",
    },
    {
      step: "02",
      title: "Share the link",
      description: "Invite guests with a simple URL that just works.",
    },
    {
      step: "03",
      title: "Get booked",
      description: "We hold the slot and keep your schedule clean.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="LIT Cal"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="font-semibold tracking-tight">LIT Cal</span>
          </div>
          <div className="hidden items-center gap-6 sm:flex">
            <a
              href="#features"
              className="text-sm text-slate-300 hover:text-slate-100"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-sm text-slate-300 hover:text-slate-100"
            >
              How it works
            </a>
            <a
              href="#cta"
              className="text-sm text-slate-300 hover:text-slate-100"
            >
              Get started
            </a>
            <a
              href="#cta"
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Try free
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle grid + glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="bg-[linear-gradient(to_right,transparent_0,transparent_49%,rgba(255,255,255,0.04)_50%,transparent_51%,transparent_100%)] bg-[length:40px_40px] absolute inset-0 opacity-20" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
              Scheduling, simplified
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Make time work for you, not against you
            </h1>
            <p className="max-w-xl text-base text-slate-300">
              Share availability, avoid double-booking, and give a delightful
              booking experience your invitees will love.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Get started free
              </a>
              <a
                href="#features"
                className="rounded-md border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
              >
                Explore features
              </a>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />{" "}
                No credit card
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary/80" />{" "}
                2‑minute setup
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary/60" />{" "}
                Built‑in dark mode
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl ring-1 ring-black/20 backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-36 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="h-36 rounded-xl border border-white/10 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="h-36 rounded-xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="h-36 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-400">
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
                  Next.js
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
                  Prisma
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
                  Postgres
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to get booked
          </h2>
          <p className="mt-3 text-slate-300">
            From smart availability to beautiful booking flows—LIT Cal has you
            covered.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.05]"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-black/10">
                <item.Icon size={18} />
              </div>
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="text-slate-300">
              A streamlined flow so invitees can book in seconds—no email
              ping‑pong.
            </p>
            <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
              {steps.map((s, index) => (
                <div
                  key={index}
                  className="grid gap-3 p-6 sm:grid-cols-[72px_1fr]"
                >
                  <div className="text-sm font-mono text-slate-400">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-slate-300">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl ring-1 ring-black/20 backdrop-blur">
              <div className="h-[320px] rounded-xl border border-white/10 bg-[radial-gradient(ellipse_at_top_left,rgba(190,255,100,0.2),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(190,255,100,0.12),transparent_50%)]" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to reclaim your calendar?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Set up your first event in minutes. Share the link. Get booked.
            That’s it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Create free account
            </a>
            <a
              href="#features"
              className="rounded-md border border-white/10 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="LIT Cal"
              width={22}
              height={22}
              className="rounded"
            />
            <span className="text-sm text-slate-400">
              © {new Date().getFullYear()} LIT Cal
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <a href="#features" className="hover:text-slate-200">
              Features
            </a>
            <a href="#how" className="hover:text-slate-200">
              How it works
            </a>
            <a href="#cta" className="hover:text-slate-200">
              Get started
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
