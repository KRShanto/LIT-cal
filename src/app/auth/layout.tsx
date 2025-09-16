import type { ReactNode } from "react";
import PublicNavbar from "@/components/public-navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <PublicNavbar />
      </header>
      <main>{children}</main>
    </div>
  );
}
