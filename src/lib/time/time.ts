const BASE_DATE = "2000-01-01";

export function formatTimeTo12h(time: string): string {
  if (!time) return "";

  const date = new Date(`${BASE_DATE}T${time}`);

  return date
    .toLocaleTimeString("en-MY", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
}

/**
 * Converts "08:30:00" -> "08:30"
 */
export function formatTimeShort(time: string): string {
  if (!time) return "";
  return time.slice(0, 5);
}

/**
 * Converts time range safely
 */
export function formatTimeRange(start: string, end: string): string {
  return `${formatTimeTo12h(start)} → ${formatTimeTo12h(end)}`;
}

/**
 * Optional: normalize DB time (ensures consistency)
 */
export function normalizeTime(time: string): string {
  return time.slice(0, 8);
}
