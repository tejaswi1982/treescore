// TreeScore — Sentinel-2 canopy cover starter script
// Boundaries: mumbai-localities-v0.1  (Andheri West, Powai, Juhu)
//
// HOW TO USE:
// 1. Upload mumbai-localities-v0.1.geojson to GEE as a FeatureCollection asset.
// 2. Replace the asset path below with your own.
// 3. Run. Treat the first run as CALIBRATION, not a publishable number —
//    tune NDVI_THRESHOLD and the water mask against ground truth in these localities.

// ----- 0. Load TreeScore boundaries -----
var localities = ee.FeatureCollection('users/YOUR_USERNAME/mumbai-localities-v0_1');

// ----- 1. Sentinel-2 surface reflectance, low cloud, dry-season composite -----
// Dry season (Nov–Feb) avoids monsoon cloud and gives a stable canopy signal.
var START = '2025-11-01';
var END   = '2026-02-28';

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(localities)
  .filterDate(START, END)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

var composite = s2.median();

// ----- 2. NDVI and NDWI -----
var ndvi = composite.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndwi = composite.normalizedDifference(['B3', 'B8']).rename('NDWI'); // green/NIR water index

// ----- 3. Masks -----
var WATER_THRESHOLD = 0.0;   // NDWI > 0 ~ water; calibrate
var NDVI_THRESHOLD  = 0.35;  // vegetated/canopy; calibrate (0.3–0.4 typical)

var waterMask = ndwi.lt(WATER_THRESHOLD);          // keep land only
var landNdvi  = ndvi.updateMask(waterMask);
var canopy    = landNdvi.gt(NDVI_THRESHOLD).rename('canopy'); // 1 = green, 0 = not

// ----- 4. Per-locality canopy % over LAND area -----
var pixelArea = ee.Image.pixelArea();
var landArea   = pixelArea.updateMask(waterMask);
var canopyArea = pixelArea.updateMask(waterMask).updateMask(canopy);

var stats = localities.map(function(f) {
  var land = landArea.reduceRegion({
    reducer: ee.Reducer.sum(), geometry: f.geometry(),
    scale: 10, maxPixels: 1e9
  }).getNumber('area');
  var green = canopyArea.reduceRegion({
    reducer: ee.Reducer.sum(), geometry: f.geometry(),
    scale: 10, maxPixels: 1e9
  }).getNumber('area');
  var pct = green.divide(land).multiply(100);
  return f.set({
    landAreaSqKm:   land.divide(1e6),
    canopyAreaSqKm: green.divide(1e6),
    canopyPercent:  pct
  });
});

print('TreeScore canopy v0.1 (CALIBRATION RUN):',
  stats.select(['name', 'canopyPercent', 'landAreaSqKm', 'canopyAreaSqKm']));

// ----- 5. Visualise -----
Map.centerObject(localities, 13);
Map.addLayer(landNdvi, {min: 0, max: 0.8, palette: ['white', 'green']}, 'NDVI (land)');
Map.addLayer(canopy.selfMask(), {palette: ['#1b5e20']}, 'Canopy mask');
Map.addLayer(localities.style({color: 'red', fillColor: '00000000'}), {}, 'TreeScore localities');

// ----- 6. Export the comparison table -----
Export.table.toDrive({
  collection: stats.select(['localityId', 'name', 'canopyPercent', 'landAreaSqKm', 'canopyAreaSqKm']),
  description: 'treescore_canopy_v0_1',
  fileFormat: 'CSV'
});
