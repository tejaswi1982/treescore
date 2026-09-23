import {readFileSync,writeFileSync} from 'node:fs';
const raw=JSON.parse(readFileSync('data/calibration/andheri-observed-results.json','utf8'));
const manifest=JSON.parse(readFileSync('data/calibration/andheri-review-manifest.json','utf8'));
const samples=raw.rows.map(r=>{const info=manifest.samples.find(s=>s.sampleId===r[0]);if(!info)throw Error('Unknown sample');return {...info,sampleArea:r[1],validArea:r[2],greenAreas:r[3],greenPercents:r[4],ndvi:{p10:r[5],p50:r[6],p90:r[7]},insideBoundary:r[8]};});
const rows=samples.flatMap(s=>raw.thresholds.map((t,i)=>({sampleId:s.sampleId,sampleClass:s.sampleClass,expectedType:s.expectedType,threshold:t,sampleArea:s.sampleArea,validArea:s.validArea,classifiedGreenArea:s.greenAreas[i],classifiedGreenPercent:s.greenPercents[i],areaUnit:'m2',reviewStatus:manifest.reviewStatus})));
for(const s of samples){
 if(s.greenAreas.length!==6||s.greenPercents.length!==6||![s.sampleArea,s.validArea,...s.greenAreas,...s.greenPercents].every(Number.isFinite))throw Error('Incomplete or non-finite results');
 if(!s.insideBoundary||s.validArea<=0||s.validArea>s.sampleArea+1e-6)throw Error('Invalid sample coverage/containment');
 for(let i=0;i<6;i++){if(Math.abs(s.greenAreas[i]/s.sampleArea*100-s.greenPercents[i])>1e-9)throw Error('Area/percentage transcription mismatch');if(i&&s.greenAreas[i]>s.greenAreas[i-1]+1e-6)throw Error('Non-monotonic threshold outputs');}
}
if(samples.length!==10||rows.length!==60)throw Error('Missing calibration rows');
const groups=raw.thresholds.map((threshold,i)=>Object.fromEntries([['threshold',threshold],...['green','non-green','mixed'].map(type=>{const group=samples.filter(s=>s.expectedType===type),values=group.map(s=>s.greenPercents[i]);return [type,{sampleCount:group.length,meanPercent:values.reduce((a,b)=>a+b,0)/group.length,minPercent:Math.min(...values),maxPercent:Math.max(...values),areaWeightedPercent:group.reduce((a,s)=>a+s.greenAreas[i],0)/group.reduce((a,s)=>a+s.sampleArea,0)*100}];})]));
const headers=Object.keys(rows[0]);
writeFileSync('data/calibration/andheri-calibration-results.csv',headers.join(',')+'\n'+rows.map(r=>headers.map(h=>r[h]).join(',')).join('\n')+'\n');
writeFileSync('data/calibration/andheri-calibration-summary.json',JSON.stringify({reviewStatus:manifest.reviewStatus,aggregation:'Equal-weight mean of sample percentages; area-weighted alternative also provided',groups,samples},null,2)+'\n');
console.log(JSON.stringify(groups,null,2));
console.log('Validated 60 real area/percentage pairs; no production writes.');
