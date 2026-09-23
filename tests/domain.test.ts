import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import { pointInPolygon, polygonAreaSqKm } from "../src/lib/geometry.ts";
import {
  metricErrors,
  isPublicMetric,
  rankingGroups,
  historicalChange,
  comparable,
  MEASUREMENT_LABEL,
  displayPercent,
} from "../src/lib/metrics.ts";
import {
  validateBoundaries,
  validateDataset,
  readJson,
} from "../scripts/validate-data.ts";
import {
  mergeReleaseRecords,
  parseCsv,
  reviewRecords,
} from "../scripts/import-metrics.ts";
import { seasonDates } from "../src/lib/season.ts";
import { displayAnalysisPeriod } from "../src/lib/formatters.ts";
import type {
  Metric,
  LocalityRecord,
  BoundaryFeature,
} from "../src/data/treeScoreSchema.ts";
const boundaries = readJson("src/data/boundaries.json") as {
  type: string;
  features: BoundaryFeature[];
};
// SYNTHETIC TEST VALUES ONLY. Never imported by src or production data files.
function metric(changes: Partial<Metric> = {}): Metric {
  return {
    localityId: "andheri-west-core",
    kind: "current",
    seasonYear: 2025,
    greenCoverPercent: 20,
    analysisAreaSqKm: 4,
    greenAreaSqKm: 0.8,
    polygonAreaSqKm: 4.81,
    coveragePercent: 98,
    imageCount: 10,
    threshold: 0.3,
    thresholdDecisionId: "test-decision",
    dateStart: "2025-11-01",
    dateEnd: "2026-03-01",
    collection: "COPERNICUS/S2_SR_HARMONIZED",
    metric: MEASUREMENT_LABEL,
    methodVersion: "level1-1.0",
    boundaryVersion: "mumbai-localities-v0.2",
    waterMaskVersion: "ndwi-union-1.0",
    denominatorId: "synthetic-common",
    cloudScoreMinimum: 0.6,
    sceneCloudMaximum: 60,
    minimumObservations: 3,
    minimumCoveragePercent: 90,
    waterNdwiThreshold: 0,
    crs: "EPSG:32643",
    scaleMeters: 10,
    runId: "test-only",
    dataStatus: "verified",
    publishableRanking: true,
    review: {
      reviewer: "Test only",
      reviewedAt: "2026-09-01",
      notes: "Synthetic test fixture",
      inputSha256: "a".repeat(64),
    },
    ...changes,
  };
}
function locality(m: Metric): LocalityRecord {
  return {
    id: m.localityId,
    name: m.localityId,
    parentLocality: "test",
    city: "Mumbai",
    boundary: boundaries.features.find(
      (f) => f.properties.localityId === m.localityId,
    )!,
    dataStatus: "verified",
    publishableRanking: true,
    currentMetrics: m,
    historicalMetrics: [],
  };
}
test("production schema, metadata, unique IDs and immutable boundary hash pass", () =>
  assert.deepEqual(validateDataset(), []));
test("all polygons valid, closed and non-overlapping", () =>
  assert.deepEqual(validateBoundaries(boundaries), []));
