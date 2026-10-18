import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_MATRIX,DEMO_ROUTES,DEMO_CONFIG,STAGES,routeDistance,updatePheromone} from '../js/presentation/ant-cycle-demo.js';
test('dua tur demonstrasi STSP mempunyai panjang 13 dan 18',()=>{assert.equal(routeDistance(DEMO_ROUTES[0]),13);assert.equal(routeDistance(DEMO_ROUTES[1]),18);});
test('rute yang melewatkan kota ditolak',()=>assert.throws(()=>routeDistance([0,1,2,1,0])));
test('Ant-Cycle: evaporasi sekali kemudian deposisi seluruh semut, simetris',()=>{
 const {tau,lengths}=updatePheromone();assert.deepEqual(lengths,[13,18]);
 const expectEdges={'0-1':37/26,'0-2':7/6,'0-3':163/78,'1-2':163/78,'1-3':7/6,'2-3':37/26};
 for(const [edge,val] of Object.entries(expectEdges)){const [i,j]=edge.split('-').map(Number);assert.ok(Math.abs(tau[i][j]-val)<1e-12,`${edge}: ${tau[i][j]} vs ${val}`);assert.equal(tau[i][j],tau[j][i]);}
});
test('semua enam tahap berurutan dan contoh eksplisit',()=>{assert.equal(STAGES.length,6);assert.equal(DEMO_CONFIG.Q,12);assert.equal(DEMO_MATRIX[0][1],2);});
