export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <section className="rounded-xl border border-white/10 bg-neutral-900 p-5">
        <h2 className="text-lg font-semibold">Today</h2>
        <p className="mt-2 text-base text-slate-300">No upcoming bookings.</p>
      </section>
      <section className="rounded-xl border border-white/10 bg-neutral-900 p-5">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <ul className="mt-2 space-y-2 text-base text-slate-300">
          <li>+ Create event type</li>
          <li>+ Share booking link</li>
          <li>+ Update availability</li>
        </ul>
      </section>
      <section className="rounded-xl border border-white/10 bg-neutral-900 p-5 md:col-span-2 xl:col-span-1">
        <h2 className="text-lg font-semibold">Stats (coming soon)</h2>
        <p className="mt-2 text-base text-slate-300">
          Views, conversions, and more.
        </p>
      </section>
    </div>
  );
}
