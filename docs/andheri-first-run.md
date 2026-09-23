# Andheri West Core — first real satellite test

Generate only this scoped script with:

```powershell
node scripts/generate-gee.mjs --andheri-test
```

Load `gee/treescore-andheri-test.gee.js` into the Earth Engine Code Editor.
It includes only the unchanged v0.2 Andheri West Core polygon, using Sentinel-2
SR Harmonized for **2025-11-01 inclusive through 2026-03-01 exclusive**: the
completed dry season ending in 2026. The `seasonYear` remains 2025 because the
importer labels seasons by their start year. No future November 2026 imagery
is assumed. Production configuration and metric JSON files are untouched.

The script keeps the existing Cloud Score+ cloud mask, median composite,
minimum clear-observation requirement and NDWI water exclusion. It adds true
RGB (B4/B3/B2), clipped NDVI and six individually toggled candidate masks
(0.20–0.45). Console output includes candidate-scene count/IDs, sufficiently
observed area before water exclusion, valid land area, and candidate green
area/percentage/coverage. Scene count is the date/bounds/scene-cloud-filtered
count, not the number of clear observations at every pixel.

Both final threshold and decision ID remain null. Whole-area sensitivity is
exploration, not a substitute for field-reviewed calibration samples. Candidate
exports use the existing column schema but `kind: calibration`, so the
production importer rejects them intentionally. The guarded one-row current
export uses the normal importer schema, and becomes available only after an
explicit threshold/decision is supplied. Do not enable or import it without
the user's approval and the required scientific review.

Inspection order: RGB, NDVI, then one candidate layer at a time. Check shadows,
rooftops, known green spaces, clouds and excluded water; compare masks with RGB
at the same zoom. A candidate percentage is not a published TreeScore metric.

Authentication rule: stop at email, password, 2FA, account choice, consent,
permissions or project authorization; the user completes those steps.

## Execution record

Successfully executed in the Earth Engine Code Editor on 2026-09-12.
The existing authenticated session and selected project were already available;
no credentials, consent or project authorization were entered by the agent.

Saved Earth Engine script:
`users/tejaswi1982/treescore:andheri-west-core-dry-season-2026-candidates`.
The exact compact source pasted into that editor is archived at
`gee/treescore-andheri-browser-run.gee.js`. It specializes the generated pipeline
to this single season and polygon, omitting unused historical and reference-sample
branches. Its trimmed source length and rolling fingerprint were checked against
the pasted source (7858 characters; -1109420858). Its geometry exactly matches
the repository's Andheri West Core v0.2 geometry. The run ID is
`andheri-test_69a76c3f63db`, inherited from the generated parent script; it is not
a content hash of this compact adapter.

- Collection: `COPERNICUS/S2_SR_HARMONIZED`.
- Window: 2025-11-01 inclusive to 2026-03-01 exclusive.
- Scenes passing date, bounds and scene-cloud filters: **51**.
- Scene cloudiness: `CLOUDY_PIXEL_PERCENTAGE <= 60`.
- Pixel mask: Cloud Score+ `cs_cdf >= 0.60` plus valid B2/B3/B4/B8 masks.
  Unmatched Cloud Score+ pixels remain masked. Median composite of clear samples.
- Minimum clear observations per analyzed pixel: 3.
- Area meeting observation requirement before water exclusion:
  **4.839178735895018 km²**.
- Valid observed land after excluding composite NDWI > 0:
  **4.817875762100552 km²**.
- Computed coverage of potential land: **100%**, for every candidate.
- Reduction grid: 10 m, EPSG:32643.

Console results (all `qualityStatus: review-required`):

| NDVI threshold | Candidate green area, km² | Candidate green cover, % |
| --- | ---: | ---: |
| 0.20 | 3.11881312198651 | 64.73419564946886 |
| 0.25 | 2.6785850678012615 | 55.59680656093592 |
| 0.30 | 2.289655563182546 | 47.524171984548566 |
| 0.35 | 1.934924661478349 | 40.161364821801435 |
| 0.40 | 1.6143224355327535 | 33.50693366216905 |
| 0.45 | 1.3133721111911547 | 27.260398068432877 |

Visual inspection at zoom 14: RGB rendered a coherent urban mosaic with roads,
buildings and green patches; no obvious cloud obstruction or blank composite
was visible. NDVI was spatially plausible at this overview scale, with higher
values broadly following visible green patches. Each of the six candidate masks
was enabled individually over RGB and inspected. Lower thresholds covered much
more of the urban mosaic; increasing the threshold progressively removed weaker
responses while retaining concentrated green patches. This is an overview
plausibility check, not ground-truth validation. Mixed pixels, rooftops, shadows
and the simple NDWI water exclusion still need sample-based review.

No Earth Engine console or layer errors were observed. Candidate area results
are highly threshold-sensitive (27.26–64.73%). The existing calibration reference
file has no reviewed samples, so no final threshold is justified by this run.
The 51-scene count is not a per-pixel clear-observation count.

The candidate CSV export task was defined but not started. No Drive export,
production import or publication was performed. Final threshold/decision remain
null, and both production current and historical metric arrays remain empty.
The browser was left on the saved script with RGB visible and candidate layers
available under Layers. Local generated/browser scripts passed syntax checks;
lint and TypeScript checks passed.

## Calibration follow-up, 2026-09-13

The saved Earth Engine script now also contains ten visually reviewed sample
footprints, paired seasonal RGB/NDVI thumbnails, and 60 calculated sample-threshold
rows. See `data/calibration/decision.md` for the provisional 0.35 recommendation,
0.30–0.40 comparison range, rejected footprints and limitations. Human approval
remains pending; no production threshold, import, publication or app metric changed.
