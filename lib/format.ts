const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Riyadh",
});

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatAge(iso: string, now = Date.now()): string {
  const elapsedMinutes = Math.max(
    1,
    Math.floor((now - new Date(iso).getTime()) / 60_000),
  );

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m`;
  }

  const hours = Math.floor(elapsedMinutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  return `${Math.floor(hours / 24)}d`;
}

export function formatCount(value: number, singular: string): string {
  return `${value} ${singular}${value === 1 ? "" : "s"}`;
}
