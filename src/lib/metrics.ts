import type { Metric, LocalityRecord } from "../data/treeScoreSchema.ts";

export const MEASUREMENT_LABEL = "Satellite-derived green cover estimate";
export const BOUNDARY_DISCLAIMER =
  "TreeScore-defined analysis area, not an official administrative boundary.";
const numeric = [
  "seasonYear",
  "greenCoverPercent",
  "analysisAreaSqKm",
  "greenAreaSqKm",
  "polygonAreaSqKm",
  "coveragePercent",
  "imageCount",
  "threshold",
  "cloudScoreMinimum",
  "sceneCloudMaximum",
  "minimumObservations",
  "minimumCoveragePercent",
  "waterNdwiThreshold",
  "scaleMeters",
] as const;
const strings = [
  "localityId",
  "thresholdDecisionId",
  "collection",
  "methodVersion",
  "boundaryVersion",
  "waterMaskVersion",
  "denominatorId",
  "crs",
  "runId",
] as const;
export function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function metricErrors(value: unknown): string[] {
  if (!value || typeof value !== "object") return ["Expected metric object"];
  const m = value as Metric;
  const errors: string[] = [];
  for (const k of numeric)
    if (typeof m[k] !== "number" || !Number.isFinite(m[k]))
      errors.push(`Invalid ${k}`);
  for (const k of strings)
    if (
      typeof m[k] !== "string" ||
      !m[k].trim() ||
      /YOUR_|TODO|UNREVIEWED/i.test(m[k])
    )
      errors.push(`Missing ${k}`);
  if (errors.length) return errors;
  if (!["current", "historical"].includes(m.kind)) errors.push("Invalid kind");
  if (!["calculated", "verified", "fixture"].includes(m.dataStatus))
    errors.push("Invalid dataStatus");
  if (typeof m.publishableRanking !== "boolean")
    errors.push("Invalid publishableRanking");
  if (m.metric !== MEASUREMENT_LABEL)
    errors.push("Incorrect measurement label");
  if (
    m.greenCoverPercent < 0 ||
    m.greenCoverPercent > 100 ||
    m.coveragePercent < m.minimumCoveragePercent ||
    m.coveragePercent > 100.01 ||
    m.minimumCoveragePercent < 90 ||
    m.minimumCoveragePercent > 100
  )
    errors.push("Invalid percentage or insufficient coverage");
  if (
    m.analysisAreaSqKm <= 0 ||
    m.greenAreaSqKm < 0 ||
    m.greenAreaSqKm > m.analysisAreaSqKm ||
    m.polygonAreaSqKm < m.analysisAreaSqKm * 0.98
  )
    errors.push("Invalid area/denominator");
  if (
    Math.abs(
      (m.greenAreaSqKm / m.analysisAreaSqKm) * 100 - m.greenCoverPercent,
    ) > 0.02
  )
    errors.push("Percentage disagrees with areas");
  if (
    m.threshold < -1 ||
    m.threshold > 1 ||
    m.waterNdwiThreshold < -1 ||
    m.waterNdwiThreshold > 1 ||
    m.cloudScoreMinimum < 0 ||
    m.cloudScoreMinimum > 1 ||
    m.sceneCloudMaximum < 0 ||
    m.sceneCloudMaximum > 100 ||
    m.scaleMeters !== 10 ||
    m.crs !== "EPSG:32643"
  )
    errors.push("Invalid processing parameters");
  if (
    !Number.isInteger(m.minimumObservations) ||
    m.minimumObservations < 1 ||
    !Number.isInteger(m.imageCount) ||
    m.imageCount < m.minimumObservations
  )
    errors.push("Insufficient observations");
  if (
    !Number.isInteger(m.seasonYear) ||
    m.seasonYear < 2015 ||
    !validDate(m.dateStart) ||
    !validDate(m.dateEnd) ||
    m.dateStart >= m.dateEnd ||
    m.dateEnd > new Date().toISOString().slice(0, 10) ||
    !m.dateStart.startsWith(String(m.seasonYear))
  )
    errors.push("Invalid analysis dates");
  if (
    (m.kind === "current" && m.collection !== "COPERNICUS/S2_SR_HARMONIZED") ||
    (m.kind === "historical" && m.collection !== "COPERNICUS/S2_HARMONIZED")
  )
    errors.push("Wrong collection for analysis kind");
  if (
    m.collection === "COPERNICUS/S2_SR_HARMONIZED" &&
    m.dateStart < "2017-03-28"
  )
    errors.push("SR archive does not cover this period");
  if (
    m.dataStatus === "verified" &&
    (!m.review ||
      typeof m.review.reviewer !== "string" ||
      !m.review.reviewer.trim() ||
      typeof m.review.notes !== "string" ||
      !m.review.notes.trim() ||
      !validDate(m.review.reviewedAt) ||
      m.review.reviewedAt > new Date().toISOString().slice(0, 10) ||
      typeof m.review.inputSha256 !== "string" ||
      !/^[a-f0-9]{64}$/.test(m.review.inputSha256))
  )
    errors.push("Missing review provenance");
  return errors;
}
export function isPublicMetric(value: unknown): value is Metric {
  return (
    !!value &&
    typeof value === "object" &&
    (value as Metric).dataStatus === "verified" &&
    metricErrors(value).length === 0
  );
}
export function comparabilityKey(m: Metric, historical = false) {
  return JSON.stringify([
    m.kind,
    m.collection,
    m.methodVersion,
    m.boundaryVersion,
    m.threshold,
    m.thresholdDecisionId,
    m.waterMaskVersion,
    m.cloudScoreMinimum,
    m.sceneCloudMaximum,
    m.minimumObservations,
    m.minimumCoveragePercent,
    m.waterNdwiThreshold,
    m.crs,
    m.scaleMeters,
    m.denominatorId,
    historical ? m.dateStart.slice(4) : m.dateStart,
    historical ? m.dateEnd.slice(4) : m.dateEnd,
    historical ? Number(m.dateEnd.slice(0, 4)) - m.seasonYear : m.seasonYear,
  ]);
}
export function comparable(
  a: Metric | null,
  b: Metric | null,
  historical = false,
) {
  return (
    isPublicMetric(a) &&
    isPublicMetric(b) &&
    comparabilityKey(a, historical) === comparabilityKey(b, historical)
  );
}
export function rankingGroups(localities: LocalityRecord[]) {
  const groups = new Map<string, LocalityRecord[]>();
  for (const l of localities) {
    const m = l.currentMetrics;
    if (
      l.dataStatus !== "verified" ||
      !l.publishableRanking ||
      !isPublicMetric(m) ||
      !m.publishableRanking ||
      m.localityId !== l.id ||
      m.boundaryVersion !== l.boundary.properties.boundaryVersion
    )
      continue;
    const key = comparabilityKey(m);
    groups.set(key, [...(groups.get(key) ?? []), l]);
  }
  return [...groups.values()].map((group) =>
    group.sort(
      (a, b) =>
        b.currentMetrics!.greenCoverPercent -
          a.currentMetrics!.greenCoverPercent || a.name.localeCompare(b.name),
    ),
  );
}
export function historicalChange(series: Metric[], baselineYear = 2015) {
  const valid = series
    .filter((m) => isPublicMetric(m) && m.kind === "historical")
    .sort((a, b) => a.seasonYear - b.seasonYear);
  const baseline = valid.find((m) => m.seasonYear === baselineYear);
  const current = valid.at(-1);
  if (
    !baseline ||
    !current ||
    baseline.seasonYear === current.seasonYear ||
    baseline.localityId !== current.localityId ||
    !comparable(baseline, current, true) ||
    Math.abs(baseline.analysisAreaSqKm - current.analysisAreaSqKm) > 0.000001
  )
    return null;
  const percentagePoints =
    current.greenCoverPercent - baseline.greenCoverPercent;
  return {
    baseline,
    current,
    percentagePoints,
    relativePercent:
      baseline.greenCoverPercent === 0
        ? null
        : (percentagePoints / baseline.greenCoverPercent) * 100,
  };
}
export function displayPercent(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value.toFixed(1)}%`
    : "Analysis pending";
}
