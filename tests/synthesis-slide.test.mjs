import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSynthesisSlide,mountSynthesisSlide} from '../js/presentation/slide-09.js';
import fs from 'node:fs';
test('slide 09 menampilkan tiga dimensi sintesis dan batasan penelitian',()=>{
 const html=renderSynthesisSlide();
 for(const claim of ['Kebenaran algoritma','Biaya komputasi','Kualitas empiris','bukan jaminan optimum global','tidak menyetarakan anggaran']) assert.ok(html.toLowerCase().includes(claim.toLowerCase()),claim);
});
test('slide 09 terpasang pada router dan presenter notes',()=>{
 const app=fs.readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 const registry=fs.readFileSync(new URL('../js/presentation/registry.js',import.meta.url),'utf8');
 assert.match(app,/route\.number === 9/);
 assert.match(app,/stopSynthesis\?\.\(\)/);
 assert.match(registry,/index === 8/);
});
