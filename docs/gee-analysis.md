# Earth Engine run and import handoff

The scripts are complete locally but **have not been executed against Earth Engine**. JavaScript syntax/structure checks are not remote execution. No credentials are required to run the web app.

## 1. Open and authenticate

Open [Google Earth Engine Code Editor](https://code.earthengine.google.com/) in your own browser. Sign in and select an Earth Engine-enabled Google Cloud project. If necessary follow the official [access setup](https://developers.google.com/earth-engine/guides/access). Do not put credentials in this repository.

## 2. Review the actual boundaries

Inspect `data/boundaries/mumbai-localities-v0.2.geojson` over a basemap in QGIS, geojson.io or Earth Engine. Check the Powai lake hole, coastal edges and scope of each analysis area. Record findings. If changing geometry, create v0.3 rather than overwrite v0.2; update config and recompute every affected series. These are medium-confidence, non-official polygons.

## 3. Supply reference areas and run calibration

Edit `data/calibration/reference-areas.geojson` with actual reviewed Polygon features inside the locality boundaries. Required legacy properties: `localityId`, `sampleName`, `sampleType` (`green`, `built-up` or `mixed`) and `observation` (source/date and field or imagery evidence). The Andheri references also include `sampleId`, `sampleClass`, `expectedType`, `notes` and explicit `reviewStatus`. Mixed samples are sensitivity checks, not pure negative or positive labels. The file now contains ten agent-visually-reviewed Andheri samples with human approval pending; see `data/calibration/decision.md`.

For the scoped Andheri review, run `node scripts/generate-andheri-calibration.mjs` and load `gee/treescore-andheri-calibration.gee.js`. This preserves the first-run collection/window/masks and adds a sample selector with paired RGB/NDVI thumbnails and 60 sample-threshold rows. No threshold approval or production import is performed by this generator. Independent held-out checks remain outstanding.

From the project terminal run:

```powershell
npm run gee:generate
```

Open `gee/treescore-calibration.gee.js`, copy the **entire file** into a new Code Editor script and click **Run**. Boundaries are inline, so no asset upload is required. Inspect layers, the NDVI histogram and sample table. In **Tasks**, click **Run** on the calibration CSV export; select your Drive folder and wait for completion. Download the CSV to `data/import/` with a meaningful filename.

Repeat with `gee/treescore-calibration-historical.gee.js` and historically valid sample labels. It exports threshold/sample/season rows for the TOA historical series. When sample labels differ by year, regenerate with the appropriate dated reference set and assess only its valid seasons. Preserve each input/reference set and export. Lack of sufficiently supported reference evidence remains a calibration limitation.

## 4. Record the threshold decision

Complete `data/calibration/decision.md`. Set `greenThreshold` and a meaningful `thresholdDecisionId` in `data/analysis-config.json` only after review. The first current window is November 2025 through February 2026. Candidate values, minimum observations, cloud/water masks and coverage limits are documented in `docs/methodology.md`.

```powershell
npm run gee:generate
```

## 5. Run current and historical analysis

Paste/run **all** of `gee/treescore-current.gee.js` in the Code Editor. Inspect NDVI, false-colour imagery, water exclusion, land denominator, scene IDs and coverage for each locality. Run the CSV export from **Tasks**, wait for completion, and download it to `data/import/current.csv`.

Separately paste/run `gee/treescore-historical.gee.js`. Export and download to `data/import/historical.csv`. This uses TOA consistently across all selected years and a common observed-land mask. Do not merge with the SR current values. If early coverage fails, the script exports invalid/unavailable diagnostics; do not replace those with zero or simply weaken the checks. Review coverage and either leave 2015 unavailable or define a documented alternate series and regenerate.

The generator records a deterministic run ID derived from configuration, boundaries, references and script. Retain the raw export and its individual scene IDs. Rerunning Earth Engine can see reprocessed archive data; the review's raw-file hash identifies the specific export actually released.

## 6. Review the exact raw export

Copy `data/import/review.template.json` to `data/import/current.review.json`. Get the raw file hash:

```powershell
(Get-FileHash data/import/current.csv -Algorithm SHA256).Hash.ToLower()
```

Fill `inputSha256` with that hash; fill `reviewer`, `reviewedAt` (`YYYY-MM-DD`), substantive `notes`, and matching `thresholdDecisionId`. Set the boundary/calibration/cloud-water review flags true **only after doing that work**. Leave `publishableRanking` false until publication eligibility is independently decided. Setting that flag does not override locality configuration.

For historical data make a separate `historical.review.json` tied to the historical CSV hash. Review the masks and per-year evidence, not just the final percentage.

## 7. Validate and import

```powershell
npm run import:metrics -- data/import/current.csv data/import/current.review.json --dry-run
npm run import:metrics -- data/import/current.csv data/import/current.review.json
npm run import:metrics -- data/import/historical.csv data/import/historical.review.json --dry-run
npm run import:metrics -- data/import/historical.csv data/import/historical.review.json
npm run validate:data
npm test
```

JSON arrays of the same records are also accepted. Legacy canopy samples are rejected. Import one kind and one coherent run at a time. **Each import atomically replaces the imported locality within the current or historical release** while preserving other reviewed localities. Review receipts are preserved in `data/import/reviews/`. Export rows failing range, coverage, date or provenance checks abort before any production write. Partial valid historical years are allowed, but no change is calculated without matching endpoints.

## 8. Reload or deploy

During development refresh TreeScore after import. For production, rebuild and restart:

```powershell
npm run build
npm start
```

Inspect every locality and historical period before deployment. For rankings, explicitly enable `publishableRanking` for eligible localities in `data/localities.json` **and** in the raw-file review; re-import and rebuild. Never enable planned or unreviewed areas to fill the board.
