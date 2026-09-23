import { readFileSync, writeFileSync, renameSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  metricErrors,
  validDate,
  comparabilityKey,
} from "../src/lib/metrics.ts";
import { readJson } from "./validate-data.ts";
import type { Metric, BoundaryFeature } from "../src/data/treeScoreSchema.ts";
import { seasonDates } from "../src/lib/season.ts";
import { polygonAreaSqKm } from "../src/lib/geometry.ts";
import { approvedAnalysisConfig } from "./approved-analysis.ts";

export function parseCsv(text: string): Record<string, unknown>[] {
  const rows: string[][] = [];
  let row: string[] = [],
    value = "",
    quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(value);
      value = "";
    } else if (c === "\n" && !quoted) {
      row.push(value.replace(/\r$/, ""));
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
      value = "";
    } else value += c;
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  if (value || row.length) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }
  const header = rows.shift();
  if (!header || new Set(header).size !== header.length)
    throw new Error("Missing/duplicate CSV headers");
  const numeric = new Set([
    "validLandAreaSqKm",
    "sceneCount",
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
  ]);
  return rows.map((values) => {
    if (values.length !== header.length)
      throw new Error("CSV column count mismatch");
    return Object.fromEntries(
      header.map((key, i) => [
        key,
        numeric.has(key)
          ? values[i].trim() === ""
            ? null
            : Number(values[i])
          : key === "publishableRanking"
            ? values[i] === "true"
            : values[i],
      ]),
    );
  });
}
export interface Review {
  inputSha256: string;
  reviewer: string;
  reviewedAt: string;
  notes: string;
  boundaryReviewed: boolean;
  calibrationReviewed: boolean;
  cloudWaterReviewed: boolean;
  thresholdDecisionId: string;
  publishableRanking: boolean;
}

