import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { approvedAnalysisConfig } from "./approved-analysis.ts";
import {
  metricErrors,
  BOUNDARY_DISCLAIMER,
  MEASUREMENT_LABEL,
} from "../src/lib/metrics.ts";
import {
  pointInRing,
  pointInPolygon,
  polygonAreaSqKm,
} from "../src/lib/geometry.ts";
import type {
  BoundaryFeature,
  Position,
  Metric,
} from "../src/data/treeScoreSchema.ts";

export const readJson = (path: string) =>
  JSON.parse(readFileSync(path, "utf8"));
const cross = (a: Position, b: Position, c: Position) =>
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
function intersects(a: Position, b: Position, c: Position, d: Position) {
  const x = cross(a, b, c),
    y = cross(a, b, d),
    z = cross(c, d, a),
    w = cross(c, d, b);
  const within = (p: Position, q: Position, r: Position) =>
    r[0] >= Math.min(p[0], q[0]) &&
    r[0] <= Math.max(p[0], q[0]) &&
    r[1] >= Math.min(p[1], q[1]) &&
    r[1] <= Math.max(p[1], q[1]);
  return (
    (x * y < 0 && z * w < 0) ||
    (x === 0 && within(a, b, c)) ||
    (y === 0 && within(a, b, d)) ||
    (z === 0 && within(c, d, a)) ||
    (w === 0 && within(c, d, b))
  );
}
function ringsIntersect(a: Position[], b: Position[]) {
  return a
    .slice(1)
    .some((p, i) => b.slice(1).some((q, j) => intersects(a[i], p, b[j], q)));
}
export function validateBoundaries(collection: {
  type: string;
  features: BoundaryFeature[];
}) {
  const errors: string[] = [];
  if (
    collection.type !== "FeatureCollection" ||
    !Array.isArray(collection.features) ||
    !collection.features.length
  )
    return ["Expected nonempty FeatureCollection"];
  const ids = new Set<string>();
  for (const f of collection.features) {
    const p = f.properties;
    if (!p?.localityId || ids.has(p.localityId))
      errors.push("Missing/duplicate locality ID");
    ids.add(p?.localityId);
    if (
      !p?.name ||
      !p.parentLocality ||
      !p.boundaryVersion ||
      !["low", "medium", "high"].includes(p.boundaryConfidence) ||
      p.isOfficialBoundary !== false ||
      p.measurementLabel !== MEASUREMENT_LABEL ||
      !p.publicDisclaimer?.includes("not official")
    )
      errors.push(`Invalid boundary metadata: ${p?.localityId}`);
    if (
      f.geometry?.type !== "Polygon" ||
      !Array.isArray(f.geometry.coordinates) ||
      !f.geometry.coordinates.length
    ) {
      errors.push("Invalid Polygon");
      continue;
    }
    for (const ring of f.geometry.coordinates) {
      if (
        ring.length < 4 ||
        JSON.stringify(ring[0]) !== JSON.stringify(ring.at(-1))
      )
        errors.push(`Unclosed ring: ${p.localityId}`);
      if (
        ring.some(
          (pt) =>
            pt.length !== 2 ||
            !pt.every(Number.isFinite) ||
            pt[0] < -180 ||
            pt[0] > 180 ||
            pt[1] < -90 ||
            pt[1] > 90,
        )
      )
        errors.push("Invalid lon/lat");
      for (let i = 0; i < ring.length - 1; i++)
        for (let j = i + 2; j < ring.length - 1; j++) {
          if (i === 0 && j === ring.length - 2) continue;
          if (intersects(ring[i], ring[i + 1], ring[j], ring[j + 1]))
            errors.push(`Self intersection: ${p.localityId}`);
        }
    }
    const [outer, ...holes] = f.geometry.coordinates;
    for (const hole of holes)
      if (
        hole.some((pt) => !pointInRing(pt, outer)) ||
        ringsIntersect(outer, hole)
      )
        errors.push(`Hole outside outer ring: ${p.localityId}`);
    if (polygonAreaSqKm(f.geometry) <= 0)
      errors.push("Nonpositive polygon area");
  }
  for (let i = 0; i < collection.features.length; i++)
    for (let j = i + 1; j < collection.features.length; j++) {
      const a = collection.features[i].geometry,
        b = collection.features[j].geometry;
      if (
        ringsIntersect(a.coordinates[0], b.coordinates[0]) ||
        pointInPolygon(a.coordinates[0][0], b) ||
        pointInPolygon(b.coordinates[0][0], a)
      )
        errors.push("Overlapping locality polygons");
    }
  return errors;
}
export function validateDataset() {
  const config = readJson("data/analysis-config.json");
  const boundaries = readJson(config.boundaryFile);
  const errors = validateBoundaries(boundaries);
  const localities = readJson("data/localities.json") as {
    id: string;
    dataStatus: string;
    displayName: string;
    publishableRanking: boolean;
  }[];
  if (new Set(localities.map((l) => l.id)).size !== localities.length)
    errors.push("Duplicate locality configuration ID");
  for (const l of localities) {
    if (
      !l.displayName ||
      ![
        "pending",
        "processing",
        "unavailable",
        "verified",
        "planned",
        "boundary-review",
      ].includes(l.dataStatus) ||
      typeof l.publishableRanking !== "boolean"
    )
      errors.push("Invalid locality configuration");
    if (
      !["planned", "boundary-review"].includes(l.dataStatus) &&
      !boundaries.features.some(
        (f: BoundaryFeature) => f.properties.localityId === l.id,
      )
    )
      errors.push(`Missing boundary: ${l.id}`);
  }
  const seen = new Set<string>();
  for (const [file, kind] of [
    ["data/metrics/current.json", "current"],
    ["data/historical/series.json", "historical"],
  ]) {
    const records = readJson(file) as Metric[];
    if (!Array.isArray(records)) {
      errors.push(`Not an array: ${file}`);
      continue;
    }
    for (const m of records) {
      errors.push(...metricErrors(m).map((e) => `${file}: ${e}`));
      try {
        const approved = approvedAnalysisConfig(m, config);
        for (const key of [
          "methodVersion",
          "boundaryVersion",
          "waterMaskVersion",
          "cloudScoreMinimum",
          "sceneCloudMaximum",
          "minimumObservations",
          "minimumCoveragePercent",
          "waterNdwiThreshold",
          "crs",
          "scaleMeters",
          "thresholdDecisionId",
        ] as const) {
          if (m[key] !== approved[key])
            errors.push(`Approval mismatch: ${key}`);
        }
        if (m.threshold !== approved.greenThreshold)
          errors.push("Unapproved threshold");
      } catch (error) {
        errors.push(
          error instanceof Error ? error.message : "Invalid approval",
        );
      }
      const l = localities.find((l) => l.id === m.localityId);
      const boundary = boundaries.features.find(
        (f: BoundaryFeature) => f.properties.localityId === m.localityId,
      );
      if (!l || ["planned", "boundary-review"].includes(l.dataStatus))
        errors.push("Metric for non-active locality");
      if (
        m.dataStatus !== "verified" ||
        m.kind !== kind ||
        m.boundaryVersion !== boundary?.properties.boundaryVersion
      )
        errors.push("Production metric is not reviewed/current-boundary data");
      const key = [m.localityId, m.kind, m.seasonYear].join("/");
      if (seen.has(key)) errors.push(`Duplicate metric: ${key}`);
      seen.add(key);
    }
  }
  if (
    readFileSync(config.boundaryFile, "utf8") !==
    readFileSync("src/data/boundaries.json", "utf8")
  )
    errors.push("Run npm run sync:data");
  {
    const v02Path = "data/boundaries/mumbai-localities-v0.2.geojson";
    const digest = createHash("sha256")
      .update(readFileSync(v02Path))
      .digest("hex");
    if (
      digest !==
      "8a7121b7549f76354a8d99505f70b95550760c8568535cfa3644d54d8d5fd84f"
    )
      errors.push("v0.2 changed: create a new version instead");
    const powai = boundaries.features.find(
      (f: BoundaryFeature) =>
        f.properties.localityId === "powai-lake-urban-area",
    );
    if (powai?.geometry.coordinates.length !== 2)
      errors.push("Powai lake hole missing");
    const v02 = readJson(v02Path);
    for (const id of ["andheri-west-core", "powai-lake-urban-area"]) {
      const historical = v02.features.find(
        (f: BoundaryFeature) => f.properties.localityId === id,
      );
      const current = boundaries.features.find(
        (f: BoundaryFeature) => f.properties.localityId === id,
      );
      if (JSON.stringify(historical) !== JSON.stringify(current))
        errors.push(`${id} changed in the Juhu-only boundary revision`);
    }
    const juhu = boundaries.features.find(
      (f: BoundaryFeature) => f.properties.localityId === "juhu",
    );
    if (juhu?.properties.boundaryVersion !== "juhu-v0.3")
      errors.push("Current Juhu boundary is not v0.3");
    const v03Digest = createHash("sha256")
      .update(readFileSync("data/boundaries/mumbai-localities-v0.3.geojson"))
      .digest("hex");
    if (
      v03Digest !==
      "2834e22d72c99e6bc27a1b465b5321405dd0deb10e83e5b2f4e54870d61b5bef"
    )
      errors.push("Juhu v0.3 changed after boundary review");
  }
  return errors;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const errors = validateDataset();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `Boundary geometry, production metrics, unique IDs and provenance pass. ${BOUNDARY_DISCLAIMER}`,
    );
}
