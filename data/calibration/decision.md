# Andheri West Core — human-approved scoped beta release

```yaml
thresholdApproved: true
approvedThreshold: 0.35
approvalStatus: human-approved
approvalDate: 2026-09-13
approvalTimezone: Asia/Calcutta
methodologyVersion: level1-1.0
calibrationVersion: andheri-sr-dry2026-v1
```

The project owner explicitly approved the threshold and Andheri-only beta
publication workflow in this task. Approval covers **Andheri West Core v0.2,
COPERNICUS/S2_SR_HARMONIZED, 2025-11-01 through 2026-02-28 inclusive**, and only
the existing Cloud Score+ settings, minimum 3 clear observations, water exclusion
and current calibration sample set. The exclusive stored end is 2026-03-01.

Machine-readable approval and exact boundary/sample hashes are in
`andheri-approval-v1.json`. `andheri-sr-dry2026-v1` promotes the draft calibration
to an approved version; processing algorithm version `level1-1.0` is unchanged.
The global threshold remains null: the importer resolves this scoped approval
only for the matching locality, dates, collection, methodology and sample hash.
Other localities, seasons, historical analyses and rankings are not approved.

The final native GEE CSV was subsequently downloaded, hash-reviewed and imported
through the validated importer. See `docs/andheri-beta-release-v1.md` for its exact
filename, provenance, imported values and publication checks. The public value
is rounded to one decimal place; sensitivity notes below remain applicable.

All evidence and sensitivity notes below remain preserved. Statements of pending
approval in the original draft describe its pre-approval status, not the current
release. Approval does not convert visual labels into field verification or
remove the documented uncertainty.

## Preserved pre-approval calibration record

Date: **2026-09-13**. Draft identifier: `andheri-sr-dry2026-calibration-v1-draft`.
Reviewer: Codex visual imagery review; **no human approval or field verification**.
Recommended threshold: **NDVI >= 0.35**.
Plausible comparison range: **0.30–0.40**, a sensitivity range, not a confidence interval.
Production `greenThreshold` and `thresholdDecisionId` remain null. This document
does not authorize an import, publication, ranking or change from Analysis pending.

## Scope and method

- Locality: `andheri-west-core`, unchanged TreeScore v0.2 polygon,
  `mumbai-localities-v0.2`. Not an official administrative boundary.
- Dataset: `COPERNICUS/S2_SR_HARMONIZED`.
- Window: **2025-11-01 inclusive to 2026-03-01 exclusive** (dry season ending in 2026).
- 51 scenes after bounds/date and `CLOUDY_PIXEL_PERCENTAGE <= 60` filtering.
- Cloud Score+ `GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED`, linked `cs_cdf >= 0.60`,
  plus valid B2/B3/B4/B8 masks; missing QA is masked. Median of clear observations.
- Minimum 3 valid observations; composite NDWI > 0 excluded as water.
- Reduction: 10 m, EPSG:32643; method `level1-1.0`, water mask `ndwi-union-1.0`.
- Candidates: **0.20, 0.25, 0.30, 0.35, 0.40, 0.45**.
- Saved GEE script: `users/tejaswi1982/treescore:andheri-west-core-dry-season-2026-candidates`.
  It now includes sample selection, paired seasonal RGB/NDVI thumbnails and calibration calculations.

## Sample selection and visual review

Ten small reference polygons were selected purposively from visible satellite
surface texture, then inspected with the actual seasonal RGB and NDVI at the
same footprint. Map labels were not accepted as surface evidence. The satellite
basemap acquisition date is unknown, so it supports interpretation rather than
providing contemporaneous ground truth. Footprints were fixed before inspecting
per-sample numerical threshold results. No sample was subsequently removed to
improve the threshold table.

All accepted samples were displayed with outlined boundaries in detailed satellite
imagery and paired seasonal RGB/NDVI. They had no obvious cloud obstruction,
water pixels, large obscuring shadow or unintended boundary contamination at the
review scale. Mixed samples intentionally contain both built and vegetated surfaces.
Local containment checks and Earth Engine `contains` returned true for every sample.
All had valid analyzed area equal to their raster sample area (100% coverage).

`reference-areas.geojson` contains sampleId, sampleName, sampleClass, expectedType,
notes, reviewStatus, reviewer/date, evidence source and geometry. Review status is
`agent-visual-accepted-human-pending`, not human-reviewed or approved.

| ID | Intended surface | Expected type | Approximate dimensions | Raster area m² |
| --- | --- | --- | --- | ---: |
| G1 | Green sports-ground interior, away from track | green | 40 × 40 m | 1582.77 |
| G2 | Tree-heavy compound interior | green | 40 × 40 m | 1583.54 |
| G3 | Dense western woody vegetation | green | 60 × 60 m | 3573.12 |
| N1 | Large light roof interior | non-green | 60 × 60 m | 3572.37 |
| N2 | Contiguous roof-block interior | non-green | 60 × 60 m | 3573.96 |
| N3 | Clear transport-surface strip | non-green | 60 × 20 m | 1196.67 |
| N4 | Dense low-rise roofs and alleys | non-green | 60 × 60 m | 3573.12 |
| M1 | Residential roof and roadside canopy | mixed | 60 × 60 m | 3596.65 |
| M2 | Small buildings, lanes and scattered trees | mixed | 60 × 60 m | 3574.74 |
| M3 | Tree-lined low-rise compound | mixed | 60 × 60 m | 3574.31 |

