import fs from "node:fs";

const thresholds = [0.2, 0.25, 0.3, 0.35, 0.4, 0.45];
const areas = {
  "JH-G01": 661.242625576842,
  "JH-G02": 682.4106846828088,
  "JH-G03": 648.3130913528743,
  "JH-G04": 678.491677647011,
  "JH-G05": 683.1936093199487,
  "JH-N01": 679.666116811715,
  "JH-N02": 660.8540925269033,
  "JH-N03": 648.3139447978899,
  "JH-N04": 661.6351017671473,
  "JH-M01": 665.1668382532456,
  "JH-M02": 649.4885174321194,
  "JH-M03": 659.2853457880955,
};
const percentages = {
  "JH-G01": [
    100, 100, 100, 89.8636629630808, 89.8636629630808, 61.94427987728772,
  ],
  "JH-G02": [
    100, 100, 100, 98.16197601639338, 96.32395189248791, 87.6507762505345,
  ],
  "JH-G03": [
    100, 100, 96.61426909873519, 87.00121025081071, 81.74123545777434,
    72.12817587607597,
  ],
  "JH-G04": [
    93.81860119687322, 90.12131649588841, 83.41998820465592, 83.41998820465592,
    53.206235837738014, 53.206235837738014,
  ],
  "JH-G05": [
    100, 100, 85.71428457566405, 73.0923693018773, 65.80608169921767,
    29.259896214019676,
  ],
  "JH-N01": [11.361013863969115, 11.361013863969115, 0, 0, 0, 0],
  "JH-N02": [0, 0, 0, 0, 0, 0],
  "JH-N03": [9.431681641799663, 0, 0, 0, 0, 0],
  "JH-N04": [0, 0, 0, 0, 0, 0],
  "JH-M01": [
    72.9522714262466, 72.9522714262466, 57.92575437246401, 57.92575437246401,
    54.0954662964357, 40.95462881105451,
  ],
  "JH-M02": [
    75.01508747071337, 53.83222523114849, 45.322871613455156,
    10.440554438730116, 10.440554438730116, 0,
  ],
  "JH-M03": [
    65.75505024959244, 24.197383239377835, 23.60285303588563,
    18.965516386725152, 3.8049938832301247, 3.8049938832301247,
  ],
};
const expectedMeans = [
  [98.76372023937463, 5.198173876442194, 71.24080304885081],
  [98.02426329917769, 2.8402534659922787, 50.32729329892431],
  [93.14970837581103, 0, 42.2838263406016],
  [86.30784134736362, 0, 29.11060839930643],
  [77.38823357005974, 0, 22.780338206131983],
  [60.837872811131184, 0, 14.919874231428212],
];
const references = JSON.parse(
  fs.readFileSync("data/calibration/juhu-reference-areas-v0.3.geojson", "utf8"),
);
const meta = Object.fromEntries(
  references.features.map((f) => [f.properties.sampleId, f.properties]),
);
const rows = [];
for (const [sampleId, values] of Object.entries(percentages)) {
  if (!meta[sampleId] || values.length !== thresholds.length)
    throw new Error(`Invalid sample ${sampleId}`);
  let previous = Infinity;
  values.forEach((classifiedGreenPercent, i) => {
    if (classifiedGreenPercent > previous + 1e-9)
      throw new Error(`${sampleId} is not monotonic`);
    previous = classifiedGreenPercent;
    const sampleArea = areas[sampleId];
    rows.push({
      sampleId,
      sampleName: meta[sampleId].sampleName,
      sampleClass: meta[sampleId].sampleClass,
      expectedType: meta[sampleId].expectedType,
      reviewStatus: meta[sampleId].reviewStatus,
      threshold: thresholds[i],
      sampleArea,
      classifiedGreenArea: (sampleArea * classifiedGreenPercent) / 100,
      classifiedGreenPercent,
    });
  });
}
const classes = ["green", "non-green", "mixed"];
const classMeans = thresholds.map((threshold, i) => {
  const result = { threshold };
  classes.forEach((sampleClass, classIndex) => {
    const values = rows
      .filter((r) => r.threshold === threshold && r.sampleClass === sampleClass)
      .map((r) => r.classifiedGreenPercent);
    result[`${sampleClass}MeanPercent`] =
      values.reduce((a, b) => a + b, 0) / values.length;
    if (
      Math.abs(
        result[`${sampleClass}MeanPercent`] - expectedMeans[i][classIndex],
      ) > 1e-9
    )
      throw new Error(`Mean mismatch ${threshold} ${sampleClass}`);
  });
  return result;
});
const csvColumns = [
  "sampleId",
  "sampleName",
  "sampleClass",
  "expectedType",
  "reviewStatus",
  "threshold",
  "sampleArea",
  "classifiedGreenArea",
  "classifiedGreenPercent",
];
const quote = (v) =>
  typeof v === "string" && /[",\n]/.test(v)
    ? `"${v.replaceAll('"', '""')}"`
    : String(v);
fs.writeFileSync(
  "data/calibration/juhu-calibration-results-v0.3.csv",
  [
    csvColumns.join(","),
    ...rows.map((r) => csvColumns.map((c) => quote(r[c])).join(",")),
  ].join("\n") + "\n",
);
const candidateResults = [
  [0.2, 1.2728224033726419, 68.370437073508],
  [0.25, 1.0848209703432858, 58.27182464132272],
  [0.3, 0.9087353412322402, 48.813276934442705],
  [0.35, 0.7363043771281823, 39.55104180284649],
  [0.4, 0.5780112546663769, 31.048229517513505],
  [0.45, 0.43047992036153765, 23.123493292151352],
].map(([threshold, greenAreaSqKm, greenCoverPercent]) => ({
  threshold,
  greenAreaSqKm,
  greenCoverPercent,
}));
const provenance = {
  localityId: "juhu",
  localityName: "Juhu",
  boundaryVersion: "juhu-v0.3",
  analysisStart: "2025-11-01",
  analysisEndExclusive: "2026-03-01",
  analysisEndInclusive: "2026-02-28",
  collection: "COPERNICUS/S2_SR_HARMONIZED",
  sceneCount: 51,
  cloudMaskMethod:
    "Scene cloudiness <= 60%; Cloud Score+ cs_cdf >= 0.60; valid B2/B3/B4/B8 masks; minimum 3 clear observations; median composite",
  waterMaskMethod:
    "Composite NDWI > 0 excluded from the valid-land denominator",
  scaleMeters: 10,
  crs: "EPSG:32643",
  methodologyVersion: "level1-1.0",
  polygonAreaSqKm: 1.8982683086266041,
  areaWithMinimumObservationsSqKm: 1.8924283366256724,
  excludedWaterSqKm: 0.030772249793617392,
  validLandAreaSqKm: 1.861656086832055,
  coveragePercent: 98.07128309374805,
};
fs.writeFileSync(
  "data/calibration/juhu-candidate-run-v0.3-v1.json",
  JSON.stringify(
    {
      ...provenance,
      runId: "juhu-sr-dry2026-v0.3-candidates-v1",
      savedEarthEngineScript: "juhu-v0-3-dry-season-2026-candidates",
      candidateResults,
      productionEligible: false,
      notes:
        "Real Earth Engine results for the reviewed Juhu v0.3 boundary. Candidate values replace v0.2 for calibration; no threshold is approved and no production export/import has run.",
    },
    null,
    2,
  ) + "\n",
);
fs.writeFileSync(
  "data/calibration/juhu-calibration-summary-v0.3.json",
  JSON.stringify(
    {
      ...provenance,
      calibrationVersion: "juhu-sr-dry2026-v0.3-calibration-v1-draft",
      acceptedSampleCount: 12,
      rejectedOrRevisedCount: 5,
      candidateThresholds: thresholds,
      classMeans,
      recommendedThreshold: 0.3,
      plausibleRange: [0.3, 0.35],
      reviewerStatus: "agent-visual-reviewed-human-pending",
      thresholdApproved: false,
      candidateResults,
      warnings: [
        "One transient RGB tile/server connection error occurred on a later rerun; calculations and earlier/later RGB rendering succeeded.",
        "Full-locality estimate changes by 18.7208 percentage points across 0.25, 0.30 and 0.35.",
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log(`Wrote ${rows.length} calibration rows and Juhu v0.3 summaries.`);
