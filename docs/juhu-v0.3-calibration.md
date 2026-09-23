# Juhu v0.3 real-data calibration report

The Juhu v0.2 result is retained only as a diagnostic. After the scope conflict
was found, TreeScore created `juhu-v0.3`, removed 0.9559 km² of unintended
lagoon/aerodrome/open land, validated the geometry, and reran the satellite
measurement before selecting calibration samples.

The saved Earth Engine scripts are `juhu-v0-3-boundary-review`,
`juhu-v0-3-dry-season-2026-candidates` and `juhu-v0-3-calibration`.
The v0.3 run used 51 scenes, produced 1.8616560868 km² valid land and 98.0713%
polygon coverage, and generated the following unpublished sensitivity series:

| Threshold | Candidate cover |
| --------: | --------------: |
|      0.20 |        68.3704% |
|      0.25 |        58.2718% |
|      0.30 |        48.8133% |
|      0.35 |        39.5510% |
|      0.40 |        31.0482% |
|      0.45 |        23.1235% |

RGB was spatially coherent, NDVI tracked visible canopy and landscaped patches,
and detected lagoon/coastal water was excluded. No sea or aerodrome footprint
materially remains in the denominator. The recommended threshold is 0.30, with
0.30–0.35 retained for human comparison. Full evidence and limitations are in
`data/calibration/juhu-calibration-decision-v0.3.md`.

No final export, production import or publication has occurred. Juhu remains
Analysis pending; Andheri is unchanged and Powai work has not started.
