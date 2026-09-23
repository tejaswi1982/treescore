# Data and release contract

Canonical TypeScript shapes and runtime validation: `src/data/treeScoreSchema.ts`, `src/lib/metrics.ts`. Production stores are JSON arrays; initially empty, not zero-valued observations.

| Location | Purpose |
|---|---|
| `data/localities.json` | Stable ID, display/parent name, lifecycle status, explicit ranking eligibility, expansion order |
| `data/boundaries/*.geojson` | Versioned geometry and non-official confidence/disclaimer metadata |
| `src/data/boundaries.json` | Generated exact copy consumed by Next.js/Leaflet; never edit directly |
| `data/analysis-config.json` | Source collections, dates, quality settings and reviewed threshold decision |
| `data/metrics/current.json` | Reviewed current SR records |
| `data/historical/series.json` | Reviewed seasonal TOA records |
| `data/calibration/` | Real reference polygons and recorded threshold decision, initially pending |
| `data/import/` | Raw exports and per-export review receipts; no credentials |
| `gee/` | Generated self-contained scripts for Code Editor |
| `tests/fixtures/legacy/` | Historical illustrative prototype values, non-executable text, never published |

## Metric fields (schema only, not measurements)

| Field(s) | Type / meaning |
|---|---|
| `localityId`, `kind`, `seasonYear` | Stable ID; current/historical; November-start year |
| `greenCoverPercent` | Finite 0–100; agrees with green area / analysis area |
| `analysisAreaSqKm`, `greenAreaSqKm`, `polygonAreaSqKm` | Positive denominator, nonnegative green area, geometry footprint |
| `coveragePercent`, `imageCount` | Land coverage and count of candidate scenes intersecting this area (not per-pixel clear observations) |
| `threshold`, `thresholdDecisionId` | NDVI cutoff and documented calibration decision |
| `dateStart`, `dateEnd` | ISO dates; inclusive start, exclusive end |
| `collection`, `metric`, `methodVersion`, `boundaryVersion` | Provenance and exact public measurement label |
| `cloudScoreMinimum`, `sceneCloudMaximum`, `minimumObservations`, `minimumCoveragePercent` | QA configuration |
| `waterNdwiThreshold`, `waterMaskVersion`, `denominatorId` | Water protocol and observed-land/common-mask identity |
| `crs`, `scaleMeters`, `runId` | Processing grid and reproducible configuration ID |
| `dataStatus` | `calculated` for raw GEE; `verified` after review; `fixture` never public |
| `publishableRanking` | False by default; requires locality eligibility too |
| `review` | Reviewer, date, notes and exact raw-file SHA256; required for verified rows |
| `qualityStatus`, `imageIds` | Additional raw-export diagnostics preserved by importer |

Missing metric = pending, never zero. Planned/boundary-review localities do not get measured pages. Processing can be configured without inventing values. Invalid or fixture metrics are filtered from presentation; validation additionally blocks a production build containing them.

Current and historical releases are independent. Comparability keys include kind, collection, boundary/method, threshold decision, QA/water settings, scale, CRS, denominator ID and period. Historical comparison replaces calendar years in the key with equivalent seasonal dates and verifies equal land area. Pending data, single observations, missing baselines and incompatible groups yield explanatory unavailable states.

## Adding an area

Add a config row as planned or boundary-review. Obtain/review its geometry and metadata; preserve new boundary versions. Keep planned expansion in order: Bandra West, Juhu-extended, Versova, Powai-extended. After boundary review, enable the area as pending/processing, regenerate boundaries/GEE scripts, analyse, review and import. No UI components require a new hard-coded ID list. Recompute comparison series whenever the boundary version changes.
