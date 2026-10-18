import {renderLab,mountLab} from './simulation/lab.js';
import {slides} from './presentation/registry.js';
import {parseRoute, slideHash} from './router.js';
import {renderOpening} from './presentation/slide-01.js';
import {startOpeningRouteAnimation} from './presentation/route-animation.js';
import {renderSTSP, mountSTSP} from './presentation/slide-02.js';
import {renderMechanism, mountMechanism} from './presentation/slide-03.js';
import {renderMathSlide, mountMathSlide} from './presentation/slide-04.js';
import {renderAnalysis, mountAnalysis} from './presentation/slide-05.js';
import {renderQualitySlide, mountQualitySlide} from './presentation/slide-07.js';
import {renderPerformanceSlide, mountPerformanceSlide} from './presentation/slide-08.js';
import {renderSynthesisSlide, mountSynthesisSlide} from './presentation/slide-09.js';
import {renderConclusionSlide,mountConclusionSlide} from './presentation/slide-10.js';

const $ = id => document.getElementById(id);
const state = {lastSlide:1, notesOpen:false};
const icon = `<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="9" cy="13" r="4"/><circle cx="45" cy="12" r="4"/><circle cx="45" cy="44" r="4"/><circle cx="11" cy="45" r="4"/><path d="M13 13 L41 12 L45 40 L15 45 Z M9 17 L11 41"/></svg>`;
let route = parseRoute(location.hash, slides.length);
let stopOpeningAnimation = null;
let stopStsp = null;
let stopMechanism = null;
let stopMath = null;
let stopAnalysis = null;
let stopQuality = null;
let stopPerformance = null;
let stopSynthesis = null;
let stopConclusion = null;
let stopLab = null;

