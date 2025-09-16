import React from "react";
import Image from "next/image";

/**
 * LandingPage
 * A static, responsive marketing page for the Lit Cal MVP.
 *
 * - Uses Tailwind CSS with dark mode support
 * - Purely presentational (no auth, no data fetching)
 * - Sections: Navbar, Hero, Logos, Features, How It Works, Testimonials, CTA, Footer
 */
export default function LandingPage() {
  const features = [
    {
      title: "Calendly-style booking",
      description:
        "Share a simple link so invitees can pick a time that works for everyone.",
      icon: "/globe.svg",
    },
    {
      title: "Smart availability",
      description:
        "Weekly schedules with buffers to avoid back-to-back burnout.",
      icon: "/window.svg",
    },
    {
      title: "No double-booking",
      description:
        "Protect your time with overlapping booking checks built-in.",
      icon: "/file.svg",
    },
    {
      title: "Timezone-aware",
      description:
        "Invitee times are localized; we store everything safely in UTC.",
      icon: "/globe.svg",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create an event type",
      description:
        "Set duration, buffers, and questions to collect from invitees.",
    },
    {
      step: "02",
      title: "Share your link",
      description: "Send a branded URL and let people pick a time that works.",
    },
    {
      step: "03",
      title: "Get booked",
      description:
        "We lock in the slot and keep your schedule synced and tidy.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Lit Cal simplified my scheduling chaos. Now I just send a link and done.",
      author: "Product Consultant",
    },
    {
      quote: "The buffers and timezone handling are perfect for global teams.",
      author: "Engineering Manager",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-neutral-950 dark:text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 dark:supports-[backdrop-filter]:bg-neutral-950/60 dark:bg-neutral-950/80 border-b border-slate-200/60 dark:border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/globe.svg" alt="LIT Cal" width={28} height={28} />
            <span className="font-semibold tracking-tight">LIT Cal</span>
          </div>
          <div className="hidden items-center gap-6 sm:flex">
            <a href="#features" className="text-sm hover:opacity-80">
              Features
            </a>
            <a href="#how" className="text-sm hover:opacity-80">
              How it works
            </a>
            <a href="#testimonials" className="text-sm hover:opacity-80">
              Love
            </a>
            <a
              href="#cta"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-sm transition hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              Get started
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-15%] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-400/20 to-emerald-400/20 blur-3xl dark:from-indigo-500/10 dark:via-sky-400/10 dark:to-emerald-400/10" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Scheduling, simplified
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Make time work for you, not against you
            </h1>
            <p className="max-w-xl text-base text-slate-600 dark:text-slate-300">
              Lit Cal helps you share availability, avoid double-booking, and
              deliver a clean booking experience your invitees will love.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90 dark:bg-white dark:text-neutral-900"
              >
                Get started free
              </a>
              <a
                href="#features"
                className="rounded-md border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              >
                Explore features
              </a>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500" />{" "}
                No credit card
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" />{" "}
                2‑minute setup
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />{" "}
                Dark mode ready
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="rounded-md border border-slate-200/70 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <Image
                  src="/window.svg"
                  alt="Product preview"
                  width={900}
                  height={600}
                  className="h-auto w-full opacity-90"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Image
                  src="/next.svg"
                  alt="Next.js"
                  width={120}
                  height={28}
                  className="h-6 w-auto opacity-60 dark:opacity-80"
                />
                <Image
                  src="/vercel.svg"
                  alt="Vercel"
                  width={120}
                  height={28}
                  className="h-6 w-auto opacity-60 dark:opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos strip */}
      <section className="border-y border-slate-200/80 bg-slate-50/50 py-8 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-6 opacity-70">
          <Image src="/next.svg" alt="Next.js" width={100} height={24} />
          <Image src="/vercel.svg" alt="Vercel" width={100} height={24} />
          <Image src="/globe.svg" alt="Globe" width={22} height={22} />
          <Image src="/file.svg" alt="File" width={22} height={22} />
          <Image src="/window.svg" alt="Window" width={22} height={22} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to get booked
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            From smart availability to beautiful booking flows—Lit Cal has you
            covered.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="group rounded-xl border border-slate-200 bg-white/70 p-6 transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 ring-1 ring-black/5 dark:from-indigo-500/10 dark:to-emerald-500/10">
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="opacity-80"
                />
              </div>
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              A streamlined flow so invitees can book in seconds—no email
              ping‑pong.
            </p>
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white/60 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]">
              {howItWorks.map((step, index) => (
                <div
                  key={index}
                  className="grid gap-3 p-6 sm:grid-cols-[72px_1fr]"
                >
                  <div className="text-sm font-mono text-slate-500 dark:text-slate-400">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-sky-400/10 to-emerald-400/10 blur-2xl" />
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <Image
                src="/window.svg"
                alt="Scheduling preview"
                width={900}
                height={600}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Loved by busy teams
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Real words from people reclaiming their calendars.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, index) => (
            <blockquote
              key={index}
              className="rounded-xl border border-slate-200 bg-white/70 p-6 text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200"
            >
              <p className="text-sm leading-relaxed">“{t.quote}”</p>
              <footer className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                — {t.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-400/20 to-emerald-400/20 blur-3xl dark:from-indigo-500/10 dark:via-sky-400/10 dark:to-emerald-400/10" />
        </div>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to reclaim your calendar?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Set up your first event in minutes. Share the link. Get booked.
            That’s it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              Create free account
            </a>
            <a
              href="#features"
              className="rounded-md border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200/70 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/globe.svg" alt="Lit Cal" width={22} height={22} />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Lit Cal
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:opacity-80">
              Features
            </a>
            <a href="#how" className="hover:opacity-80">
              How it works
            </a>
            <a href="#cta" className="hover:opacity-80">
              Get started
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
