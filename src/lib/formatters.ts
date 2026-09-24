/**
 * Display formatting helpers. Keep all number/text formatting here
 * so values render identically everywhere.
 */

/** "8.7%" */
export function formatPercent(value: number): string {
  return `${value.toFixed(1).replace(/\.0$/, "")}%`;
}

/** "-2.1%" with explicit sign; trend in percentage points. */
export function formatTrend(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

/** "▼" / "▲" / "•" for trend direction or no change. */
export function trendArrow(value: number): string {
  if (value < 0) return "▼";
  if (value > 0) return "▲";
  return "•";
}

/** "14 / 20" */
export function formatRank(rank: number, total: number): string {
  return `${rank} / ${total}`;
}

/** Two-digit rank label for editorial lists: "02". */
export function padRank(rank: number): string {
  return String(rank).padStart(2, "0");
}

/** The stored end is exclusive; present the actual first/last month. */
export function displayAnalysisPeriod(
  start: string,
  endExclusive: string,
): string {
  const format = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${format.format(new Date(start))} to ${format.format(new Date(Date.parse(endExclusive) - 86400000))}`;
}