export function mergeReleaseRecords(
  existing: Metric[],
  imported: Metric[],
): Metric[] {
  const importedLocalities = new Set(imported.map((record) => record.localityId));
  return [
    ...existing.filter((record) => !importedLocalities.has(record.localityId)),
    ...imported,
  ];
}
export function reviewRecords(
  rows: unknown[],
  review: Review,
  digest: string,
  config: Record<string, unknown>,
  localities: { id: string; dataStatus: string }[],
): Metric[] {
  if (
    !review ||
    review.inputSha256 !== digest ||
    typeof review.reviewer !== "string" ||
    !review.reviewer.trim() ||
    typeof review.notes !== "string" ||
    !review.notes.trim() ||
    !validDate(review.reviewedAt) ||
    review.reviewedAt > new Date().toISOString().slice(0, 10) ||
    review.boundaryReviewed !== true ||
    review.calibrationReviewed !== true ||
    review.cloudWaterReviewed !== true ||
    typeof review.publishableRanking !== "boolean"
  )
    throw new Error(
      "Complete a genuine review tied to the SHA256 of this export",
    );
  if (!Array.isArray(rows) || !rows.length)
    throw new Error("No exported observations");
  const seen = new Set();
  const boundaries = readJson(String(config.boundaryFile))
    .features as BoundaryFeature[];
  const records = rows.map((value) => {
    if (!value || typeof value !== "object")
      throw new Error("Expected metric object");
    const m = value as Metric;
    if (!["current", "historical"].includes(m.kind))
      throw new Error(
        "Calibration/sample output is not a locality measurement release",
      );
    if (m.dataStatus !== "calculated")
      throw new Error(
        "Only calculated GEE exports are accepted; fixtures and pre-labelled verified rows are rejected",
      );
    if (
      !localities.some(
        (l) =>
          l.id === m.localityId &&
          !["planned", "boundary-review"].includes(l.dataStatus),
      )
    )
      throw new Error("Unknown/inactive locality");
    const boundary = boundaries.find(
      (f) => f.properties.localityId === m.localityId,
    );
    if (
      !boundary ||
      Math.abs(m.polygonAreaSqKm / polygonAreaSqKm(boundary.geometry) - 1) >
        0.02
    )
      throw new Error(
        "Export footprint differs from canonical locality geometry",
      );
    const approvedConfig = approvedAnalysisConfig(m, config);
    if (
      approvedConfig.publishableRanking === false &&
      review.publishableRanking
    )
      throw new Error("This approval does not authorize rankings");
    for (const key of [
      "boundaryVersion",
      "methodVersion",
      "waterMaskVersion",
      "cloudScoreMinimum",
      "sceneCloudMaximum",
      "minimumObservations",
      "minimumCoveragePercent",
      "waterNdwiThreshold",
      "crs",
      "scaleMeters",
      "thresholdDecisionId",
    ] as const)
      if (m[key] !== approvedConfig[key])
        throw new Error(`Config mismatch: ${key}`);
    if (
      m.threshold !== approvedConfig.greenThreshold ||
      m.thresholdDecisionId !== review.thresholdDecisionId
    )
      throw new Error("Threshold decision mismatch");
    const years =
      m.kind === "current"
        ? [config.currentSeasonYear]
        : (config.historicalSeasonYears as number[]);
    const dates = seasonDates(
      m.seasonYear,
      String(config.seasonStart),
      String(config.seasonEndExclusive),
    );
    if (
      !years.includes(m.seasonYear) ||
      m.dateStart !== dates.dateStart ||
      m.dateEnd !== dates.dateEnd
    )
      throw new Error("Season mismatch");
    const key = [m.localityId, m.kind, m.seasonYear].join("/");
    if (seen.has(key)) throw new Error(`Duplicate row: ${key}`);
    seen.add(key);
    const record: Metric = {
      ...m,
      dataStatus: "verified",
      qualityStatus: "reviewed",
      publishableRanking: review.publishableRanking,
      review: {
        reviewer: review.reviewer,
        reviewedAt: review.reviewedAt,
        notes: review.notes,
        inputSha256: digest,
      },
    };
    const errors = metricErrors(record);
    if (errors.length) throw new Error(`${key}: ${errors.join(", ")}`);
    return record;
  });
  if (
    new Set(records.map((m) => m.kind)).size !== 1 ||
    new Set(records.map((m) => m.runId)).size !== 1
  )
    throw new Error("Import one analysis kind and run at a time");
  if (new Set(records.map((m) => comparabilityKey(m, true))).size !== 1)
    throw new Error(
      "Export contains incompatible processing or denominator groups",
    );
  if (records[0].kind === "historical") {
    for (const id of new Set(records.map((m) => m.localityId))) {
      const series = records.filter((m) => m.localityId === id);
      if (
        series.some(
          (m) =>
            Math.abs(m.analysisAreaSqKm - series[0].analysisAreaSqKm) >
            0.000001,
        )
      )
        throw new Error("Historical land denominator changed");
    }
  }
  return records;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const input = process.argv[2],
      reviewFile = process.argv[3];
    if (!input || !reviewFile)
      throw new Error(
        "Usage: npm run import:metrics -- data/import/export.csv data/import/review.json [--dry-run]",
      );
    const content = readFileSync(input, "utf8");
    const digest = createHash("sha256")
      .update(readFileSync(input))
      .digest("hex");
    const rows = input.endsWith(".csv")
      ? parseCsv(content)
      : JSON.parse(content);
    const records = reviewRecords(
      rows,
      readJson(reviewFile),
      digest,
      readJson("data/analysis-config.json"),
      readJson("data/localities.json"),
    );
    const output =
      records[0].kind === "current"
        ? "data/metrics/current.json"
        : "data/historical/series.json";
    const existing = readJson(output) as Metric[];
    const release = mergeReleaseRecords(existing, records);
    // Replace each imported locality atomically while preserving other reviewed localities.
    if (!process.argv.includes("--dry-run")) {
      mkdirSync("data/import/reviews", { recursive: true });
      writeFileSync(
        `data/import/reviews/${digest}.json`,
        JSON.stringify(readJson(reviewFile), null, 2) + "\n",
      );
      writeFileSync(`${output}.tmp`, JSON.stringify(release, null, 2) + "\n");
      renameSync(`${output}.tmp`, output);
    }
    console.log(
      `${records.length} reviewed records ${process.argv.includes("--dry-run") ? "validated" : "saved to " + output}; ${release.length} total records in release. Rebuild/restart TreeScore to publish.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
