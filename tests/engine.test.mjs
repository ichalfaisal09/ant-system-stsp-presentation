import test from 'node:test';
import assert from 'node:assert/strict';
import {BASELINE,V04,validateMatrix,routeLength,transitionProbabilities,runAntSystem} from '../js/engine/ant-system.js';
test('V-04 route length and validation',()=>{assert.equal(validateMatrix(V04),4);assert.equal(routeLength([0,1,2,3],V04),13);assert.equal(routeLength([0,3,1,2],V04),18);});
test('transition probabilities normalized and baseline correct',()=>{const tau=V04.map((r,i)=>r.map((_,j)=>i===j?0:1));const p=transitionProbabilities(0,[1,2,3],V04,tau,BASELINE).map(x=>x.probability);for(let i=0;i<3;i++)assert.ok(Math.abs(p[i]-[36/49,9/49,4/49][i])<1e-12);});
test('engine deterministic and global tau update after all ants complete',()=>{const p={...BASELINE,m:4,T:3,seed:101};const a=runAntSystem(V04,p),b=runAntSystem(V04,p);assert.deepEqual(a,b);assert.equal(a.history.length,3);assert.ok(a.history.every((h,i)=>i===0||h.bestLength<=a.history[i-1].bestLength));assert.equal(a.events.filter(x=>x.type==='pheromone-updated').length,3);for(let i=0;i<4;i++)for(let j=0;j<4;j++)assert.equal(a.tau[i][j],a.tau[j][i]);});
test('reject asymmetric matrix and invalid parameter',()=>{assert.throws(()=>validateMatrix([[0,1,2],[3,0,1],[2,1,0]]));assert.throws(()=>runAntSystem(V04,{...BASELINE,rho:1}));});
