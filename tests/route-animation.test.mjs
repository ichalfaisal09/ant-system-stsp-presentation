import test from 'node:test';
import assert from 'node:assert/strict';
import {routeProgress} from '../js/presentation/route-animation.js';
test('route tracer reveals edges sequentially', () => {
  assert.deepEqual(routeProgress(0, 5), [0,0,0,0,0]);
  assert.deepEqual(routeProgress(1050, 5), [1,0,0,0,0]);
  assert.deepEqual(routeProgress(2625, 5), [1,1,.5,0,0]);
  assert.deepEqual(routeProgress(5500, 5), [1,1,1,1,1]);
  assert.deepEqual(routeProgress(6350, 5), [0,0,0,0,0]);
});
