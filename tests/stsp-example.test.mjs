import test from 'node:test';
import assert from 'node:assert/strict';
import {V04,ROUTE_MODES,routeValidation,tourLength,exactOptimalTour} from '../js/presentation/stsp-example.js';
test('V-04 is symmetric and has valid distances',()=>{assert.equal(V04.length,4); for(let i=0;i<4;i++)for(let j=0;j<4;j++){assert.equal(V04[i][j],V04[j][i]);assert.equal(V04[i][j]===0,i===j);}});
test('optimal tour length is 13 via exhaustive enumeration',()=>{assert.equal(tourLength(ROUTE_MODES.optimal.route),13);assert.equal(exactOptimalTour().length,13);});
test('nonoptimal tour is valid with length 18',()=>{assert.equal(routeValidation(ROUTE_MODES.nonoptimal.route).valid,true);assert.equal(tourLength(ROUTE_MODES.nonoptimal.route),18);});
test('invalid duplicated-city tour cannot yield a STSP objective value',()=>{assert.equal(routeValidation(ROUTE_MODES.invalid.route).valid,false);assert.equal(tourLength(ROUTE_MODES.invalid.route),null);});
test('route must return to start and visit every city once',()=>{assert.equal(routeValidation([0,1,2,3,1]).valid,false);assert.equal(routeValidation([0,1,1,3,0]).valid,false);});
