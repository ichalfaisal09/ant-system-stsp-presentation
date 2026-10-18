import test from 'node:test';
import assert from 'node:assert/strict';
import {renderConclusionSlide,getQATarget,mountConclusionSlide} from '../js/presentation/slide-10.js';
import {slides} from '../js/presentation/registry.js';
test('Slide 10 registered and implemented',()=>{assert.equal(slides[9].status,'implemented');assert.ok(slides[9].notes.includes('Q&A'));});
test('Slide 10 references evidence, caveats, and navigation',()=>{let s=renderConclusionSlide();for(let part of ['28/28','15/15','Θ(Tmn²)','Θ(n² + mn)','data-qa-lab','data-qa-target','anggaran komputasi']) assert.ok(s.includes(part),part);});
test('Q&A targets are defined and valid',()=>{assert.equal(getQATarget('complexity'),5);assert.equal(getQATarget('quality'),7);assert.equal(getQATarget('performance'),8);assert.equal(getQATarget('bad'),null);});
test('Mount works with no links or callbacks',()=>{let stop=mountConclusionSlide({querySelectorAll:()=>[]});assert.equal(typeof stop,'function');stop();});
