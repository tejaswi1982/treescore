# TreeScore audit — 11 September 2026

Completed before code changes. No Git directory was present, so there is no commit history or baseline diff to report.

| Area | Original state |
|---|---|
| Architecture | Next.js 15, React 19, TypeScript strict, Tailwind 4, npm; no backend or Python requirements |
| Pages | Home, dynamic locality, comparison, rankings, history, methodology, about and 404 |
| Design | Warm paper/cream, forest/moss, serif typography, restrained cards; preserved |
| Data | 12 synthetic localities in `src/data/demoCanopyData.ts`; fictional ranking denominator of 20, hard-coded percentages, ranks, ward labels and declining histories |
| Boundaries | v0.1 in `files/`; current v0.2 and its notes/preview inside `files.zip`; neither consumed by the app |
| GEE | v0.1 external starter, SR median with scene cloud filter, no per-pixel cloud mask, fixed 0.35 threshold and NDWI water filter |
| Calibration/import | Documentation only; example JSON falsely tagged demo observations as `gee-export`; no importer |
| Map | Hand-drawn schematic SVG with invented relative positions; no map library |
| History | Synthetic 2016–2026 series; docs incorrectly implied the SR collection supported early observations |
| PWA | Manifest and four valid icons; service worker cached all same-origin GET responses, including pages |
| Tests/build | No test suite; obsolete `next lint`; existing `.next` development cache (~106 MB), not evidence of a production build |
| Secrets | No environment files or obvious private-key/API-token patterns found in authored text; no Git history available to inspect |
| Assets | 22 Lovable screenshots, three GEE screenshots, duplicate boundary previews, four PWA icons, 11-page roadmap PDF, boundary ZIP |
| Duplicates | `files/mumbai-localities-v0.1.json` / `.geojson`, root/file previews; retained as historical inputs |

The roadmap PDF is contextual planning material, not a machine-readable measurement release. GEE screenshots likewise do not establish calibrated, reproducible v0.2 metrics. No measurements were transcribed from images into production.

## Gaps and implementation plan recorded before editing

Phase 1 needed: production-safe data status/provenance, canonical boundaries, geometry checks, calibration helpers, GEE current and historical pipelines, validated importer, map interaction, pending/history/comparison states, PWA cache correction, tests and run documentation.

Phase 2 needed: configuration-driven expansion, explicit boundary/ranking eligibility, compatible ranking groups, shareable locality URLs, copy/share controls and Level-2 research guidance. No future suburb polygons were present; none were invented.

Planned modifications: data access/schema, metric and map components, pages, public methodology, service worker, package scripts, README and obsolete GEE guidance. Planned additions: canonical data/config directories, GEE generator/template, import/validation tooling, tests and technical documents.

External work identified: boundary review, field/high-resolution reference samples, threshold choice, Earth Engine project authentication/execution, analytical review and hosting setup. This does not require a framework migration, accounts or a backend.

## Preservation

The v0.2 GeoJSON was extracted unchanged. SHA256: `8a7121b7549f76354a8d99505f70b95550760c8568535cfa3644d54d8d5fd84f`.
Legacy synthetic values are retained as clearly labelled non-executable `.txt` files in `tests/fixtures/legacy/`. The production application cannot import them accidentally as a dataset.
