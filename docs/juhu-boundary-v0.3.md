# Juhu v0.3 boundary review record

Date: **2026-09-23** (Asia/Calcutta)

## Decision trigger

The first real Juhu v0.2 Sentinel-2 run was stopped before calibration. Visual
review showed that the southern lobe contradicted the written exclusion of
airport land. The v0.2 geometry and diagnostic outputs remain unchanged.

## Review evidence

- v0.2 GeoJSON and coordinate preview
- Google satellite basemap in Earth Engine
- 2025-11-01 to 2026-02-28 Sentinel-2 median RGB
- corresponding NDVI and NDWI water-exclusion layers
- saved Earth Engine scripts `juhu-dry-season-2026-candidates` and
  `juhu-v0-3-boundary-review`

The error combined a lagoon, water-edge transition, aerodrome/airport
operational and open ground, runway-side surface and adjacent non-Juhu fabric.
The western beach edge was also checked. It remains east of visible beach and
surf and did not require expansion.

## Versioned correction

`mumbai-localities-v0.3.geojson` retains unchanged Andheri and Powai v0.2
features and replaces only the current Juhu feature with `juhu-v0.3`. The
revised concave southern edge retains the western coastal residential strip and
excludes the lagoon/aerodrome complex.

| Geometry calculation |                   Area |
| -------------------- | ---------------------: |
| Juhu v0.2            |  2.854182433645312 km² |
| Juhu v0.3            | 1.8982666980470257 km² |
| Removed              | 0.9559157355982861 km² |
| Removed share        |    33.491753166506854% |

Google Earth Engine's ellipsoidal calculation reported 2.8541789606846404 km²,
1.8982683086266041 km² and 0.9573205524465932 km² respectively. The small
difference in the removed-area calculation reflects the independent local
approximation and Earth Engine geometry operations.

The correction was fixed before the v0.3 satellite measurement was run. No
candidate percentage influenced the vertices. Boundary confidence remains
`medium`, and publication still requires calibration plus explicit human
approval of both the boundary and threshold.
