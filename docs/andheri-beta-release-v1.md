# Andheri West Core reviewed beta release

Published to the local production build on 2026-09-13 (Asia/Calcutta), following
explicit project-owner approval of this exact analysis and publication workflow.

## Actual export and import

The final measurement was recalculated in Google Earth Engine using the saved
`andheri-west-core-dry-season-2026-candidates` script with an approved final-export
appendix. The native [FeatureCollection CSV download](https://developers.google.com/earth-engine/apidocs/ee-featurecollection-getdownloadurl)
was downloaded through the browser and copied unchanged into `data/import/`.
An initial download-call signature error was corrected; the final run and download succeeded.
No metric was reconstructed from rounded calibration tables or entered manually.

- Export: `data/import/treescore_andheri_west_core_2025-11_2026-02_v1.csv`
- SHA-256: `c5246939542f7c2f04325e553c1aac0d22c527a24c23b6347f444c0dd8708de7`
- Review: `data/import/andheri-reviewed-beta-v1.json`
- Persisted review: `data/import/reviews/c5246939542f7c2f04325e553c1aac0d22c527a24c23b6347f444c0dd8708de7.json`
- Production file: `data/metrics/current.json`, written only by `import-metrics.ts`.
- Methodology: `level1-1.0` (algorithm unchanged).
- Calibration: `andheri-sr-dry2026-v1` (approved promotion of the draft).
- Boundary: `mumbai-localities-v0.2`, unchanged.
- Final run ID: `andheri-sr-dry2026-v1-final`.
- Reproducible final-only script: `gee/treescore-andheri-final.gee.js`.

| Quantity | Imported value |
| --- | ---: |
| Green cover | 40.161364821801435% |
| Green area | 1.934924661478349 km² |
| Valid observed land | 4.817875762100552 km² |
| Coverage | 100% |
| Candidate Sentinel scene/granule count | 51 |
| NDVI threshold | 0.35 |

Dates: 2025-11-01 through 2026-02-28 inclusive; stored `dateEnd` is exclusive
2026-03-01. Source: `COPERNICUS/S2_SR_HARMONIZED`. Cloud Score+ `cs_cdf >= 0.60`,
scene cloud maximum 60%, minimum 3 clear observations, median composite, NDWI > 0
water exclusion, EPSG:32643 / 10 m. Scene count is not a count of independent
clear observations per pixel; the raw export retains all scene/granule IDs.

The importer performed a dry run, then the actual import. Production status is
`verified`, quality status `reviewed`, review status `human-approved` and
`publishableRanking: false`. Verified means project review, not independent
scientific certification. All calibration evidence and sensitivity remain in
`data/calibration/decision.md`.

## Scope protection

Global `greenThreshold` and `thresholdDecisionId` remain null. The importer
resolves `andheri-approval-v1.json` only when locality, kind, season, dates,
collection, boundary, methodology and decision match. It verifies the calibration
sample and boundary hashes and requires matching masks and provenance aliases.
Regression tests reject reuse for another locality, season, source, methodology,
threshold, sample hash or cloud/water setup. No other area or historical release
was imported.

## Verification

- Data validation passed.
- 20 tests passed. Test workers required normal execution outside the sandbox.
- Lint passed with zero warnings; typecheck passed.
- Production build passed and generated all 12 static pages.
- Existing non-blocking Next.js warning: Next-specific ESLint plugin not detected.
- General smoke test passed: 9 routes, 17 internal links/assets and expected 404s.
- `node scripts/verify-andheri-release.mjs` passed: raw-export/production value
  equality and SHA match, exactly one verified locality, other two pending,
  no single-member rank and no historical publication.

The production Next.js server was restarted on `http://127.0.0.1:3000`.
Browser review confirmed the Andheri page displays:

```text
Satellite-derived green cover estimate
40.2%
Reviewed beta measurement
Observed analysis land: 4.82 km²
Analysis period: Nov 2025 to Feb 2026
TreeScore-defined analysis area, not an official administrative boundary.
```

The provenance disclosure shows collection, method/boundary, threshold/decision,
100% coverage and 51 candidate scenes. Review dates use UTC (2026-09-12), with
the local approval date 2026-09-13 and timezone retained in approval/review files.
Juhu and Powai cards and their locality pages remain Analysis pending. Andheri
historical analysis remains pending. The ranking page says:

> 1 measured locality. Rankings will appear as more comparable areas are published.

Methodology explains the scoped 0.35 calibration, SR source, NDVI proxy, masks,
season, sensitivity, limitations, no exact tree count and no official government
measurement. This build is ready for a public beta deployment with Andheri alone
measured. No external hosting deployment was performed in this workflow.
