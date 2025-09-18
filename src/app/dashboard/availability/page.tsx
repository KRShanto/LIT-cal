import React from "react";
import AvailabilityClient from "./availability-client";
import { getDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function Page() {
  const user = await getDbUser();
  const schedules = await prisma.schedule.findMany({
    where: { userId: user.id },
    include: { slots: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <AvailabilityClient
      defaultTimezone={user.timezone ?? ""}
      schedules={schedules}
    />
  );
}
