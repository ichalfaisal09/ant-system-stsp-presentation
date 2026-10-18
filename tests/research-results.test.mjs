import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseSummary,summarizeOptimality} from '../js/presentation/research-results.js';
const data=file=>readFileSync(new URL('../data/results/'+file,import.meta.url),'utf8');
test('research quality CSV has five rows and exact verified means',()=>{
 const rows=parseSummary(data('quality_summary.csv'),['dataset','n','mean','repetitions']);
 assert.deepEqual(rows.map(x=>+x.mean),[222,191,414.4,258.2,343.2]);
 assert.ok(rows.every(x=>+x.repetitions===5));
});
test('gap summary proves only fifteen small-instance reference runs',()=>{
 const rows=parseSummary(data('optimality_gap_summary.csv'),['dataset','n','optimum','repetitions','optimal_found_count','mean_gap_pct','success_rate_pct']);
 assert.deepEqual(rows.map(x=>+x.optimum),[9,13,18]);
 assert.deepEqual(summarizeOptimality(rows),{trials:15,successes:15,gapZero:true});
});
test('missing research columns throw rather than invent data',()=>assert.throws(()=>parseSummary('dataset,mean\nK-10,22',['std_sample']),/tidak ditemukan/));
test('numeric corruption throws',()=>assert.throws(()=>parseSummary('dataset,mean\nK-10,abc',['dataset','mean']),/numerik/));