Eight initial footprints were rejected or revised before calculation, archived
in `rejected-areas.geojson` and `andheri-review-manifest.json`:

| ID | Rejection reason |
| --- | --- |
| R1 | Dry, partly bare field: ambiguous as clearly green. |
| R2 | Compound canopy box reached a building edge; replaced by smaller interior G2. |
| R3 | Scrub/bare-ground transition; replaced by interior dense vegetation G3. |
| R4 | Green-ground box reached running track; replaced by smaller interior G1. |
| R5 | Transport forecourt included substantial building shadow. |
| R6 | Proposed mixed garden was dominated by high-rise buildings/shadow. |
| R7 | Proposed mixed fabric was actually a pond/water edge. |
| R8 | Transport strip too close to roadside canopy; shifted south. |

Rejected proposals were removed at the stage where the problem became visible;
they were not retained in numerical calibration or treated as negative samples.
No cloudy accepted sample was observed.

## Actual calibration results

Values below are percentage of raster sample area classified green. Area is
computed with `pixelArea` on the stated grid, including fractional boundary
weights; it is not a simple geometric area or an independent pixel count.
All samples had 100% valid area, so valid-land and total-sample denominators agree.

| Sample | 0.20 | 0.25 | 0.30 | 0.35 | 0.40 | 0.45 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| G1 | 100.00 | 100.00 | 100.00 | 100.00 | 99.98 | 99.98 |
| G2 | 100.00 | 100.00 | 100.00 | 100.00 | 100.00 | 100.00 |
| G3 | 100.00 | 100.00 | 100.00 | 100.00 | 100.00 | 100.00 |
| N1 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| N2 | 8.52 | 3.35 | 2.80 | 0.00 | 0.00 | 0.00 |
| N3 | 15.62 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| N4 | 29.07 | 9.14 | 0.00 | 0.00 | 0.00 | 0.00 |
| M1 | 68.65 | 63.09 | 61.98 | 45.30 | 38.68 | 32.66 |
| M2 | 73.31 | 57.98 | 32.58 | 20.66 | 16.83 | 4.96 |
| M3 | 73.78 | 57.36 | 48.97 | 43.94 | 35.60 | 27.21 |

Class summaries use an **equal-weight mean of sample percentages**, not pooled
area. The JSON summary also contains min/max and the area-weighted alternative.
These summaries are descriptive calibration evidence, not population accuracy estimates.

| Threshold | Clearly green, n=3 | Clearly non-green, n=4 | Mixed, n=3 |
| --- | ---: | ---: | ---: |
| 0.20 | 100.00% | 13.30% | 71.91% |
| 0.25 | 100.00% | 3.12% | 59.48% |
| 0.30 | 100.00% | 0.70% | 47.84% |
| 0.35 | 100.00% | 0.00% | 36.63% |
| 0.40 | 99.99% | 0.00% | 30.37% |
| 0.45 | 99.99% | 0.00% | 21.61% |

`andheri-calibration-results.csv` has all **60** sample/threshold rows, including
sampleId, sampleClass, threshold, sampleArea, validArea, classifiedGreenArea and
classifiedGreenPercent. `andheri-observed-results.json` archives the actual
server-returned area, percentage and NDVI p10/p50/p90 values. Numeric transcription
was checked against the rendered Earth Engine console: canonical row serialization
length 2514, rolling fingerprint 1441806049. All area/percentage pairs are finite,
consistent and monotonically non-increasing with threshold.

## Recommendation and reasoning

Recommend **0.35 provisionally**, with **0.30–0.40** for comparison.
The reasoning is explicit rather than a black-box optimization:

1. At 0.20, clearly non-green surfaces are over-classified: N4 reaches 29.07%,
   N3 15.62%, and N2 8.52%. At 0.25, N4 still reaches 9.14%.
2. At 0.30, all clear vegetation is retained and non-green mean response is only
   0.70%, but the roof-block sample still has 2.80% (about 100 m²) classified green.
3. **0.35 is the lowest tested threshold with zero response in all four
   visually non-green samples while retaining all three clearly green samples.**
   This is the most useful separation point in this limited set.
4. 0.40 and 0.45 also separate the clear classes. The samples do not establish a
   uniquely optimal threshold or demonstrate substantial genuine-vegetation
   omission at those higher values: G1 loses only about 0.025%, and G2/G3 lose none.
   However, higher thresholds markedly reduce mixed urban response without a
   further observed improvement in the clear non-green samples. Mixed pixels are
   not labelled with a known vegetation fraction, so those losses cannot all be
   called either correct rejection or missed vegetation.

