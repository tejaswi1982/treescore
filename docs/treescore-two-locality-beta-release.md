# TreeScore two-locality beta release

Release date: 2026-09-23  
Deployment status: locally publication-ready; external deployment not performed

## Andheri West Core

- Satellite-derived green cover estimate: `40.161364821801435%` (`40.2%` public display)
- Green area: `1.934924661478349 km²`
- Valid observed land: `4.817875762100552 km²`
- Boundary: `mumbai-localities-v0.2`
- Threshold: `NDVI >= 0.35`
- Analysis dates: 2025-11-01 through 2026-02-28
- Calibration: `andheri-sr-dry2026-v1`
- Status: Reviewed beta measurement

## Juhu

- Satellite-derived green cover estimate: `48.813276934442705%` (`48.8%` public display)
- Green area: `0.9087353412322402 km²`
- Valid observed land: `1.861656086832055 km²`
- Boundary: `juhu-v0.3` (medium confidence)
- Threshold: `NDVI >= 0.30`
- Analysis dates: 2025-11-01 through 2026-02-28
- Scenes: 51
- Calibration: `juhu-sr-dry2026-v0.3-v1`
- Status: Reviewed beta measurement

The v0.3 boundary corrected the Juhu v0.2 southern aerodrome, lagoon and adjacent open-ground inclusion before calibration and publication. The rejected v0.2 analysis remains preserved as provenance.

## Powai Lake + Urban Area

- Status: Analysis pending
- No measurement, calibration or publication action was performed for this release.

## Methodology and ranking status

Both reviewed measurements use `level1-1.0`, Sentinel-2 Surface Reflectance, the same November–February window, Cloud Score+ `cs_cdf >= 0.60`, valid B2/B3/B4/B8 masks, at least three clear observations, a median composite, NDVI and NDWI water exclusion at 10 m.

Rankings remain unpublished. Andheri and Juhu use independently reviewed thresholds, and TreeScore has not yet validated direct numerical ordering across locality-specific calibrations. The comparison page may display both measurements without naming a winner.

Known limitations include purposive visual calibration samples rather than field truth, 10 m mixed pixels, substantial threshold sensitivity, medium-confidence TreeScore-defined boundaries and no independent held-out validation. These are not official government measurements or exact tree counts.

## Release checks

- Data validation: pass
- Tests: 24/24 pass
- ESLint: pass with zero warnings
- TypeScript: pass
- Next.js production build: pass; 14 static/SSG outputs including robots and sitemap
- Route smoke tests: all public routes, 19 internal links/assets and expected 404s pass
- Browser QA: desktop and 390 px checks pass with no horizontal overflow or console errors
- Juhu page: 48.8%, Nov 2025 to Feb 2026, Reviewed beta measurement and boundary disclaimer
- Map: Andheri and Juhu measured; Powai pending; current Juhu geometry resolves to v0.3
- Comparison: Andheri and Juhu shown side by side without a winner
- Ranking page: disabled pending cross-locality calibration validation
- PWA: manifest, icons, service worker and explicit offline fallback validated

## Deployment readiness

The current architecture is a Next.js 15 application with file-backed, precomputed reviewed metrics. Vercel is the recommended host because it supports this architecture without changes. A conventional Node 24 host is also supported.

No Earth Engine credentials, server secrets, database or runtime API are required by the public site. `NEXT_PUBLIC_SITE_URL` is the only recommended production setting; set it to the canonical HTTPS origin for sitemap and social metadata. Build with `npm ci && npm run build`. Vercel can serve the build directly; a Node host runs it with `npm start` behind HTTPS. Configure the chosen domain's DNS at the host, then verify deep links, HTTPS geolocation, manifest, service worker, sitemap and social metadata on the final origin.
