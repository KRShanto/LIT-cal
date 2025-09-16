import React from "react";
import Image from "next/image";
import PublicNavbar from "@/components/public-navbar";
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

  // Accent hues for colorful feature icons
  const featureAccents = [
    {
      bg: "bg-emerald-500/15",
      text: "text-emerald-300",
      ring: "ring-emerald-500/20",
    },
    { bg: "bg-sky-500/15", text: "text-sky-300", ring: "ring-sky-500/20" },
    {
      bg: "bg-violet-500/15",
      text: "text-violet-300",
      ring: "ring-violet-500/20",
    },
    { bg: "bg-rose-500/15", text: "text-rose-300", ring: "ring-rose-500/20" },
    {
      bg: "bg-amber-500/15",
      text: "text-amber-300",
      ring: "ring-amber-500/20",
    },
    { bg: "bg-cyan-500/15", text: "text-cyan-300", ring: "ring-cyan-500/20" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <PublicNavbar />
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
                className="rounded-md bg-primary px-5 py-3 text-sm font-semibold tracking-wide text-neutral-950 shadow-lg ring-1 ring-primary/30 transition hover:opacity-95"
              >
                Get started free
              </a>
              <a
                href="#features"
                className="rounded-md border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
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
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${
                  featureAccents[index % featureAccents.length].bg
                } ${featureAccents[index % featureAccents.length].text} ${
                  featureAccents[index % featureAccents.length].ring
                }`}
              >
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
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-px bg-white/10" />
              <ul className="space-y-5">
                {steps.map((s, index) => (
                  <li
                    key={index}
                    className="relative grid grid-cols-[48px_1fr] items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="relative flex h-10 w-10 items-center justify-center">
                      <span className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur" />
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-neutral-950 text-sm font-semibold ring-1 ring-primary/40">
                        {s.step}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{s.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {s.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl ring-1 ring-black/20 backdrop-blur">
              <div className="h-[320px] rounded-xl border border-white/10 bg-[radial-gradient(ellipse_at_top_left,rgba(190,255,100,0.22),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(190,255,100,0.14),transparent_50%)]" />
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
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-neutral-950 shadow-lg ring-1 ring-primary/30 transition hover:opacity-95"
            >
              Create your first event
            </a>
            <a
              href="#features"
              className="rounded-md border border-white/15 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
            >
              See what’s inside
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
