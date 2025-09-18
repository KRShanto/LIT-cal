import React from "react";
import SchedulingClient from "@/app/dashboard/scheduling/scheduling-client";
import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";

export default async function Page() {
  const user = await getDbUser();
  const schedules = await prisma.schedule.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, isDefault: true },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return <SchedulingClient schedules={schedules} />;
}
