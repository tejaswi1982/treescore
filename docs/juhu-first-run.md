# Juhu first real-data run — boundary review required

> Historical diagnostic only. The project owner rejected this v0.2 scope for
> publication. Juhu v0.3 corrects the boundary and the candidate calculation was
> rerun from scratch; see `docs/juhu-boundary-v0.3.md` and
> `docs/juhu-v0.3-calibration.md`. The values below must not be reused.

Date: **2026-09-23** (Asia/Calcutta)

This is a non-production candidate run. No threshold has been recommended or
approved, no calibration samples have been finalized, and no metric has been
imported.

## Reproducible setup

- Earth Engine script: `juhu-dry-season-2026-candidates`
- Local generated source: `gee/treescore-juhu-browser-run.gee.js`
- Boundary: `mumbai-localities-v0.2`, unchanged
- Window: 2025-11-01 through 2026-02-28 inclusive
- Collection: `COPERNICUS/S2_SR_HARMONIZED`
- Scene filter: `CLOUDY_PIXEL_PERCENTAGE <= 60`
- Pixel mask: Cloud Score+ `cs_cdf >= 0.60` plus valid B2/B3/B4/B8 masks
- Observation rule: at least 3 clear observations
- Composite: median
- Water backstop: NDWI > 0 excluded
- Projection/scale: EPSG:32643 at 10 m
- Method family: `level1-1.0`

## Successful calculation

Earth Engine returned 51 candidate Sentinel scene/granules. The v0.2 polygon
area was 2.8541789606846404 km². Area with at least three observations before
water exclusion was 2.8454243576132083 km². The NDWI backstop excluded
0.14064322499709786 km², leaving 2.704781132616112 km² of valid observed land.
The candidate output reported 100% coverage against its potential-land
denominator.

| NDVI threshold |   Green area (km²) |     Candidate cover |
| -------------: | -----------------: | ------------------: |
|           0.20 | 1.8957180646605554 |  70.08766963805991% |
|           0.25 | 1.6342908382516308 |  60.42229511823442% |
|           0.30 | 1.4093004362725357 |  52.10404713631803% |
|           0.35 | 1.1899978235503554 |  43.99608564258833% |
|           0.40 | 0.9696118320687686 | 35.848069937213104% |
|           0.45 | 0.7482204175100887 | 27.662882164014384% |

The seasonal RGB is spatially coherent and showed no obvious residual cloud
blanket. The NDVI response is spatially coherent: tree-lined residential blocks
and the large southern green/open surfaces respond strongly, while roofs and
roads are mostly low. The first RGB tile request produced a transient Earth
Engine connection error; a rerun loaded the RGB and NDVI successfully.

## Boundary concern

Visual review against both the seasonal RGB and the detailed satellite basemap
shows that the polygon's southern lobe includes a large aerodrome/open-ground
and lagoon footprint, with part of the airport surface inside the boundary.
This is visible from the physical runway/open-ground pattern and is not inferred
only from a map label. It conflicts with
`data/boundaries/boundary-assumptions-v0.2.md`, which says Juhu excludes airport
land.

The footprint is large relative to this 2.85 km² analysis area and contains
vegetated, bare, paved and water-adjacent surfaces. It can therefore materially
change the valid-land denominator, calibration sample balance and candidate
green-cover result. The 0.14064 km² NDWI exclusion removes detected water but
does not resolve inclusion of the surrounding aerodrome/open land.

The source geometry has **not** been edited. Calibration stopped before drawing
reference polygons. The project owner must decide whether v0.2 intentionally
includes this southern footprint despite the written assumption, or whether a
new versioned boundary review is required. Silently trimming v0.2 would violate
the project's boundary version rules.
