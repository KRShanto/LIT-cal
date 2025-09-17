import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import { getDbUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getDbUser();

  return (
    <div className="h-screen bg-neutral-950 text-slate-100 overflow-hidden">
      <div className="flex h-full">
        <Sidebar user={user} />
        <div className="flex h-full flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
