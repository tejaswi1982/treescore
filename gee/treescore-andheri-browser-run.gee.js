// TreeScore Andheri West Core exploratory run. Generated source: gee/treescore-andheri-test.gee.js
var analysisMode = "andheri-test";
var runId = "andheri-test_69a76c3f63db";
var analysisConfig = {schemaVersion:1,boundaryVersion:"mumbai-localities-v0.2",currentSeasonYear:2025,seasonStart:"11-01",seasonEndExclusive:"03-01",greenThreshold:null,thresholdDecisionId:null,candidateThresholds:[0.20,0.25,0.30,0.35,0.40,0.45],cloudScoreMinimum:0.60,sceneCloudMaximum:60,minimumObservations:3,minimumCoveragePercent:90,waterNdwiThreshold:0,scaleMeters:10,crs:"EPSG:32643",currentCollection:"COPERNICUS/S2_SR_HARMONIZED",methodVersion:"level1-1.0",waterMaskVersion:"ndwi-union-1.0"};
var boundaryGeoJson = {type:"FeatureCollection",features:[{type:"Feature",properties:{localityId:"andheri-west-core",name:"Andheri West Core",parentLocality:"Andheri West",boundaryVersion:"mumbai-localities-v0.2",boundaryConfidence:"medium",isOfficialBoundary:false,measurementLabel:"Satellite-derived green cover estimate",publicDisclaimer:"TreeScore-defined analysis area, not an official administrative boundary."},geometry:{type:"Polygon",coordinates:[[[72.818,19.137],[72.8265,19.1395],[72.835,19.138],[72.841,19.132],[72.842,19.1245],[72.841,19.12],[72.8355,19.1192],[72.8285,19.12],[72.8225,19.1212],[72.8175,19.125],[72.8155,19.1315],[72.818,19.137]]]}}]};
var localities=ee.FeatureCollection(boundaryGeoJson.features.map(function(f){return ee.Feature(ee.Geometry.Polygon(f.geometry.coordinates,null,false),f.properties);}));
var qaCollection=ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED');
function season(year){
 var start=year+'-'+analysisConfig.seasonStart;
 var endYear=year+(analysisConfig.seasonEndExclusive<=analysisConfig.seasonStart?1:0);
 var end=endYear+'-'+analysisConfig.seasonEndExclusive;
 var scenes=ee.ImageCollection(analysisConfig.currentCollection).filterBounds(localities.geometry()).filterDate(start,end).filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE',analysisConfig.sceneCloudMaximum));
 var clear=scenes.linkCollection(qaCollection,['cs_cdf']).map(function(image){
  var mask=image.select('cs_cdf').gte(analysisConfig.cloudScoreMinimum).and(image.select(['B2','B3','B4','B8']).mask().reduce(ee.Reducer.min()));
  return image.select(['B2','B3','B4','B8']).updateMask(mask);
 });
 var seed=ee.Image.constant([0,0,0,0]).rename(['B2','B3','B4','B8']).updateMask(ee.Image.constant(0));
 var safe=clear.merge(ee.ImageCollection([seed]));
 var composite=safe.median();
 var red=composite.select('B4'),nir=composite.select('B8'),green=composite.select('B3');
 var ndvi=nir.subtract(red).divide(nir.add(red)).updateMask(nir.add(red).neq(0)).rename('NDVI');
 var ndwi=green.subtract(nir).divide(green.add(nir)).updateMask(green.add(nir).neq(0)).rename('NDWI');
 var valid=safe.select('B8').count().gte(analysisConfig.minimumObservations).and(ndvi.mask()).and(ndwi.mask()).unmask(0);
 return {year:year,start:start,end:end,scenes:scenes,ndvi:ndvi,ndwi:ndwi,valid:valid,composite:composite};
}
var s=season(analysisConfig.currentSeasonYear);
var commonValid=s.valid;
var waterUnion=s.ndwi.gt(analysisConfig.waterNdwiThreshold).unmask(0);
var potentialLand=waterUnion.not();
var analysisLand=potentialLand.and(commonValid);
var pixelArea=ee.Image.pixelArea();
function sumArea(mask,geometry){
 var result=pixelArea.multiply(mask.unmask(0)).rename('area').reduceRegion({reducer:ee.Reducer.sum(),geometry:geometry,crs:analysisConfig.crs,scale:analysisConfig.scaleMeters,maxPixels:1e8,tileScale:4}).get('area');
 return ee.Number(ee.Algorithms.If(result,result,0));
}
function stats(feature,threshold){
 var geometry=feature.geometry();
 var land=sumArea(analysisLand,geometry),possible=sumArea(potentialLand,geometry);
 var green=sumArea(analysisLand.and(s.ndvi.gte(threshold).unmask(0)),geometry);
 var coverage=ee.Number(ee.Algorithms.If(possible.gt(0),land.divide(possible).multiply(100),0));
 var count=s.scenes.filterBounds(geometry).size();
 var valid=land.gt(0).and(coverage.gte(analysisConfig.minimumCoveragePercent)).and(count.gte(analysisConfig.minimumObservations));
 return ee.Feature(null,{localityId:feature.get('localityId'),kind:'current',seasonYear:s.year,greenCoverPercent:ee.Algorithms.If(valid,green.divide(land).multiply(100),-1),analysisAreaSqKm:land.divide(1e6),greenAreaSqKm:green.divide(1e6),polygonAreaSqKm:geometry.area(1).divide(1e6),coveragePercent:coverage,imageCount:count,threshold:threshold,thresholdDecisionId:analysisConfig.thresholdDecisionId||'UNREVIEWED',dateStart:s.start,dateEnd:s.end,collection:analysisConfig.currentCollection,metric:'Satellite-derived green cover estimate',methodVersion:analysisConfig.methodVersion,boundaryVersion:analysisConfig.boundaryVersion,waterMaskVersion:analysisConfig.waterMaskVersion,denominatorId:runId+'-observed-land',cloudScoreMinimum:analysisConfig.cloudScoreMinimum,sceneCloudMaximum:analysisConfig.sceneCloudMaximum,minimumObservations:analysisConfig.minimumObservations,minimumCoveragePercent:analysisConfig.minimumCoveragePercent,waterNdwiThreshold:analysisConfig.waterNdwiThreshold,crs:analysisConfig.crs,scaleMeters:analysisConfig.scaleMeters,runId:runId,dataStatus:'calculated',publishableRanking:false,qualityStatus:ee.Algorithms.If(valid,'review-required','insufficient-coverage'),imageIds:s.scenes.filterBounds(geometry).aggregate_array('system:index').join(';')});
}
var f=ee.Feature(localities.first());
Map.centerObject(localities,14);
Map.addLayer(localities.style({color:'1f3a2d',fillColor:'00000000'}),{},'TreeScore-defined area; not official');
Map.addLayer(analysisLand.selfMask().clip(f.geometry()),{palette:['e3e9d9']},'Observed land denominator',false);
Map.addLayer(waterUnion.selfMask().clip(f.geometry()),{palette:['3388aa']},'Excluded water',false);
Map.addLayer(s.composite.clip(f.geometry()),{bands:['B4','B3','B2'],min:0,max:3000,gamma:1.2},'2025-2026 RGB',true);
Map.addLayer(s.ndvi.updateMask(analysisLand).clip(f.geometry()),{min:-0.2,max:0.8,palette:['c8b99b','fbf9f2','1f3a2d']},'NDVI',false);
print('EXPLORATORY ONLY - no final threshold; no production import',{localityId:'andheri-west-core',dateStart:s.start,dateEndExclusive:s.end,collection:analysisConfig.currentCollection,cloudMask:'Cloud Score+ cs_cdf >= '+analysisConfig.cloudScoreMinimum,minimumClearObservations:analysisConfig.minimumObservations});
print('Sentinel scenes after date/bounds/scene-cloud filtering',s.scenes.size());
print('Scene IDs',s.scenes.aggregate_array('system:index'));
print('Area with sufficient valid observations before water exclusion (sq km)',sumArea(commonValid,f.geometry()).divide(1e6));
print('Valid observed land after water exclusion (sq km)',sumArea(analysisLand,f.geometry()).divide(1e6));
var candidateRows=ee.FeatureCollection(analysisConfig.candidateThresholds.map(function(threshold){
 Map.addLayer(s.ndvi.gte(threshold).updateMask(analysisLand).selfMask().clip(f.geometry()),{palette:['32b45d']},'Candidate NDVI >= '+threshold.toFixed(2)+' - NOT FINAL',false);
 return stats(f,threshold).set({kind:'calibration',sampleName:'Whole Andheri West Core sensitivity test',sampleType:'unlabelled',observation:'Visual exploration only; not ground-truth calibration'});
}));
print('Candidate threshold sensitivity',candidateRows.select(['threshold','greenCoverPercent','greenAreaSqKm','analysisAreaSqKm','coveragePercent','imageCount','qualityStatus']));
Export.table.toDrive({collection:candidateRows,description:'treescore_andheri_candidates_'+runId,fileFormat:'CSV'});
if(typeof analysisConfig.greenThreshold==='number'&&analysisConfig.thresholdDecisionId){
 Export.table.toDrive({collection:ee.FeatureCollection([stats(f,analysisConfig.greenThreshold)]),description:'treescore_andheri_review_required_'+runId,fileFormat:'CSV'});
}
print('Inspect RGB, then NDVI, then one candidate mask at a time. No final threshold has been selected.');
