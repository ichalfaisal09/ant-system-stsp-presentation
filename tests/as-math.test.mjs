import test from 'node:test';
import assert from 'node:assert/strict';
import {transitionProbabilities,examplePheromone} from '../js/presentation/as-math.js';
import {V04} from '../js/presentation/stsp-example.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-12,`expected ${a}≈${b}`);
test('V04 initial probability matches 36/49 9/49 4/49',()=>{
 const rows=transitionProbabilities(V04,0,[1,2,3],null,1,2);
 rows.forEach((r,i)=>near(r.probability,[36/49,9/49,4/49][i]));
 near(rows.reduce((s,r)=>s+r.probability,0),1);
});
test('alpha alone does not alter probabilities while tau uniform',()=>{
 const a=transitionProbabilities(V04,0,[1,2,3],null,0,2);
 const b=transitionProbabilities(V04,0,[1,2,3],null,4,2);
 a.forEach((r,i)=>near(r.probability,b[i].probability));
});
test('beta zero gives uniform probabilities at uniform pheromone',()=>{
 transitionProbabilities(V04,0,[1,2,3],null,1,0).forEach(r=>near(r.probability,1/3));
});
test('tau after two completed tours is symmetric and exactly known',()=>{
 const tau=examplePheromone();
 const expected=[[0,37/26,7/6,163/78],[37/26,0,163/78,7/6],[7/6,163/78,0,37/26],[163/78,7/6,37/26,0]];
 expected.forEach((row,i)=>row.forEach((v,j)=>near(tau[i][j],v)));
});
test('reject invalid parameters and candidate lists',()=>{
 assert.throws(()=>transitionProbabilities(V04,0,[1,2,3],null,-1,2));
 assert.throws(()=>transitionProbabilities(V04,0,[],null,1,2));
 assert.throws(()=>transitionProbabilities(V04,0,[1,1],null,1,2));
});
