import type { LocalityRecord } from "@/data/treeScoreSchema";
import { comparable } from "./metrics";
export function compareObservation(
  a: LocalityRecord,
  b: LocalityRecord,
): string {
  if (a.id === b.id) return "Choose two different analysis areas to compare.";
  if (!a.currentMetrics || !b.currentMetrics)
    return "Comparison will be available once both analyses have been reviewed.";
  if (!comparable(a.currentMetrics, b.currentMetrics))
    return "These reviewed analyses use different locality calibration thresholds. They are shown side by side, but a direct winner or rank is not published.";
  const gap =
    a.currentMetrics.greenCoverPercent - b.currentMetrics.greenCoverPercent;
  if (Math.abs(gap) < 0.05)
    return "These estimates are equal at the displayed precision.";
  return `${gap > 0 ? a.name : b.name} has an estimated ${Math.abs(gap).toFixed(1)} percentage points more green cover in the same analysis period.`;
}