test("Powai lake hole excludes lake and includes urban land", () => {
  const geometry = boundaries.features[1].geometry;
  assert.equal(geometry.coordinates.length, 2);
  assert.equal(pointInPolygon([72.903, 19.124], geometry), false);
  assert.equal(pointInPolygon([72.903, 19.114], geometry), true);
  assert.equal(pointInPolygon([72.9005, 19.128], geometry), false);
});
test("point-in-polygon handles inside, outside, boundary and malformed points", () => {
  const g = boundaries.features[0].geometry;
  assert.equal(pointInPolygon([72.83, 19.13], g), true);
  assert.equal(pointInPolygon([72.95, 19.15], g), false);
  assert.equal(pointInPolygon(g.coordinates[0][0], g), true);
  assert.equal(pointInPolygon([NaN, 19.13], g), false);
});
test("polygon area matches independently supplied approximate footprint", () => {
  for (const [i, area] of [4.81, 3.57, 1.9].entries())
    assert.ok(
      Math.abs(polygonAreaSqKm(boundaries.features[i].geometry) - area) < 0.1,
    );
});
test("Juhu v0.3 is current while v0.2 remains preserved", () => {
  const historical = readJson(
    "data/boundaries/mumbai-localities-v0.2.geojson",
  ) as {
    features: BoundaryFeature[];
  };
  const oldJuhu = historical.features.find(
    (f) => f.properties.localityId === "juhu",
  )!;
  const currentJuhu = boundaries.features.find(
    (f) => f.properties.localityId === "juhu",
  )!;
  assert.equal(oldJuhu.properties.boundaryVersion, "mumbai-localities-v0.2");
  assert.equal(currentJuhu.properties.boundaryVersion, "juhu-v0.3");
  assert.ok(Math.abs(polygonAreaSqKm(oldJuhu.geometry) - 2.85) < 0.1);
  assert.ok(Math.abs(polygonAreaSqKm(currentJuhu.geometry) - 1.9) < 0.1);
  for (const id of ["andheri-west-core", "powai-lake-urban-area"])
    assert.deepEqual(
      boundaries.features.find((f) => f.properties.localityId === id),
      historical.features.find((f) => f.properties.localityId === id),
    );
});
test("invalid self-intersection and missing metadata fail validation", () => {
  const b = structuredClone(boundaries);
  b.features[0].geometry.coordinates = [
    [
      [72, 19],
      [73, 20],
      [72, 20],
      [73, 19],
      [72, 19],
    ],
  ];
  assert.ok(validateBoundaries(b).some((e) => e.includes("intersection")));
});
test("fixtures, pending, invalid and unreviewed values are not public", () => {
  assert.equal(isPublicMetric(metric()), true);
  for (const value of [
    null,
    {},
    metric({ dataStatus: "fixture" }),
    metric({ dataStatus: "calculated" }),
    metric({ review: undefined }),
    metric({ greenCoverPercent: NaN }),
    metric({ coveragePercent: 20 }),
    metric({ greenCoverPercent: 200 }),
    metric({ dateEnd: "2026-02-30" }),
  ])
    assert.equal(isPublicMetric(value), false);
  assert.equal(displayPercent(null), "Analysis pending");
});
test("ranking sorts eligible rows and excludes non-publishable/fixture/pending", () => {
  const a = locality(metric()),
    b = locality(
      metric({
        localityId: "powai-lake-urban-area",
        greenCoverPercent: 30,
        analysisAreaSqKm: 3,
        greenAreaSqKm: 0.9,
        polygonAreaSqKm: 3.57,
      }),
    );
  assert.deepEqual(
    rankingGroups([a, b])[0].map((l) => l.id),
    ["powai-lake-urban-area", "andheri-west-core"],
  );
  assert.equal(
    rankingGroups([
      { ...a, dataStatus: "pending" },
      { ...b, publishableRanking: false },
      locality(metric({ dataStatus: "fixture" })),
      locality(metric({ publishableRanking: false })),
    ]).length,
    0,
  );
});
test("incompatible periods, thresholds, boundaries, source and masks stay separate", () => {
  const a = metric();
  for (const patch of [
    { threshold: 0.4 },
    { methodVersion: "other" },
    { denominatorId: "other" },
    { dateStart: "2025-11-02" },
    { waterNdwiThreshold: 0.1 },
    { boundaryVersion: "v0.3" },
  ])
    assert.equal(comparable(a, metric(patch)), false);
  const groups = rankingGroups([
    locality(a),
    locality(
      metric({
        localityId: "powai-lake-urban-area",
        analysisAreaSqKm: 3,
        greenAreaSqKm: 0.6,
        polygonAreaSqKm: 3.57,
        threshold: 0.4,
      }),
    ),
  ]);
  assert.equal(groups.length, 2);
});
test("historical change uses matched series, handles zero baseline and missing data", () => {
  const base = metric({
    kind: "historical",
    collection: "COPERNICUS/S2_HARMONIZED",
    seasonYear: 2015,
    dateStart: "2015-11-01",
    dateEnd: "2016-03-01",
  });
  const end = metric({
    kind: "historical",
    collection: "COPERNICUS/S2_HARMONIZED",
    greenCoverPercent: 10,
    greenAreaSqKm: 0.4,
  });
  assert.equal(historicalChange([end, base])?.percentagePoints, -10);
  assert.equal(historicalChange([base, end])?.relativePercent, -50);
  assert.equal(historicalChange([end]), null);
  assert.equal(
    historicalChange([base, { ...end, denominatorId: "different" }]),
    null,
  );
  assert.equal(historicalChange([base, metric()]), null);
  assert.equal(
    historicalChange([{ ...base, greenCoverPercent: 0, greenAreaSqKm: 0 }, end])
      ?.relativePercent,
    null,
  );
});
test("SR before archive availability is rejected", () =>
  assert.ok(
    metricErrors(
      metric({
        seasonYear: 2015,
        dateStart: "2015-11-01",
        dateEnd: "2016-03-01",
      }),
    ).length,
  ));
