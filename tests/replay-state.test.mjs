import test from 'node:test';
import assert from 'node:assert/strict';
import {BASELINE,V04,runAntSystem} from '../js/engine/ant-system.js';
import {replayState} from '../js/simulation/replay-state.js';
const run=()=>runAntSystem(V04,{...BASELINE,m:2,T:3,seed:101});
test('empty replay never exposes final best or feromon',()=>{
 const x=run();const s=replayState(x.events,-1);
 assert.equal(s.bestRoute,null);assert.equal(s.tau,null);assert.equal(s.convergence.length,0);assert.equal(s.bestLength,Infinity);
});
test('iteration-start sees initial tau without best route',()=>{
 const x=run();const s=replayState(x.events,0);
 assert.equal(s.event.type,'iteration-start');assert.equal(s.bestRoute,null);assert.equal(s.bestLength,Infinity);
 assert.equal(s.convergence.length,0);assert.equal(s.tau[0][1],1);
});
test('only completed iteration contributes convergence',()=>{
 const x=run();const partial=x.events.findIndex(e=>e.type==='pheromone-updated');
 assert.equal(replayState(x.events,partial).convergence.length,0);
 const first=x.events.findIndex(e=>e.type==='iteration-complete');
 assert.equal(replayState(x.events,first).convergence.length,1);
 assert.equal(replayState(x.events,first).convergence[0].bestLength,x.history[0].bestLength);
});
test('best route appears no earlier than completed first ant',()=>{
 const x=run();const done=x.events.findIndex(e=>e.type==='route-completed');
 assert.equal(replayState(x.events,done-1).bestRoute,null);
 assert.ok(replayState(x.events,done).bestRoute);
});
test('final replay matches algorithm final state',()=>{
 const x=run(),s=replayState(x.events,x.events.length-1);
 assert.equal(s.bestLength,x.bestLength);assert.deepEqual(s.bestRoute,x.bestRoute);
 assert.deepEqual(s.tau,x.tau);assert.equal(s.convergence.length,x.history.length);assert.ok(s.completed);
});
