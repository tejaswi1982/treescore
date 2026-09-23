# TreeScore Mumbai locality boundaries — mixed reviewed set v0.3

**Collection file:** `mumbai-localities-v0.3.geojson`  
**CRS:** WGS84 / EPSG:4326, longitude then latitude

This collection introduces one locality-specific revision. It does not promote
unchanged localities to a new boundary version.

| localityId | feature boundary version | status |
| --- | --- | --- |
| `andheri-west-core` | `mumbai-localities-v0.2` | unchanged; approved Andheri release baseline |
| `powai-lake-urban-area` | `mumbai-localities-v0.2` | unchanged; lake hole retained |
| `juhu` | `juhu-v0.3` | reviewed correction; measurement approval pending |

All features remain **TreeScore-defined analysis areas, not official
administrative boundaries**. The measurement label remains **Satellite-derived
green cover estimate**.

## Why Juhu changed

The first real Juhu v0.2 Earth Engine run exposed a conflict that the coordinate
preview could not show. The southern lobe enclosed a large lagoon, aerodrome or
airport operational/open ground, runway-side surfaces and adjacent fabric even
though the v0.2 assumptions explicitly excluded airport land.

Juhu v0.3 preserves the v0.2 northern and main residential edges. Its southern
edge follows the visible northern margin of the lagoon/aerodrome complex and
then continues south along the western coastal residential strip. The lagoon,
airport/open ground and excess beach/sea are outside the revised polygon.

The boundary was chosen before rerunning the green-cover calculation. No score
was used to optimize the geometry. Confidence remains `medium`: the edge was
reviewed against satellite imagery, but it is still a TreeScore analysis choice,
not a surveyed or official boundary.

Historical provenance remains in `mumbai-localities-v0.2.geojson`,
`preview-v0.2.png`, `docs/juhu-first-run.md` and
`data/calibration/juhu-candidate-run-v1.json`.

