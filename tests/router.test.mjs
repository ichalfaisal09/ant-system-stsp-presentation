import test from 'node:test';
import assert from 'node:assert/strict';
import {parseRoute, slideHash} from '../js/router.js';
test('routing awal, deep link, lab, dan batas', () => {
  assert.deepEqual(parseRoute('',10), {type:'slide',number:1});
  assert.deepEqual(parseRoute('#/slide/7',10), {type:'slide',number:7});
  assert.deepEqual(parseRoute('#/10',10), {type:'slide',number:10});
  assert.deepEqual(parseRoute('#/lab',10), {type:'lab'});
  assert.deepEqual(parseRoute('#/slide/11',10), {type:'slide',number:1});
  assert.equal(slideHash(5), '#/slide/5');
});