function render() {
  stopOpeningAnimation?.();
  stopOpeningAnimation = null;
  stopStsp?.();
  stopStsp = null;
  stopMechanism?.();
  stopMechanism = null;
  stopMath?.();
  stopMath = null;
  stopAnalysis?.();
  stopAnalysis = null;
  stopQuality?.();
  stopQuality = null;
  stopPerformance?.();
  stopPerformance = null;
  stopSynthesis?.();
  stopSynthesis = null;
  stopConclusion?.();
  stopConclusion = null;
  stopLab?.();
  stopLab = null;
  route = parseRoute(location.hash, slides.length);
  const inLab = route.type === 'lab';
  $('slide-controls').hidden = inLab;
  $('notes-button').hidden = inLab;
  $('lab-button').textContent = inLab ? 'Presentasi ↩' : 'Lab ↗';
  if (inLab) {
    state.notesOpen = false;
    $('main-content').innerHTML = renderLab();
    stopLab = mountLab($('main-content'));
    // Preserve return-to-slide navigation through the existing footer button.

  } else {
    state.lastSlide = route.number;
    const slide = slides[route.number - 1];
    $('main-content').innerHTML = `<article class="slide-content" aria-labelledby="slide-title"><p class="eyebrow">Analisis Algoritma Komputasi · Slide ${String(route.number).padStart(2,'0')}</p><h1 id="slide-title" class="slide-title"></h1><p class="slide-description"></p><div class="placeholder">${icon}<strong>Konten akademik akan dibangun bertahap</strong><p>Tahap Foundation V2.0 — ${String(route.number).padStart(2,'0')} / 10</p></div><div class="slide-stamp">Ant System · Ant-Cycle · STSP</div></article>`;
    if (route.number === 1) {
      $('main-content').innerHTML = renderOpening();
      stopOpeningAnimation = startOpeningRouteAnimation($('main-content'));
    } else if (route.number === 2) {
      $('main-content').innerHTML = renderSTSP();
      stopStsp = mountSTSP($('main-content'));
    } else if (route.number === 3) {
      $('main-content').innerHTML = renderMechanism();
      stopMechanism = mountMechanism($('main-content'));
    } else if (route.number === 4) {
      $('main-content').innerHTML = renderMathSlide();
      stopMath = mountMathSlide($('main-content'));
    } else if (route.number === 5) {
      $('main-content').innerHTML = renderAnalysis();
      stopAnalysis = mountAnalysis($('main-content'));
    } else if (route.number === 7) {
      $('main-content').innerHTML = renderQualitySlide();
      stopQuality = mountQualitySlide($('main-content'));
    } else if (route.number === 8) {
      $('main-content').innerHTML = renderPerformanceSlide();
      stopPerformance = mountPerformanceSlide($('main-content'));
    } else if (route.number === 9) {
      $('main-content').innerHTML = renderSynthesisSlide();
      stopSynthesis = mountSynthesisSlide($('main-content'));
    } else if (route.number === 10) {
      $('main-content').innerHTML = renderConclusionSlide();
      stopConclusion = mountConclusionSlide($('main-content'), {navigate: n => location.hash = slideHash(n), openLab: () => location.hash='#/lab'});
    } else if (route.number === 6) {
      $('main-content').innerHTML = renderLab({embedded:true});
      stopLab = mountLab($('main-content'),{openLab:()=>{location.hash='#/lab';}});
    } else {
    $('slide-title').textContent = slide.title;
    $('main-content').querySelector('.slide-description').textContent = slide.description;
    }
    $('slide-counter').textContent = `${String(route.number).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    $('previous').disabled = route.number === 1;
    $('next').disabled = route.number === slides.length;
    $('notes-content').textContent = slide.notes;
  }
  $('notes-panel').hidden = !state.notesOpen || inLab;
  $('notes-button').setAttribute('aria-expanded', String(state.notesOpen && !inLab));
  $('fullscreen-button').textContent = document.fullscreenElement ? 'Keluar fullscreen' : 'Fullscreen';
  document.title = inLab ? 'Simulation Lab — Ant System' : `${String(route.number).padStart(2,'0')} · ${slides[route.number-1].title} — Ant System`;
}
function navigateToSlide(number) {
  if (route.type !== 'slide') return;
  if (number < 1 || number > slides.length) return;
  location.hash = slideHash(number);
}
function backToPresentation() {location.hash = slideHash(state.lastSlide);}
function toggleLab() {if (route.type === 'lab') backToPresentation(); else location.hash = '#/lab';}
function setNotes(open) {state.notesOpen = open && route.type === 'slide'; $('notes-panel').hidden = !state.notesOpen; $('notes-button').setAttribute('aria-expanded', String(state.notesOpen));}
async function toggleFullscreen() {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch (error) { console.warn('Fullscreen tidak tersedia atau ditolak:', error); }
  $('fullscreen-button').textContent = document.fullscreenElement ? 'Keluar fullscreen' : 'Fullscreen';
}
$('previous').addEventListener('click', () => navigateToSlide(route.number-1));
$('next').addEventListener('click', () => navigateToSlide(route.number+1));
$('notes-button').addEventListener('click', () => setNotes(!state.notesOpen));
$('notes-close').addEventListener('click', () => setNotes(false));
$('lab-button').addEventListener('click', toggleLab);
$('fullscreen-button').addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => { $('fullscreen-button').textContent = document.fullscreenElement ? 'Keluar fullscreen' : 'Fullscreen'; });
window.addEventListener('hashchange', render);
document.addEventListener('keydown', event => {
  // Native modal dialog owns keyboard interaction while open.
  if (document.querySelector('dialog[open]')) return;
  const target = event.target;
  if (target instanceof Element && (target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]') || target.isContentEditable)) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const key = event.key.toLowerCase();
  if (event.key === 'Escape') { if (state.notesOpen) {setNotes(false);event.preventDefault();} return; }
  if (key === 'f') {event.preventDefault();toggleFullscreen();return;}
  if (key === 'p') {event.preventDefault();setNotes(!state.notesOpen);return;}
  if (key === 'l') {event.preventDefault();toggleLab();return;}
  if (route.type !== 'slide') return;
  if (event.key === 'ArrowRight') {event.preventDefault();navigateToSlide(route.number+1);}
  if (event.key === 'ArrowLeft') {event.preventDefault();navigateToSlide(route.number-1);}
});
if (!location.hash || parseRoute(location.hash, slides.length).type === 'slide' && !/^#\/(?:slide\/)?(?:[1-9]|10)$/.test(location.hash)) {
  history.replaceState(null, '', `${location.pathname}${location.search}${slideHash(1)}`);
}
render();
