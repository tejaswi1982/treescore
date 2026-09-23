import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const halfWidth = 0.00013;
const halfHeight = 0.00011;

const samples = [
  [
    "JH-G01",
    "Northwest canopy cluster",
    "green",
    "green",
    72.82618,
    19.11594,
    "Compact, visibly tree-dominant patch; away from beach, water, shadows and the boundary edge.",
  ],
  [
    "JH-G02",
    "Central-west tree canopy",
    "green",
    "green",
    72.82872,
    19.11174,
    "Dense interior canopy visible in RGB and as a strong continuous NDVI response.",
  ],
  [
    "JH-G03",
    "Central-east tree canopy",
    "green",
    "green",
    72.83308,
    19.11077,
    "Tree-dominant interior patch with no water, beach or boundary-edge contamination.",
  ],
  [
    "JH-G04",
    "North-central green compound",
    "green",
    "green",
    72.8295,
    19.1123,
    "Strongly vegetated compound verified against RGB, NDVI and candidate masks.",
  ],
  [
    "JH-G05",
    "West-central canopy compound",
    "green",
    "green",
    72.8275,
    19.1095,
    "Compact tree-heavy compound with sustained response across the candidate range.",
  ],
  [
    "JH-N01",
    "Northwest roof and paving",
    "non-green",
    "non-green",
    72.82766,
    19.11448,
    "Bright roof and paving sample; avoids adjacent tree crowns and shadows.",
  ],
  [
    "JH-N02",
    "North-central hardscape",
    "non-green",
    "non-green",
    72.83059,
    19.113,
    "Clearly non-vegetated roof and paved surface after closer RGB/NDVI review.",
  ],
  [
    "JH-N03",
    "Northeast large roof and paving",
    "non-green",
    "non-green",
    72.83414,
    19.11384,
    "Large bright roof and paved surface, kept inside the polygon and away from edges.",
  ],
  [
    "JH-N04",
    "Western compact roofs",
    "non-green",
    "non-green",
    72.82686,
    19.11303,
    "Compact roof cluster with no material vegetation inside the final sample box.",
  ],
  [
    "JH-M01",
    "East-central landscaped fabric",
    "mixed",
    "mixed",
    72.832,
    19.1123,
    "Buildings and hardscape interspersed with established vegetation.",
  ],
  [
    "JH-M02",
    "Southeast buildings and gardens",
    "mixed",
    "mixed",
    72.8325,
    19.1075,
    "Mixed roofs, garden vegetation and roadside trees away from the corrected scope edge.",
  ],
  [
    "JH-M03",
    "South-central low-rise mix",
    "mixed",
    "mixed",
    72.8295,
    19.1085,
    "Low-rise urban fabric with a moderate, threshold-sensitive vegetation fraction.",
  ],
];

function rectangle(lon, lat) {
  return [
    [
      [lon - halfWidth, lat - halfHeight],
      [lon + halfWidth, lat - halfHeight],
      [lon + halfWidth, lat + halfHeight],
      [lon - halfWidth, lat + halfHeight],
      [lon - halfWidth, lat - halfHeight],
    ],
  ];
}

const featureCollection = {
  type: "FeatureCollection",
  name: "juhu-v0.3-calibration-reference-areas",
  features: samples.map(
    ([sampleId, sampleName, sampleClass, expectedType, lon, lat, notes]) => ({
      type: "Feature",
      properties: {
        sampleId,
        sampleName,
        sampleClass,
        expectedType,
        notes,
        sampleType: sampleClass === "non-green" ? "built-up" : sampleClass,
        observation: notes,
        reviewStatus: "visually-reviewed-accepted",
        localityId: "juhu",
        boundaryVersion: "juhu-v0.3",
        analysisStart: "2025-11-01",
        analysisEnd: "2026-02-28",
      },
      geometry: { type: "Polygon", coordinates: rectangle(lon, lat) },
    }),
  ),
};

const output = path.join(
  root,
  "data",
  "calibration",
  "juhu-reference-areas-v0.3.geojson",
);
fs.writeFileSync(output, `${JSON.stringify(featureCollection, null, 2)}\n`);
console.log(
  `Wrote ${featureCollection.features.length} Juhu v0.3 reference areas to ${output}`,
);
