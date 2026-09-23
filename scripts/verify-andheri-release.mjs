import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parseCsv} from './import-metrics.ts';
const base='http://127.0.0.1:3000';
const file='data/import/treescore_andheri_west_core_2025-11_2026-02_v1.csv';
const exported=parseCsv(readFileSync(file,'utf8'));
const current=JSON.parse(readFileSync('data/metrics/current.json','utf8'));
assert.equal(exported.length,1);assert.equal(current.length,1);
const m=current[0];assert.equal(m.localityId,'andheri-west-core');assert.equal(m.dataStatus,'verified');
for(const key of ['greenCoverPercent','greenAreaSqKm','analysisAreaSqKm','imageCount','threshold','dateStart','dateEnd','calibrationVersion'])assert.equal(m[key],exported[0][key],key);
assert.equal(m.review.inputSha256,createHash('sha256').update(readFileSync(file)).digest('hex'));
assert.deepEqual(JSON.parse(readFileSync('data/historical/series.json','utf8')),[]);
for(const id of ['andheri-west-core','juhu','powai-lake-urban-area']){
 const response=await fetch(base+'/locality/'+id);assert.equal(response.status,200);
 const html=await response.text();const card=html.match(/<article[^>]*>([\s\S]*?)<\/article>/)?.[1];assert.ok(card);
 if(id==='andheri-west-core'){
  assert.ok(card.includes(m.greenCoverPercent.toFixed(1)+'%'));
  assert.ok(card.includes('Reviewed beta measurement'));assert.ok(card.includes('Nov 2025 to Feb 2026'));
  assert.ok(!card.includes('Analysis pending'));assert.ok(!card.includes('Comparable-area rank'));
  assert.ok(card.includes('TreeScore-defined analysis area, not an official administrative boundary.'));
 }else{assert.ok(card.includes('Analysis pending'));assert.ok(!card.includes('Reviewed beta measurement'));}
 assert.ok(html.includes('Historical analysis pending'));console.log('PASS publication state: '+id);
}
const ranking=await (await fetch(base+'/rankings')).text();
assert.ok(ranking.includes('1 measured locality. Rankings will appear as more comparable areas are published.'));
assert.ok(!/>#1</.test(ranking));
console.log('PASS export-to-production provenance, single measured locality, no singleton rank, and no historical publication.');
