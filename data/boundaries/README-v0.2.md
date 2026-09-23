# TreeScore — Mumbai Locality Boundaries (v0.2)

**Boundary version:** `mumbai-localities-v0.2`
**File:** `mumbai-localities-v0.2.geojson`
**CRS:** WGS84 / EPSG:4326 (coordinate order: **longitude, latitude**)
**Analysis areas:** Andheri West Core · Powai Lake + Urban Area · Juhu

---

## ⚠️ Read this first

These are **TreeScore-defined locality analysis areas — NOT official administrative boundaries.**

They do not correspond to BMC ward limits, electoral boundaries, census tracts, or any legal demarcation. They are approximate polygons drawn to give TreeScore a *reasonable, transparent, repeatable* land area for comparing satellite-derived green cover between localities.

**App label to use everywhere boundaries appear:**

> "Locality boundaries are TreeScore-defined analysis areas, not official administrative boundaries."

**Data label to use everywhere a number appears:**

> "Satellite-derived green cover estimate."

TreeScore's credibility comes from restraint and transparency. These files must never be presented as official, and the numbers must never be described as exact tree canopy.

---

## What TreeScore v0.2 actually measures

TreeScore v0.2 is **not** measuring exact tree canopy area or tree counts. It produces a **satellite-derived green-cover estimate** (an NDVI-based canopy proxy).

NDVI responds to *all* vegetation, so a green-cover estimate can include:

- trees
- shrubs
- lawns and gardens
- mangroves
- grass
- mixed-vegetation pixels

> **TreeScore v0.2 boundaries are used for satellite-derived green-cover estimates. These estimates should not be described as exact tree-canopy area or exact tree counts.**

Individual-tree detection (the eventual Level 2 layer) is a separate, later step.

---

## Localities in v0.2

| localityId | name | parentLocality | approx area |
|---|---|---|---|
| `andheri-west-core` | Andheri West Core | Andheri West | 4.81 sq km |
| `powai-lake-urban-area` | Powai Lake + Urban Area | Powai | 3.57 sq km (land, lake excluded) |
| `juhu` | Juhu | Juhu | 2.83 sq km |

---

## Why the names changed from v0.1

### Andheri West → **Andheri West Core**
Visual inspection of the v0.1 polygon showed it sat over the western Andheri core (Seven Bungalows, Four Bungalows, DN Nagar, Azad Nagar, station-side west-of-railway) but did **not** cover the wider Lokhandwala / Oshiwara-side footprint that people also call "Andheri West." Rather than quietly imply it represents all of Andheri West, v0.2 renames it **Andheri West Core** and tightens it to that western core. A future, clearly-separate "Andheri West Extended" polygon can cover Lokhandwala/Oshiwara if needed.

### Powai → **Powai Lake + Urban Area**
The v0.1 Powai polygon returned a high green-cover value partly because it reached into surrounding institutional and forest-edge green that isn't really the Powai *neighbourhood*. v0.2 tightens the polygon toward the Powai urban / lake-edge fabric (Hiranandani area, lake-edge residential, JVLR-side urban), pulls back from the IIT-Bombay interior, and **excludes Vikhroli, Sanjay Gandhi National Park, and the Aarey influence zone**. The name now honestly states what's inside: the lake plus the urban area around it. The main lake water body is cut out as an inner ring; genuine neighbourhood green inside the polygon is deliberately retained (TreeScore measures real green inside the area — it doesn't cherry-pick green out).

### Juhu → **Juhu** (unchanged name)
Juhu was already conservative and well-placed. v0.2 keeps it conservative and only tightens the beach edge slightly eastward so less dry sand / sea sits inside the land denominator. No rename needed.

---

## Using these boundaries in Google Earth Engine

1. **Upload** `mumbai-localities-v0.2.geojson` to GEE as a **FeatureCollection asset** (Assets → New → GeoJSON / Shapefiles), or paste geometries inline in the Code Editor.
2. Load **Sentinel-2 SR**, filter by a dry-season date range and low cloud cover, and median-composite.
3. Compute **NDVI** = (B8 − B4) / (B8 + B4).
4. **Mask water** (NDWI threshold or a water dataset / scene classification) so the sea, beach surf, and the Powai lake body are excluded from the land denominator. This is the **backstop to the Powai inner-ring hole** — keep both.
5. Apply an **NDVI threshold** (start ~0.30–0.40) to get a green / not-green mask. Calibrate the threshold against spots you know on the ground inside these three areas.
6. For each feature, compute **green cover % = vegetated land pixels / total land pixels × 100** with `reduceRegions`.
7. Export the per-locality table and compare Andheri West Core vs. Powai Lake + Urban Area vs. Juhu.

Treat the first run as **calibration**, not a publishable result.

---

## Before publishing any number: visually inspect

1. Go to <https://geojson.io>, drag `mumbai-localities-v0.2.geojson` onto the map.
2. Confirm each polygon sits over the right neighbourhood and the Powai hole sits over the lake.
3. Or load it as a vector layer in **QGIS** over a satellite basemap.
4. `preview-v0.2.png` in this folder shows the three areas with landmark reference points.

---

## Limitations (v0.2)

- **Approximate vertices** — placed correctly relative to coast, railway and lake, but edges are smoothed, not surveyed or traced.
- **Coastline simplification** — Juhu's beach edge and Andheri's western edge are simplified arcs; trim to the true waterline before quoting coastal-area numbers.
- **Powai lake hole is approximate** — the inner ring is a rough shape, not the lake's exact outline; water masking in GEE is still required.
- **Locality boundaries are subjective** — where one neighbourhood "ends" is a judgement call, so cross-locality comparisons partly reflect where the lines were drawn. This is why the "TreeScore-defined, not official" label is methodologically true, not just legal cover.
- **NDVI green-cover estimate is not exact tree canopy** — it captures all vegetation, not only trees.
- **Water masking still required** in GEE.
- **Threshold calibration still required** before any published figure.

---

## Revision rules

- **Never overwrite a published boundary version.** v0.1 and v0.2 both stay in the repo.
- Save future revisions as `mumbai-localities-v0.3`, `v0.4`, etc. — new file name, `boundaryVersion` updated in every feature.
- Bump a polygon's `boundaryConfidence` from `medium` to `high` only once it has been properly traced against a basemap.
- Keep all old boundary files and their READMEs for auditability.
