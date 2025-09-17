type TimezoneOption = { value: string; label: string };

let cachedOptions: TimezoneOption[] | null = null;

function formatLabel(tz: string): string {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "shortOffset",
    });
    const name = dtf
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value;
    const pretty = name?.replace("GMT", "GMT") || "GMT";
    return `(${pretty}) ${tz}`;
  } catch {
    return tz;
  }
}

export function getTimezoneOptions(): TimezoneOption[] {
  if (cachedOptions) return cachedOptions;

  const zones = ((typeof Intl !== "undefined" &&
    Intl.supportedValuesOf?.("timeZone")) || [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Dhaka",
    "Asia/Kolkata",
    "Asia/Tokyo",
    "Australia/Sydney",
  ]) as string[];

  cachedOptions = zones.map((z) => ({ value: z, label: formatLabel(z) }));
  return cachedOptions;
}
