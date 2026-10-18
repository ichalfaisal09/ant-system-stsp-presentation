import {V04, ROUTE_MODES, routeValidation, tourLength, exactOptimalTour, cityLetter, describeRoute} from './stsp-example.js';

const pts = [[95,85],[365,78],[380,270],[115,280]];
const coords = i=>pts[i].join(',');
// Each undirected edge has one fixed weight label, placed away from city nodes and crossings.
const weightLabelPositions = {'0-1':[230,61], '0-2':[197,164], '0-3':[78,184], '1-2':[410,176], '1-3':[281,149], '2-3':[250,302]};
function graphMarkup(){
  const edges=[];
  for(let a=0;a<4;a++)for(let b=a+1;b<4;b++){
    const [x1,y1]=pts[a], [x2,y2]=pts[b];
    const [mx,my]=weightLabelPositions[`${a}-${b}`];
    edges.push(`<g class="stsp-base-edge"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text class="stsp-weight-label" x="${mx}" y="${my}">${V04[a][b]}</text></g>`);
  }
  const nodes=pts.map(([x,y],i)=>`<g class="stsp-city" transform="translate(${x},${y})"><circle r="24"/><text y="7">${cityLetter(i)}</text></g>`).join('');
  return `<svg class="stsp-graph" viewBox="0 0 460 355" role="img" aria-label="Graf lengkap simetris empat kota A, B, C, D. Garis berwarna menunjukkan rute pilihan, angka menunjukkan bobot jarak."><g>${edges.join('')}</g><polyline id="stsp-route-line" points="" fill="none"/><g>${nodes}</g></svg>`;
}
export function renderSTSP(){
 return `<article class="slide-content stsp-slide" aria-labelledby="slide-title">
  <p class="eyebrow">Analisis Algoritma Komputasi · Slide 02</p>
  <div class="stsp-heading"><div><h1 id="slide-title" class="stsp-title">Permasalahan <em>STSP</em></h1><p class="stsp-intro">Temukan <strong>siklus Hamilton terpendek</strong> pada graf lengkap dengan jarak simetris.</p></div><div class="stsp-type">d(A,B) = d(B,A)<span>Jarak dua arah bernilai sama</span></div></div>
  <div class="stsp-grid">
   <section class="stsp-graph-card" aria-label="Demonstrasi interaktif rute"><div class="stsp-card-heading"><strong>GRAF EMPAT KOTA · V-04</strong><span>Bobot pada sisi = jarak</span></div>${graphMarkup()}
     <div class="stsp-options" role="group" aria-label="Pilih jenis rute"><button type="button" data-stsp-mode="optimal" aria-pressed="true">Optimal</button><button type="button" data-stsp-mode="nonoptimal" aria-pressed="false">Valid nonoptimal</button><button type="button" data-stsp-mode="invalid" aria-pressed="false">Tidak valid</button></div>
   </section>
   <section class="stsp-info-card" aria-live="polite"><div class="stsp-card-heading"><strong>PEMERIKSAAN RUTE</strong><span id="stsp-validity" class="stsp-status"></span></div>
     <p id="stsp-route-sequence" class="stsp-sequence"></p><div class="stsp-distance-title">Total jarak</div><div class="stsp-distance" id="stsp-distance"></div><p class="stsp-addition" id="stsp-addition"></p><p class="stsp-explanation" id="stsp-explanation"></p>
     <div class="stsp-objective"><span>FUNGSI OBJEKTIF</span><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>L</mi><mo>(</mo><mi>π</mi><mo>)</mo><mo>=</mo><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mrow><mi>n</mi><mo>−</mo><mn>1</mn></mrow></munderover><msub><mi>d</mi><mrow><msub><mi>π</mi><mi>i</mi></msub><mo>,</mo><msub><mi>π</mi><mrow><mi>i</mi><mo>+</mo><mn>1</mn></mrow></msub></mrow></msub><mo>+</mo><msub><mi>d</mi><mrow><msub><mi>π</mi><mi>n</mi></msub><mo>,</mo><msub><mi>π</mi><mn>1</mn></msub></mrow></msub></mrow></math><small>Minimalkan jarak seluruh sisi termasuk kembali ke kota awal.</small></div>
   </section>
  </div>
  <div class="stsp-footnote"><div><b>Valid ≠ optimal.</b> Semua kota harus dikunjungi tepat sekali, lalu kembali ke kota awal.</div><button type="button" id="stsp-matrix-toggle" aria-expanded="false" aria-controls="stsp-matrix">Lihat matriks jarak ↓</button></div>
  <dialog id="stsp-matrix" class="stsp-matrix" aria-labelledby="stsp-matrix-title" aria-describedby="stsp-matrix-help"><div class="stsp-matrix-header"><h2 id="stsp-matrix-title">Matriks jarak V-04</h2><button type="button" class="stsp-matrix-close" id="stsp-matrix-close" aria-label="Tutup matriks jarak">×</button></div><p class="stsp-matrix-subtitle">Matriks simetris · empat kota</p><table><caption class="sr-only">Matriks jarak V-04 (simetris)</caption><thead><tr><th></th>${['A','B','C','D'].map(l=>`<th scope="col">${l}</th>`).join('')}</tr></thead><tbody>${V04.map((row,i)=>`<tr><th scope="row">${cityLetter(i)}</th>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table><p id="stsp-matrix-help">Contoh edukatif V-04. Jarak dihitung dari matriks, bukan koordinat gambar. Tidak diperlukan asumsi ketaksamaan segitiga.</p></dialog>
  <div class="slide-stamp">STSP · Graf simetris · Siklus Hamilton · Optimasi kombinatorial</div>
 </article>`;
}
export function mountSTSP(root){
 let mode='optimal';
 const $=selector=>root.querySelector(selector);
 const buttons=[...root.querySelectorAll('[data-stsp-mode]')];
 function paint(){
  const selection=ROUTE_MODES[mode], route=selection.route;
  const valid=routeValidation(route); const length=tourLength(route);
  const optimal=exactOptimalTour();
  const line=$('#stsp-route-line');
  line.setAttribute('points',route.map(i=>coords(i)).join(' '));
  line.classList.toggle('invalid', !valid.valid);
  $('#stsp-route-sequence').textContent=describeRoute(route);
  $('#stsp-validity').textContent=valid.valid?(length===optimal.length?'VALID · OPTIMAL':'VALID · NONOPTIMAL'):'TIDAK VALID';
  $('#stsp-validity').classList.toggle('invalid', !valid.valid);
  $('#stsp-distance').textContent=valid.valid?`${length} satuan`:'Tidak berlaku';
  $('#stsp-addition').textContent=valid.valid?route.slice(1).map((to,i)=>V04[route[i]][to]).join(' + ')+` = ${length}`:'Rute tidak memenuhi syarat siklus Hamilton.';
  $('#stsp-explanation').textContent=selection.description;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.stspMode===mode)));
 }
 const onClick=e=>{const button=e.target.closest('[data-stsp-mode]');if(button){mode=button.dataset.stspMode;paint();}};
 const dialog=$('#stsp-matrix');
 const toggle=$('#stsp-matrix-toggle');
 const closeButton=$('#stsp-matrix-close');
 const onToggle=()=>{if(dialog.open) dialog.close();else dialog.showModal();};
 const onClose=()=>{toggle.setAttribute('aria-expanded','false');toggle.textContent='Lihat matriks jarak ↓';toggle.focus();};
 const onOpen=()=>{toggle.setAttribute('aria-expanded','true');toggle.textContent='Tutup matriks jarak ↑';};
 const onBackdropClick=e=>{if(e.target===dialog) dialog.close();};
 const onDialogKey=e=>{if(['ArrowLeft','ArrowRight','f','F','l','L','p','P'].includes(e.key)){e.stopPropagation();}};
 root.addEventListener('click',onClick);
 toggle.addEventListener('click',()=>{onToggle();if(dialog.open)onOpen();});
 closeButton.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',onClose);
 dialog.addEventListener('click',onBackdropClick);
 dialog.addEventListener('keydown',onDialogKey);
 paint();
 return ()=>{if(dialog.open)dialog.close();root.removeEventListener('click',onClick);dialog.removeEventListener('close',onClose);dialog.removeEventListener('click',onBackdropClick);dialog.removeEventListener('keydown',onDialogKey);};
}
