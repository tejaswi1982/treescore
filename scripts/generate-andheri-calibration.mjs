import {readFileSync,writeFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('data/calibration/andheri-review-manifest.json','utf8'));
if(manifest.localityId!=='andheri-west-core')throw Error('This generator is Andheri-only');
const targets=manifest.samples.map(s=>[s.sampleId+' '+s.sampleName,...s.center,s.widthMetersApprox,s.heightMetersApprox]);
const base=readFileSync('gee/treescore-andheri-browser-run.gee.js','utf8');
const helper=readFileSync('scripts/gee/andheri-calibration-review.js','utf8');
writeFileSync('gee/treescore-andheri-calibration.gee.js',base+'\n// Human approval remains pending. No production export/import.\nvar reviewTargets='+JSON.stringify(targets)+';\nvar sampleClasses='+JSON.stringify(manifest.samples.map(s=>s.sampleClass))+';\n'+helper);
console.log('Generated reproducible Andheri calibration/review script; production threshold remains null.');
