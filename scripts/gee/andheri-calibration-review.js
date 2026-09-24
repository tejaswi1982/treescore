// Append to the archived single-locality first-run pipeline.
// reviewTargets is generated from the reviewed local sample manifest.
var reviewBox=ui.Map.Layer(ee.Image(),{},'Review sample outline');Map.layers().add(reviewBox);
var thumbPanel=ui.Panel({style:{position:'bottom-right',width:'286px'}});Map.add(thumbPanel);
function reviewGeometry(a){return ee.Geometry.Rectangle([a[1]-.000285*a[3]/60,a[2]-.00027*(a[4]||a[3])/60,a[1]+.000285*a[3]/60,a[2]+.00027*(a[4]||a[3])/60],null,false);}
function showReview(i){
 var a=reviewTargets[i],g=reviewGeometry(a),fc=ee.FeatureCollection([ee.Feature(g)]);
 reviewBox.setEeObject(fc.style({color:'ff00ff',fillColor:'00000000',width:2}));Map.setCenter(a[1],a[2],18);
 thumbPanel.clear();thumbPanel.add(ui.Label(a[0]+' | seasonal RGB / NDVI'));
 var outline=ee.Image().byte().paint(fc,1,1).selfMask().visualize({palette:['ff00ff']});
 var region=g.buffer(30).bounds(),row=ui.Panel({layout:ui.Panel.Layout.flow('horizontal')});
 row.add(ui.Thumbnail({image:s.composite.visualize({bands:['B4','B3','B2'],min:0,max:3000,gamma:1.2}).blend(outline),params:{region:region,dimensions:'130x130',format:'png'},style:{width:'130px',height:'130px'}}));
 row.add(ui.Thumbnail({image:s.ndvi.updateMask(analysisLand).visualize({min:-.2,max:.8,palette:['c8b99b','fbf9f2','1f3a2d']}).blend(outline),params:{region:region,dimensions:'130x130',format:'png'},style:{width:'130px',height:'130px'}}));
 thumbPanel.add(row);
}
var rp=ui.Panel({style:{position:'bottom-left',width:'180px'}});rp.add(ui.Label('Sample visual review'));
rp.add(ui.Select({items:reviewTargets.map(function(a){return a[0];}),value:reviewTargets[5][0],onChange:function(v){showReview(reviewTargets.map(function(a){return a[0];}).indexOf(v));}}));
Map.add(rp);Map.layers().get(3).setShown(false);Map.layers().get(4).setShown(false);Map.setOptions('SATELLITE');showReview(5);
var sampleSummaries=ee.List(reviewTargets.map(function(a,i){
 var g=reviewGeometry(a),area=sumArea(ee.Image.constant(1),g),validArea=sumArea(analysisLand,g);
 var greenAreas=ee.List(analysisConfig.candidateThresholds.map(function(t){return sumArea(analysisLand.and(s.ndvi.gte(t).unmask(0)),g);}));
 var distribution=s.ndvi.updateMask(analysisLand).reduceRegion({reducer:ee.Reducer.percentile([10,50,90]),geometry:g,crs:analysisConfig.crs,scale:10,maxPixels:1e7});
 return ee.Dictionary({sampleId:a[0].split(' ')[0],sampleName:a[0],sampleClass:sampleClasses[i],expectedType:a[0].charAt(0)==='G'?'green':a[0].charAt(0)==='N'?'non-green':'mixed',reviewStatus:'agent-visual-accepted-human-pending',sampleArea:area,validArea:validArea,greenAreas:greenAreas,greenPercents:greenAreas.map(function(v){return ee.Number(v).divide(area).multiply(100);}),ndvi:distribution,insideBoundary:localities.geometry().contains(g,ee.ErrorMargin(1))});
}));
var calibrationRows=ee.FeatureCollection(sampleSummaries.map(function(d){d=ee.Dictionary(d);return ee.List.sequence(0,5).map(function(i){i=ee.Number(i);return ee.Feature(null,{sampleId:d.get('sampleId'),sampleClass:d.get('sampleClass'),expectedType:d.get('expectedType'),threshold:ee.List(analysisConfig.candidateThresholds).get(i),sampleArea:d.get('sampleArea'),validArea:d.get('validArea'),classifiedGreenArea:ee.List(d.get('greenAreas')).get(i),classifiedGreenPercent:ee.List(d.get('greenPercents')).get(i),areaUnit:'m2',reviewStatus:'agent-visual-accepted-human-pending'});});}).flatten());
print('Calibration sample-threshold rows (square meters)',calibrationRows);
sampleSummaries.evaluate(function(rows,error){if(error){print('CALIBRATION_ERROR',error);}else{print('CALIBRATION_RESULTS_JSON',JSON.stringify(rows));}});