test("CSV handles quoted commas, BOM, CRLF, missing numeric values and duplicate headers", () => {
  const rows = parseCsv(
    '\uFEFFlocalityId,seasonYear,notes\r\njuhu,2025,"hello, world"\r\n',
  );
  assert.deepEqual(rows, [
    { localityId: "juhu", seasonYear: 2025, notes: "hello, world" },
  ]);
  assert.equal(parseCsv('seasonYear\n""\n')[0]?.seasonYear, undefined);
  assert.throws(() => parseCsv("x,x\n1,2"));
  assert.throws(() => parseCsv("x,y\n1"));
});
test("import requires hash-bound review, real calculated rows and matching config", () => {
  const m = metric({ dataStatus: "calculated" }),
    config = {
      ...readJson("data/analysis-config.json"),
      greenThreshold: 0.3,
      thresholdDecisionId: "test-decision",
    };
  const review = {
    inputSha256: "a".repeat(64),
    reviewer: "Test",
    reviewedAt: "2026-09-01",
    notes: "Synthetic test only",
    boundaryReviewed: true,
    calibrationReviewed: true,
    cloudWaterReviewed: true,
    thresholdDecisionId: "test-decision",
    publishableRanking: false,
  };
  const result = reviewRecords(
    [m],
    review,
    "a".repeat(64),
    config,
    readJson("data/localities.json"),
  );
  assert.equal(result[0].dataStatus, "verified");
  assert.equal(result[0].publishableRanking, false);
  assert.throws(() =>
    reviewRecords(
      [m],
      review,
      "b".repeat(64),
      config,
      readJson("data/localities.json"),
    ),
  );
  assert.throws(() =>
    reviewRecords(
      [{ ...m, dataStatus: "fixture" }],
      review,
      "a".repeat(64),
      config,
      readJson("data/localities.json"),
    ),
  );
  assert.throws(() =>
    reviewRecords(
      [m, m],
      review,
      "a".repeat(64),
      config,
      readJson("data/localities.json"),
    ),
  );
  assert.throws(() =>
    reviewRecords(
      [m],
      { ...review, calibrationReviewed: false },
      "a".repeat(64),
      config,
      readJson("data/localities.json"),
    ),
  );
});
test("current imports replace one locality without removing other reviewed records", () => {
  const andheri = metric({
    localityId: "andheri-west-core",
    runId: "andheri-final",
  });
  const oldJuhu = metric({ localityId: "juhu", runId: "juhu-old" });
  const newJuhu = metric({ localityId: "juhu", runId: "juhu-final" });
  const merged = mergeReleaseRecords([andheri, oldJuhu], [newJuhu]);
  assert.deepEqual(
    merged.map((record) => [record.localityId, record.runId]),
    [
      ["andheri-west-core", "andheri-final"],
      ["juhu", "juhu-final"],
    ],
  );
});
test("production source has no demo dataset import", () => {
  assert.ok(
    !readFileSync("src/data/localities.ts", "utf8").includes("demoCanopyData"),
  );
  assert.ok(!existsSync("src/data/demoCanopyData.ts"));
  for (const file of [
    "data/metrics/current.json",
    "data/historical/series.json",
  ])
    assert.ok(readJson(file).every(isPublicMetric));
});
test("two-locality beta preserves exact reviewed values and withholds rankings", () => {
  const current = readJson("data/metrics/current.json");
  const andheri = current.find(
    (record: Metric) => record.localityId === "andheri-west-core",
  );
  const juhu = current.find((record: Metric) => record.localityId === "juhu");
  assert.equal(current.length, 2);
  assert.equal(andheri.greenCoverPercent, 40.161364821801435);
  assert.equal(andheri.greenAreaSqKm, 1.934924661478349);
  assert.equal(andheri.validLandAreaSqKm, 4.817875762100552);
  assert.equal(juhu.greenCoverPercent, 48.813276934442705);
  assert.equal(juhu.greenAreaSqKm, 0.9087353412322402);
  assert.equal(juhu.validLandAreaSqKm, 1.861656086832055);
  assert.equal(juhu.threshold, 0.3);
  assert.equal(juhu.boundaryVersion, "juhu-v0.3");
  assert.equal(displayPercent(juhu.greenCoverPercent), "48.8%");
  assert.ok(!current.some((record: Metric) => record.localityId === "powai-lake-urban-area"));
  assert.ok(current.every((record: Metric) => record.publishableRanking === false));
  assert.equal(readJson("data/historical/series.json").length, 0);
});
test("PWA icons exist and worker does not cache measurement responses", () => {
  const manifest = readJson("public/manifest.webmanifest");
  for (const icon of manifest.icons) assert.ok(existsSync("public" + icon.src));
  assert.ok(!readFileSync("public/sw.js", "utf8").includes("cache.put"));
  new vm.Script(readFileSync("public/sw.js", "utf8"));
});
test("generated GEE scripts parse and retain Powai geometry", () => {
  for (const mode of [
    "calibration",
    "calibration-historical",
    "current",
    "historical",
  ]) {
    const source = readFileSync(`gee/treescore-${mode}.gee.js`, "utf8");
    new vm.Script(source);
    assert.ok(source.includes("powai-lake-urban-area"));
    assert.ok(source.includes("cs_cdf"));
    assert.ok(source.includes("commonValid"));
  }
});