0.30 is a plausible lower comparison because the remaining clear-surface response
is small; 0.40 is a plausible conservative comparison. There is no evidential
basis here to call the range a statistical confidence interval. The recommendation
applies only to this Sentinel-2 SR median method, season, masks and Mumbai urban
setting. It is not a universal scientific NDVI threshold and does not calibrate TOA,
other seasons, other localities or tree counts.

## Full-locality sensitivity — UNPUBLISHED

Unchanged v0.2 polygon and observed-land denominator **4.817875762100552 km²**.
These are the first-run candidate outputs for the same collection/window/masks.

| Threshold | Full-locality candidate green cover | Change from 0.35 |
| --- | ---: | ---: |
| 0.30 | 47.5241719845% | +7.3628 percentage points |
| **0.35** | **40.1613648218%** | reference |
| 0.40 | 33.5069336622% | −6.6544 percentage points |

At 0.35 the candidate green area is **1.934924661478349 km²**.
Changing threshold by only ±0.05 creates a **14.0172 percentage-point** span across
the neighbouring results. This is substantial sensitivity; reporting a precise
single public number without context would conceal it. The scenario range is
not a measurement error bound or confidence interval.

## Limitations, suspicious observations and approval status

- Purposive, small, easy-to-interpret sample set; no independent held-out labels,
  field checks, human agreement study or representative probability sampling.
- Higher-resolution basemap imagery has unknown acquisition dates. Temporal
  mismatch, seasonal phenology and surface changes may affect interpretations.
- G3 is clearly woody vegetation visually, but species, canopy structure and
  possible wetland-vegetation type are not established. No visible water occurs
  in its accepted footprint; the simple NDWI exclusion is not a hydrological survey.
- The N3 strip is only about two native pixels wide. Boundary alignment and
  neighbouring canopy influence remain possible despite the inward shift.
- N2 and N4 show positive low-threshold response despite apparently built
  surfaces. Reflectance mixing, alignment or inconspicuous vegetation may contribute;
  human review of these two labels is especially valuable.
- Compound use/ownership and garden status are not verified; labels describe
  visible texture. Grass is included as vegetation, not as trees.
- Mixed urban samples are highly sensitive; M2 ranges from 73.31% to 4.96%.
  No defensible true mixed-sample vegetation fractions were assigned.
- Cloud/visible-shadow rejection and 100% computed coverage do not establish
  classification accuracy. Shadows and mixed pixels elsewhere in the locality
  remain a source of uncertainty; the accepted references do not validate them.
- No Earth Engine calculation errors were observed. No export task was started.

**Ready for human review of the provisional threshold and sample labels: yes.**
**Approved threshold or independently validated public metric: no.**
The human should review the saved sample selector and paired thumbnails, especially
N2, N3, N4 and G3, and acknowledge full-locality sensitivity before approving 0.35.
Even threshold approval alone does not authorize production import/publication.

No Juhu, Powai or historical analysis was executed. The current and historical
production metric arrays remain empty and the application remains Analysis pending.

## Juhu status

Juhu is now calibrated on the separately reviewed `juhu-v0.3` boundary, but its
boundary and threshold remain **human-pending and unpublished**. The complete
evidence is in `juhu-calibration-decision-v0.3.md`; this Andheri approval does
not authorize Juhu.

## Artifacts and reproducibility

- Reviewed footprints: `data/calibration/reference-areas.geojson`.
- Review and rejection metadata: `andheri-review-manifest.json`, `rejected-areas.geojson`.
- Actual numeric evidence: `andheri-observed-results.json`.
- Expanded 60-row table: `andheri-calibration-results.csv`.
- Group summaries and per-sample NDVI distributions: `andheri-calibration-summary.json`.
- Reproducible local script: `gee/treescore-andheri-calibration.gee.js`.
  It factors out repeated geometry code and uses expanded sample display names;
  calculations, sample IDs and footprints match the browser run. It is not a
  byte-for-byte copy of the browser editor's compact review appendix.
- Rebuild polygons: `node scripts/build-andheri-reference-areas.mjs`.
- Rebuild scoped GEE script: `node scripts/generate-andheri-calibration.mjs`.
- Rebuild/validate local result summaries: `node scripts/summarize-andheri-calibration.mjs`.
- Syntax check, lint and TypeScript checks passed. All 10 containment flags were
  true in GEE, and 60 area/percentage pairs passed local consistency checks.

SHA-256:

```text
reference-areas.geojson
d11cb05911896c732b6448e05831aecae91e12ff3559b1445c5d342710789a27
andheri-observed-results.json
f7ff43838f5a6b14cd3bc3e8c0a9be08ea6ba0be79e28cc894bc8ef0a9c055a2
treescore-andheri-calibration.gee.js
010dbfe26e3763fcb2e4527d662356902b39bbf8a7cab985314f205e661920eb
```
