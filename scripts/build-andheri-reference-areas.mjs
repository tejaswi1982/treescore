import {readFileSync,writeFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('data/calibration/andheri-review-manifest.json','utf8'));
const boundary=JSON.parse(readFileSync('data/boundaries/mumbai-localities-v0.2.geojson','utf8')).features.find(f=>f.properties.localityId===manifest.localityId).geometry.coordinates[0];
function inside([x,y]){let yes=false;for(let i=0,j=boundary.length-1;i<boundary.length;j=i++){const [xi,yi]=boundary[i],[xj,yj]=boundary[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)yes=!yes;}return yes;}
function feature(sample,rejected=false){
 const [x,y]=sample.center,dx=.000285*sample.widthMetersApprox/60,dy=.00027*sample.heightMetersApprox/60;
 const ring=[[x-dx,y-dy],[x+dx,y-dy],[x+dx,y+dy],[x-dx,y+dy],[x-dx,y-dy]];
 // Dense edge sampling additionally checks this small rectangle against concavities.
 for(let i=0;i<4;i++)for(let n=0;n<=20;n++){const p=ring[i].map((v,k)=>v+(ring[i+1][k]-v)*n/20);if(!inside(p))throw Error(sample.sampleId+' crosses the locality boundary');}
 const properties={...sample,localityId:manifest.localityId,boundaryVersion:manifest.boundaryVersion,reviewDate:manifest.reviewDate,reviewer:manifest.reviewer,reviewStatus:rejected?'rejected':manifest.reviewStatus};
 if(!rejected){properties.sampleType=sample.expectedType==='non-green'?'built-up':sample.expectedType;properties.observation=manifest.evidenceSource+' '+sample.notes;}
 return {type:'Feature',properties,geometry:{type:'Polygon',coordinates:[ring]}};
}
const accepted=manifest.samples.map(s=>feature(s));
if(new Set(accepted.map(f=>f.properties.sampleId)).size!==accepted.length)throw Error('Duplicate sample ID');
writeFileSync('data/calibration/reference-areas.geojson',JSON.stringify({type:'FeatureCollection',features:accepted},null,2)+'\n');
writeFileSync('data/calibration/rejected-areas.geojson',JSON.stringify({type:'FeatureCollection',features:manifest.rejectedFootprints.map(s=>feature(s,true))},null,2)+'\n');
console.log('Built '+accepted.length+' visual-review reference polygons, all within v0.2; human approval remains pending.');
