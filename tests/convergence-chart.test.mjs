import test from 'node:test';
import assert from 'node:assert/strict';
import {renderConvergenceChart} from '../js/simulation/convergence-chart.js';

test('empty chart invites user to finish first iteration',()=>{
 const svg=renderConvergenceChart([]);
 assert.match(svg,/iterasi pertama selesai/);
 assert.doesNotMatch(svg,/Tidak ada perbaikan/);
});
test('flat best-so-far shows axes, labels, and explanatory status',()=>{
 const svg=renderConvergenceChart([{iteration:1,bestLength:13},{iteration:2,bestLength:13},{iteration:3,bestLength:13}]);
 assert.match(svg,/Panjang tur/);
 assert.match(svg,/Iterasi/);
 assert.match(svg,/Tidak ada perbaikan/);
 assert.match(svg,/Best-so-far: 13/);
 assert.match(svg,/polyline/);
});
test('improvement summary is calculated only from provided completed iterations',()=>{
 const svg=renderConvergenceChart([{iteration:1,bestLength:18},{iteration:2,bestLength:13}]);
 assert.match(svg,/Perbaikan: 5/);
 assert.match(svg,/Best-so-far: 13/);
 assert.match(svg,/iterasi 2/);
 assert.doesNotMatch(svg,/iterasi 3/);
});
test('single completed iteration renders marker without fabricating future points',()=>{
 const svg=renderConvergenceChart([{iteration:1,bestLength:13}]);
 assert.match(svg,/circle/);
 assert.doesNotMatch(svg,/polyline/);
});
