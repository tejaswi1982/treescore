// Human-approved ONLY for Andheri West Core v0.2, this season and calibrated method.
analysisConfig.thresholdDecisionId='andheri-sr-dry2026-v1';
runId='andheri-sr-dry2026-v1-final';
var finalRow=stats(f,0.35).set({localityName:f.get('name'),validLandAreaSqKm:sumArea(analysisLand,f.geometry()).divide(1e6),analysisStart:s.start,analysisEnd:ee.Date(s.end).advance(-1,'day').format('YYYY-MM-dd'),cloudMaskMethod:'Cloud Score+ cs_cdf >= 0.60; valid B2/B3/B4/B8 masks; median clear composite',sceneCount:s.scenes.size(),methodologyVersion:analysisConfig.methodVersion,calibrationVersion:'andheri-sr-dry2026-v1',referenceSha256:'d11cb05911896c732b6448e05831aecae91e12ff3559b1445c5d342710789a27',reviewStatus:'human-approved',publishableRanking:false});
var finalExport=ee.FeatureCollection([finalRow]);
print('FINAL APPROVED ANDHERI MEASUREMENT',finalRow);
finalExport.getDownloadURL('CSV',null,'treescore_andheri_west_core_2025-11_2026-02_v1',function(url){print(ui.Label('Download final Andheri CSV',{},url));});
