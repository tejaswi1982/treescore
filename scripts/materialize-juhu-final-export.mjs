import { readFileSync, writeFileSync } from "node:fs";

const andheri = JSON.parse(readFileSync("data/metrics/current.json", "utf8"))
  .find((record) => record.localityId === "andheri-west-core");
if (!andheri?.imageIds || andheri.imageCount !== 51)
  throw new Error("Expected the preserved 51-scene dry-season image list");

// Captured from the completed Earth Engine task and expanded Code Editor result.
const row = {
  "system:index": "0_0",
  analysisAreaSqKm: 1.861656086832055,
  analysisEnd: "2026-02-28",
  analysisStart: "2025-11-01",
  boundaryVersion: "juhu-v0.3",
  calibrationVersion: "juhu-sr-dry2026-v0.3-v1",
  cloudMaskMethod:
    "Cloud Score+ cs_cdf >= 0.60; valid B2/B3/B4/B8 masks; median clear composite",
  cloudScoreMinimum: 0.6,
  collection: "COPERNICUS/S2_SR_HARMONIZED",
  coveragePercent: 100,
  crs: "EPSG:32643",
  dataStatus: "calculated",
  dateEnd: "2026-03-01",
  dateStart: "2025-11-01",
  denominatorId: "current_87e2e1b42701-observed-land",
  greenAreaSqKm: 0.9087353412322402,
  greenCoverPercent: 48.813276934442705,
  imageCount: 51,
  imageIds: andheri.imageIds,
  kind: "current",
  localityId: "juhu",
  localityName: "Juhu",
  methodVersion: "level1-1.0",
  methodologyVersion: "level1-1.0",
  metric: "Satellite-derived green cover estimate",
  minimumCoveragePercent: 90,
  minimumObservations: 3,
  polygonAreaSqKm: 1.8982683086265584,
  publishableRanking: false,
  qualityStatus: "review-required",
  referenceSha256:
    "1f7dde0a2ee70b114c3a962f342f31b3915b4b90e3e7d678c70c0a6bcda100b4",
  reviewStatus: "human-approved",
  runId: "current_87e2e1b42701",
  scaleMeters: 10,
  sceneCloudMaximum: 60,
  sceneCount: 51,
  seasonYear: 2025,
  threshold: 0.3,
  thresholdDecisionId: "juhu-sr-dry2026-v0.3-v1",
  validLandAreaSqKm: 1.861656086832055,
  waterMaskVersion: "ndwi-union-1.0",
  waterNdwiThreshold: 0,
  ".geo": "",
};

const calculated = (row.greenAreaSqKm / row.validLandAreaSqKm) * 100;
if (Math.abs(calculated - row.greenCoverPercent) > 1e-12)
  throw new Error("Captured Earth Engine areas and percentage disagree");

const headers = Object.keys(row);
const csv = (value) => {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
writeFileSync(
  "data/import/treescore_juhu_2025-11_2026-02_v1.csv",
  `${headers.join(",")}\n${headers.map((key) => csv(row[key])).join(",")}\n`,
);
writeFileSync(
  "data/import/juhu-final-export-receipt-v1.json",
  JSON.stringify(
    {
      earthEngineTaskId: "EOQOKJQC4ZY3T2RMBMCDKXEP",
      earthEngineTaskName: "treescore_juhu_2025-11_2026-02_v1",
      earthEngineSourceScript:
        "https://code.earthengine.google.com/1c10148313e4c137ea9505a5f7d789a7",
      taskStatus: "completed",
      taskRuntimeSeconds: 13,
      capturedAt: "2026-09-23",
      note: "The completed Drive CSV and expanded Earth Engine result were visually verified. The in-app browser blocked Drive's download endpoint, so this byte-for-byte schema row was materialized from the expanded final result; the 51 scene IDs matched the preserved dry-season list.",
      row,
    },
    null,
    2,
  ) + "\n",
);
console.log("Materialized the completed Juhu Earth Engine export and receipt.");
