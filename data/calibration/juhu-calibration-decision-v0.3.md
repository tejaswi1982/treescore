# Juhu v0.3 — human-approved calibration decision

```yaml
date: 2026-09-23
localityId: juhu
boundaryVersion: juhu-v0.3
methodologyVersion: level1-1.0
calibrationVersion: juhu-sr-dry2026-v0.3-v1
thresholdApproved: true
approvedThreshold: 0.30
approvalStatus: human-approved
approvalDate: 2026-09-23
recommendedThreshold: 0.30
plausibleRange: 0.30-0.35
```

The corrected boundary was fixed before this measurement. The project owner
approved Juhu v0.3 and NDVI >= 0.30 for this scoped beta analysis on 2026-09-23.
This approval authorizes the reviewed production measurement; it does not
authorize ranking against other locality-specific calibrations.

## Method and run

- `COPERNICUS/S2_SR_HARMONIZED`, 2025-11-01 through 2026-02-28 inclusive.
- 51 scenes after `CLOUDY_PIXEL_PERCENTAGE <= 60`.
- Cloud Score+ `cs_cdf >= 0.60`, valid B2/B3/B4/B8, minimum 3 clear
  observations, median composite.
- NDVI `(B8 - B4) / (B8 + B4)`; composite NDWI > 0 excluded from land.
- EPSG:32643 at 10 m; `level1-1.0` and `ndwi-union-1.0`.
- Polygon 1.8982683086 km²; valid land 1.8616560868 km²; excluded water
  0.0307722498 km²; valid-land coverage 98.0713% of polygon area.

## Reviewed samples

Twelve accepted interior polygons: five clear green, four clear non-green and
three mixed. Every polygon is inside v0.3 and avoids the beach transition,
lagoon edge, corrected aerodrome edge and deep-shadow/building-edge proposals.
The accepted list and notes are in `juhu-reference-areas-v0.3.geojson`.

Five rejected or revised proposals are recorded in
`juhu-rejected-areas-v0.3.json`. The first provisional set was revised because
several coarse boxes crossed surface transitions. The final denominator uses
the same 10 m `pixelArea` grid as the classified area, preventing edge-weighting
percentages above 100%.

## Class means

Equal-weight means of the accepted sample percentages:

|     NDVI | Clear green (n=5) | Clear non-green (n=4) | Mixed (n=3) |
| -------: | ----------------: | --------------------: | ----------: |
|     0.20 |            98.76% |                 5.20% |      71.24% |
|     0.25 |            98.02% |                 2.84% |      50.33% |
| **0.30** |        **93.15%** |             **0.00%** |  **42.28%** |
|     0.35 |            86.31% |                 0.00% |      29.11% |
|     0.40 |            77.39% |                 0.00% |      22.78% |
|     0.45 |            60.84% |                 0.00% |      14.92% |

`juhu-calibration-results-v0.3.csv` contains all 72 GEE-derived
sample/threshold rows with raster sample area, classified green area and percent.

## Recommendation

Recommend **NDVI >= 0.30**, with **0.30–0.35** as the plausible review range.
0.30 is the lowest tested value with zero response across every clear non-green
sample while retaining 93.15% mean response in clear green samples. Raising the
threshold to 0.35 does not improve the observed non-green separation, while it
reduces clear-green retention by 6.84 percentage points and mixed response by
13.17 points. The result independently differs from Andheri's approved 0.35;
the same dataset, season, masks, composite and Level-1 method remain comparable,
but the locality-specific calibration decision must be disclosed in any future
comparison.

## Full-locality candidate sensitivity — unpublished

| Threshold |   Green area km² |    Candidate cover |
| --------: | ---------------: | -----------------: |
|      0.25 |     1.0848209703 |     58.2718246413% |
|  **0.30** | **0.9087353412** | **48.8132769344%** |
|      0.35 |     0.7363043771 |     39.5510418028% |

The nearest-neighbour span is **18.7208 percentage points**. The 0.30-to-0.35
step alone changes the full-locality estimate by **9.2622 points**, so threshold
sensitivity is substantial and must accompany review.

## Limitations and reviewer status

- Samples are purposive visual references, not field truth or probability samples.
- Basemap imagery dates are not guaranteed to match the seasonal composite.
- Mixed areas have no known true vegetation fraction and are descriptive only.
- The coastal and corrected southern edges were excluded from calibration; small
  mixed pixels elsewhere remain possible.
- A later rerun produced one transient RGB tile connection warning. Earlier and
  later RGB/NDVI views and all reductions succeeded; no calculation error remains.
- Boundary confidence remains `medium`; it is a TreeScore-defined analysis area.

**Agent visual review complete; human approval recorded on 2026-09-23.**