test("configurable seasonal windows preserve explicit year boundaries", () => {
  assert.deepEqual(seasonDates(2025, "11-01", "03-01"), {
    dateStart: "2025-11-01",
    dateEnd: "2026-03-01",
  });
  assert.deepEqual(seasonDates(2025, "01-01", "03-01"), {
    dateStart: "2025-01-01",
    dateEnd: "2025-03-01",
  });
});

test("approved beta export is scoped to its locality, season, methods and sample set", () => {
  const rows = parseCsv(
    readFileSync(
      "data/import/treescore_andheri_west_core_2025-11_2026-02_v1.csv",
      "utf8",
    ),
  );
  const review = readJson("data/import/andheri-reviewed-beta-v1.json");
  const config = readJson("data/analysis-config.json");
  const run = (values: unknown[]) =>
    reviewRecords(
      values,
      review,
      review.inputSha256,
      config,
      readJson("data/localities.json"),
    );
  const approved = run(rows);
  assert.equal(approved.length, 1);
  assert.equal(approved[0].dataStatus, "verified");
  assert.equal(approved[0].qualityStatus, "reviewed");
  assert.equal(displayPercent(approved[0].greenCoverPercent), "40.2%");
  assert.ok(Math.abs(approved[0].analysisAreaSqKm - 4.8179) < 0.0001);
  assert.equal(config.greenThreshold, null);
  for (const patch of [
    { localityId: "juhu" },
    { localityId: "powai-lake-urban-area" },
    { dateStart: "2025-11-02" },
    { kind: "historical" },
    { collection: "COPERNICUS/S2_HARMONIZED" },
    { methodVersion: "level1-2.0" },
    { cloudScoreMinimum: 0.7 },
    { minimumObservations: 4 },
    { waterNdwiThreshold: 0.1 },
    { referenceSha256: "b".repeat(64) },
    { calibrationVersion: "other" },
    { threshold: 0.3 },
  ])
    assert.throws(() => run([{ ...rows[0], ...patch }]));
  assert.equal(rankingGroups([locality(approved[0])]).length, 0);
});

