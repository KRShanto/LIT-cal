import React from "react";
import AvailabilityClient from "./availability-client";
import { getDbUser } from "@/lib/auth";

export default async function Page() {
  const user = await getDbUser();
  return <AvailabilityClient defaultTimezone={user.timezone ?? ""} />;
}
