type TimezoneOption = { value: string; label: string };

let cachedOptions: TimezoneOption[] | null = null;

function formatLabel(tz: string): string {
  try {
    // Show only the IANA timezone path (e.g., "Asia/Dhaka") without any offset prefix
    return tz;
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
