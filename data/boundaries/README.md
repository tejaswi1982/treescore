# TreeScore — Mumbai Locality Boundaries

**Boundary version:** `mumbai-localities-v0.1`
**File:** `mumbai-localities-v0.1.geojson`
**CRS:** WGS84 / EPSG:4326 (coordinate order: **longitude, latitude**)
**Localities:** Andheri West, Powai, Juhu

---

## ⚠️ Read this first

These are **TreeScore-defined locality analysis areas — NOT official administrative boundaries.**

They do not correspond to BMC ward limits, electoral boundaries, census tracts, or any legal/official demarcation. They are approximate polygons drawn to give TreeScore a *reasonable, transparent, repeatable* land area for comparing satellite-derived canopy cover between localities.

Any TreeScore surface (app, web, report, press) that uses these boundaries must display, in plain language:

> "Locality boundaries are TreeScore-defined analysis areas, not official administrative boundaries."

TreeScore's credibility rests on this honesty. The boundary file must never be presented as official.

---

## What these boundaries are based on

Each polygon was drawn from geographic knowledge of Mumbai's western suburbs, using visible urban features as approximate edges:

- **Andheri West** — held **west of the Western Railway line** (to avoid pulling in Andheri East), bounded on the west by the Versova-side coast, covering the commonly understood Andheri West core (Lokhandwala, DN Nagar, Seven Bungalows, Yari Road side). North of Juhu.
- **Powai** — wraps the commonly understood Powai urban fabric (Hiranandani area, lake-edge residential, JVLR corridor), touches the **IIT Bombay edge** only, and **excludes the main Powai Lake** via an inner ring (hole). Deliberately excludes Vikhroli and the Sanjay Gandhi National Park influence zone.
- **Juhu** — small, coastal polygon using the **Arabian Sea coastline/beach** as the western edge, kept conservative to avoid spilling into Vile Parle, Santacruz, Andheri West or Versova.

**Confidence:** all three are marked `"boundaryConfidence": "medium"`. The shapes are hand-reasoned approximations in correct coordinate space, not surveyed or map-traced lines.

---

## Known limitations (v0.1)

1. **Vertices are approximate.** They place each locality correctly relative to coastline, railway and lake, but individual edges are smoothed and will not match the true street/coast geometry.
2. **Powai Lake hole is an approximation.** The inner ring is a rough oval, not the lake's true outline. Even with the hole, you should still **mask water during NDVI** (see GEE note) as a backstop.
3. **Coastlines are smoothed arcs.** Andheri West (Versova side) and Juhu's beach edge should be trimmed to the true waterline before any number is published.
4. **No overlap between the three polygons** has been verified programmatically (clean as of v0.1), so land is not double-counted across localities.

---

## Before you run NDVI: visually inspect

Do **not** publish a canopy number from v0.1 without eyeballing the polygons first.

1. Go to <https://geojson.io>
2. Drag `mumbai-localities-v0.1.geojson` onto the map (or paste its contents).
3. Confirm each polygon sits over the right neighbourhood and the Powai hole sits over the lake.
4. Alternatively, load it as a vector layer in **QGIS** over an OpenStreetMap or satellite basemap for a closer look.

A quick-look `preview.png` is included in this folder showing the three polygons with landmark reference points.

---

## How to revise the boundaries

The intended workflow for tightening these:

1. Open `mumbai-localities-v0.1.geojson` in **geojson.io** (or QGIS).
2. Drag vertices to follow the true coast/road/lake edges. For the Powai lake hole, trace the actual waterline.
3. Keep the **`properties` block unchanged** for each feature except:
   - bump `boundaryConfidence` to `"high"` once a polygon is properly traced,
   - update `boundaryVersion` everywhere to the next version (e.g. `mumbai-localities-v0.2`) and rename the file to match.
4. Re-run the validation (valid JSON, valid GeoJSON, lon/lat order, closed rings, no self-intersection, no inter-locality overlap, sane area in sq km).
5. Re-export as GeoJSON (EPSG:4326, longitude-latitude order) and replace the file.

Keep old versions; never overwrite a published version in place.

---

## How these are used in Google Earth Engine

The polygons define the land area over which Sentinel-2 NDVI is summarised to a canopy-cover percentage per locality. Outline:

1. **Upload** `mumbai-localities-v0.1.geojson` to GEE as a **FeatureCollection asset** (Assets tab → New → Shape files / GeoJSON), or paste geometries inline in the Code Editor.
2. Load a **Sentinel-2 SR** collection, filter by date and low cloud cover, and median-composite.
3. Compute **NDVI** = (B8 − B4) / (B8 + B4).
4. **Mask water** (e.g. using an NDWI threshold or the Sentinel-2 scene classification / a water dataset) so lakes, sea and the Powai water body don't count as non-green land. This is the backstop to the Powai inner-ring hole.
5. Apply an **NDVI threshold** (commonly ~0.3–0.4 for "vegetated/canopy"; calibrate against known green vs. built spots in these very localities) to get a green/not-green mask.
6. For each locality feature, compute **canopy % = vegetated land pixels / total land pixels × 100** using `reduceRegions`.
7. Export the per-locality table to compare Andheri West vs. Powai vs. Juhu.

A starter GEE script is provided separately. Treat the first run as a calibration pass, not a publishable result — tune the NDVI threshold and water mask against what you can see on the ground in these three localities first.