test("Juhu final export replays through its scoped human approval", () => {
  const rows = parseCsv(
    readFileSync(
      "data/import/treescore_juhu_2025-11_2026-02_v1.csv",
      "utf8",
    ),
  );
  const review = readJson("data/import/juhu-reviewed-beta-v1.json");
  const run = (values: unknown[]) =>
    reviewRecords(
      values,
      review,
      review.inputSha256,
      readJson("data/analysis-config.json"),
      readJson("data/localities.json"),
    );
  const approved = run(rows);
  assert.equal(approved[0].greenCoverPercent, 48.813276934442705);
  assert.equal(approved[0].threshold, 0.3);
  assert.equal(approved[0].boundaryVersion, "juhu-v0.3");
  assert.equal(approved[0].publishableRanking, false);
  for (const patch of [
    { threshold: 0.35 },
    { boundaryVersion: "mumbai-localities-v0.2" },
    { referenceSha256: "b".repeat(64) },
  ])
    assert.throws(() => run([{ ...rows[0], ...patch }]));
});

test("public period includes February rather than the exclusive March boundary", () => {
  assert.equal(
    displayAnalysisPeriod("2025-11-01", "2026-03-01"),
    "Nov 2025 to Feb 2026",
  );
});

test("service worker uses explicit offline fallback and removes only its own old caches", async () => {
  const handlers: Record<string, (event: unknown) => void> = {};
  const deleted: string[] = [];
  const context = vm.createContext({
    URL,
    Response,
    self: {
      location: { origin: "https://treescore.test" },
      addEventListener: (name: string, handler: (event: unknown) => void) => {
        handlers[name] = handler;
      },
      clients: { claim: async () => {} },
      skipWaiting: async () => {},
    },
    caches: {
      keys: async () => ["treescore-v1", "treescore-static-v2", "other-app"],
      delete: async (key: string) => {
        deleted.push(key);
      },
      match: async (path: string) => {
        assert.equal(path, "/offline.html");
        return new Response("Offline: reconnect for current estimates.");
      },
    },
    fetch: async () => {
      throw new Error("offline");
    },
  });
  new vm.Script(readFileSync("public/sw.js", "utf8")).runInContext(context);
  let activation: Promise<void> = Promise.resolve();
  handlers.activate({
    waitUntil: (promise: Promise<void>) => {
      activation = promise;
    },
  });
  await activation;
  assert.deepEqual(deleted, ["treescore-v1"]);
  let response: Promise<Response> = Promise.resolve(new Response("unhandled"));
  handlers.fetch({
    request: {
      method: "GET",
      url: "https://treescore.test/locality/juhu",
      mode: "navigate",
    },
    respondWith: (promise: Promise<Response>) => {
      response = promise;
    },
  });
  assert.match(await (await response).text(), /Offline/);
});
