# Satellite-derived green cover estimate

Green-cover estimates are satellite-derived NDVI-based proxies that capture vegetation, not exact tree counts. Every boundary is a **TreeScore-defined analysis area, not an official administrative boundary**. Andheri West Core uses v0.2; Juhu uses the reviewed medium-confidence v0.3 correction.

## Protocol: level1-1.0

Use Sentinel-2 red (B4) and near-infrared (B8), nominal 10 m bands. NDVI = `(B8 − B4) / (B8 + B4)`. Trees, shrubs, gardens, lawns, grass and mangroves can all contribute. A 10 m pixel is a mixture of surfaces, not an individual tree.

For current measurements use [`COPERNICUS/S2_SR_HARMONIZED`](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED). The harmonized collection handles the processing-baseline reflectance shift; it does not remove all atmospheric, seasonal or sensor uncertainty.

The configured current season is **2025-11-01 inclusive to 2026-03-01 exclusive**. A season year names its November start. This completed November–February period reduces monsoon cloud/phenology confounding in Mumbai; it does not eliminate irrigation, weather, deciduous vegetation or interannual variation. The pipeline deliberately does not label a partial 2026–27 season as current data.

Filter candidate scenes to at most 60% cloudy pixels, then link [`Cloud Score+`](https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_CLOUD_SCORE_PLUS_V1_S2_HARMONIZED) by scene index and keep pixels with `cs_cdf >= 0.60`. Missing QA stays masked. Require at least three clear observations per pixel. These are configurable engineering starting points requiring visual QA, not universal scientific cutoffs. Median-composite reflectance, then calculate NDVI and NDWI. Compute areas in EPSG:32643 at 10 m; no `bestEffort` scale changes.

## Threshold calibration

Global `greenThreshold` and `thresholdDecisionId` remain null. Compare 0.20, 0.25, 0.30, 0.35, 0.40 and 0.45 against independently reviewed green, non-green and mixed polygons inside each analysis area. Avoid mixed edges, shadows and water. Andheri uses ten imagery-reviewed polygons and the approved threshold 0.35. Juhu v0.3 uses twelve reviewed polygons and the approved threshold 0.30. Independent field validation remains outstanding, and map labels alone are not ground truth.

The helper exports threshold sensitivity, green percentage, NDVI percentiles, coverage, sample labels/notes, period and processing metadata. Inspect omission in green samples and commission in non-green samples. Record sample dates/sources, exclusions, candidate tradeoffs, the selected threshold, withheld checks and residual uncertainty in `data/calibration/decision.md`. Do not optimize solely to make known neighbourhoods rank as expected.

Run calibration for SR and the separate historical TOA collection. Reference labels must be valid in each historical season; today's vegetation is not evidence of its 2015 state. Where samples changed, use separate dated reference sets and retain them with each exported calibration. A shared threshold is permitted only after that cross-collection/year assessment. Otherwise define a new separately reviewed protocol/decision and regenerate the affected complete series. Calibration results do not themselves become production measurements.

## Land, water and missing observations

The Powai geometry retains its lake hole. NDWI = `(B3 − B8) / (B3 + B8)`; values above the configured water threshold (initially 0) are excluded as a backstop. Water/shadow/roof confusion must be inspected. Do not quietly trim green pixels or revise a boundary to improve an expected ranking.

Current analysis land is non-water area with sufficient valid observations. Historical analysis uses the **intersection of valid observation masks** and excludes the **union of detected water** across all selected years. This fixed spatial denominator avoids attributing a changing analysis footprint to vegetation change, but measures change only on this common observed land. It can exclude real land conversion to/from water; report that limitation.

Coverage = analysed land / potential non-water polygon area. Pixels lacking usable imagery remain in the potential denominator, reducing coverage. Minimum 90% coverage is an initial acceptance floor, not proof of unbiased sampling. Exported percentage `-1` or quality status `insufficient-coverage` means unusable output, never zero vegetation; imports reject it. Green area zero on genuinely observed land is valid.

`polygonAreaSqKm` describes the geometry excluding holes. `analysisAreaSqKm` is the actual raster denominator; `greenAreaSqKm / analysisAreaSqKm * 100` gives the estimate. Small raster/geodesic differences are expected. The app's pending footprint is a spherical area calculation, rounded to two decimals; it is not a completed satellite result.

## History and rankings

SR archive availability begins in March 2017. The historical pipeline therefore uses [`COPERNICUS/S2_HARMONIZED` TOA](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_HARMONIZED) for **all** its seasons: 2015–16, 2020–21 and 2025–26 by default. Do not subtract SR current values from the TOA baseline. Sparse early imagery can prevent a defensible 2015 estimate. Leave it unavailable rather than relax filters silently. No interpolation fills missing years.

Change is latest minus baseline in percentage points. Relative change divides that difference by the baseline estimate and is undefined when baseline is zero. Neither converts into trees lost. Historical endpoints must share locality, collection, method, threshold decision, season, boundary, masks and exact denominator area/ID.

Rank only reviewed observations with both release and locality `publishableRanking` set true. The two-locality beta keeps this false: Andheri and Juhu share the Level-1 family and season, but locality-specific thresholds have not passed cross-locality calibration for direct ordering. Both measurements may be viewed side by side without naming a winner. Medium boundary confidence never automatically enables ranking.

## Provenance and release

Earth Engine outputs are calculated observations, not verified claims. A reviewer must inspect source imagery, sample calibration, water masks, coverage and boundaries, then tie review to the raw export SHA256. `verified` means that this project review was recorded; it is not external certification. Import tooling checks consistency, not whether a person actually performed scientific review. Keep exports, calibration decisions and review notes for independent audit. Andheri West Core and Juhu are imported reviewed beta measurements. Powai and all historical measurements remain pending.

## Approved Juhu beta release — 23 September 2026

The project owner approved Juhu v0.3 and NDVI >= 0.30 only for the 1 November 2025 through 28 February 2026 Sentinel-2 Surface Reflectance analysis, Cloud Score+ mask, at least three clear observations, NDWI water exclusion and reviewed v0.3 samples. Calibration version: `juhu-sr-dry2026-v0.3-v1`. The v0.3 boundary preserves the intended coastal residential area while removing the aerodrome, lagoon and adjacent land identified during visual QA. The public result is 48.8%; the exact imported value is retained. Rankings remain withheld.

## Approved Andheri beta release — 13 September 2026

The project owner approved NDVI >= 0.35 only for Andheri West Core v0.2, Sentinel-2 Surface Reflectance, 1 November 2025 through 28 February 2026, the existing Cloud Score+ mask, at least three clear observations, NDWI water exclusion, and the current calibration sample set. Calibration version: andheri-sr-dry2026-v1. Processing version: level1-1.0. Global threshold defaults remain null; release approval is scoped and tied to the boundary and reference-file hashes. This is not an official government measurement or external certification.

The public card rounds the actual GEE export to one decimal place. The calibration comparison range 0.30–0.40 changes the full-locality estimate from about 47.5% to 33.5%, with 40.2% at 0.35. This is scenario sensitivity, not a confidence interval. Ten small purposively selected samples, unknown basemap dates, mixed pixels and shadows limit inference. No field verification is claimed.
