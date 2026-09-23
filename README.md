# TreeScore

**Measuring India's urban green cover clearly, honestly, and consistently.** Measure first. Claim later.

TreeScore is a mobile-first civic-data web app for Mumbai. Its public metric is **Satellite-derived green cover estimate**. NDVI captures vegetation, not exact tree canopy or tree counts. Every area is a **TreeScore-defined analysis area, not an official administrative boundary**.

## Current state

The existing Next.js design is preserved. The app consumes Andheri West Core and Powai v0.2 geometry plus the reviewed Juhu v0.3 correction, with search, selection, pin interaction and client-side geolocation checks. Locality pages, comparison, historical states, ranking policy, sharing and PWA support are implemented.

The production store contains two reviewed beta measurements from real Earth Engine exports: **Andheri West Core 40.2%** and **Juhu 48.8%**. Powai Lake + Urban Area remains **Analysis pending**. No historical values are published. Rankings remain disabled because the localities use independently reviewed thresholds (0.35 and 0.30) and direct cross-locality ordering has not yet been validated.

Calibration/current/historical Earth Engine scripts and validated import tooling are locally runnable/generated. Approval records, sample and boundary hashes, raw exports and import reviews preserve release provenance. The public application serves reviewed precomputed metrics and does not need Earth Engine credentials at runtime.

## Install and run

Requirements: **Node.js 24+** and npm. No Python, server credentials, map key or Earth Engine login is needed for the web app. Google fonts are downloaded during the initial build; the map uses OpenStreetMap tiles.

```powershell
cd "C:\Users\tejas\Documents\New project 2\TreeScore"
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). If a preview is already running, use that server rather than starting a second one.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

With the server running, `npm run smoke` checks all public routes, internal links/assets and expected 404s. See [the completion report](docs/completion-report.md) for the final validation results and phase-by-phase status.

`predev` and `prebuild` synchronize the exact boundary copy and validate the production data. `npm run validate:data` can be run independently. Production measurements are bundled at build time: **rebuild and restart after imports**. Service worker navigations are network-only with an explicit offline page; no cached civic measurements are served offline.

## Stack and layout

Next.js 15 App Router · React 19 · TypeScript strict · Tailwind 4 · Leaflet. Static file-backed data; no accounts, backend database, telemetry or third-party civic-data integration.

```text
src/app/                 Home, locality/[id], compare, rankings, history, methodology, about
src/components/          Shared cards, map, timeline, navigation and sharing
src/data/localities.ts   Validated production data access; planned/fixture exclusion
src/lib/                 Geometry, comparability, ranking and historical logic
data/boundaries/         Canonical immutable geometry versions and boundary-review notes
data/localities.json     Data-driven active and planned locality configuration
data/analysis-config.json Dates, collection, masks, quality settings and threshold decision
data/metrics/            Reviewed current two-locality release
data/historical/         Reviewed historical release (empty initially)
data/calibration/        Versioned samples, decisions and human approvals
data/import/             Raw export destination and review template/receipts
scripts/                Synchronization, geometry validation, GEE generation and import
gee/                    Self-contained generated Code Editor scripts
tests/                  Node tests; quarantined legacy illustrative values
public/                 PWA, icons, explicit offline page and synced methodology
docs/                   Audit, methodology, data contract, GEE handoff and Level-2 plan
```

`files/`, `files.zip`, screenshot folders, original previews and the roadmap PDF are preserved historical inputs. They are not production metrics. The current boundary archive has been extracted without geometry changes. There was no Git repository at takeover; initialize version control and make a reviewed initial commit when ready.

## Earth Engine workflow

Follow [the Earth Engine handoff](docs/gee-analysis.md). Each locality is boundary-reviewed, calibrated independently, human-approved, exported from Earth Engine and imported through the hash-bound review workflow.

```powershell
npm run gee:generate
npm run import:metrics -- data/import/current.csv data/import/current.review.json --dry-run
npm run import:metrics -- data/import/current.csv data/import/current.review.json
```

Review records must match the export SHA256 and processing config. CSV/JSON values are validated before an atomic locality replacement within the release. Imports never silently turn fixture or unreviewed rows into public data, and importing one locality preserves other reviewed localities.

See [methodology](docs/methodology.md), [data schema](docs/data-schema.md), [original audit](docs/audit.md) and [Level-2 research preparation](docs/level-2-tree-detection.md).

## Deployment

Deploy the existing Next.js application on a Node-capable host or Vercel. Set the project root to this folder, use Node 24, install with `npm ci`, build with `npm run build`, and start with `npm start` for a Node server. Vercel detects Next.js and serves its generated routes. Set optional `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin so sitemap and social metadata use the production domain; it is not a secret. Use HTTPS for geolocation, clipboard and PWA installation. No application secrets or Earth Engine credentials are required. Do not expose `data/import`, tests, screenshots or the workspace as a static root; only Next.js's public output should be served.

This task does not publish a deployment or configure a domain. Verify the live locality deep links, metadata and source release after deployment. If changing origins, PWA installation belongs to the new origin. For old installations, the replacement service worker deletes only TreeScore-owned legacy caches on activation.

## Known limitations / manual work

- Two current measurements are published locally; Powai and historical analysis remain pending.
- Current SR and historical TOA are separate products; a 2015 baseline may fail coverage and must remain unavailable.
- Pixel quality and boundary/threshold review require scientific judgement beyond automated checks.
- Map tiles require a network connection and follow OpenStreetMap's usage policy; choose an appropriate tile service before large-scale traffic.
- Native location permissions, OS installation and native share-sheet destinations require device-level checks; no location is stored by TreeScore.
- Boundaries and calibration remain project-reviewed rather than official or field-certified. Do not upgrade confidence or ranking eligibility automatically.
- No individual-tree detection, census integration, BMC affiliation, action platform or monetisation features are included.

**Recommended next step:** deploy the reviewed two-locality beta after final owner approval, then begin Powai as a separate analysis workflow.
