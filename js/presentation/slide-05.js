import {ANALYSIS_GROUPS,PSEUDOCODE,complexityComponents,bestSoFar} from './analysis-model.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function renderAnalysis(){return `<article class="slide-content as5-slide" aria-labelledby="slide-title">
 <p class="eyebrow">Analisis Algoritma Komputasi · Slide 05</p>
 <div class="as5-header"><div><h1 id="slide-title">Analisis <em>Algoritma</em></h1><p>Bagaimana tur tetap valid, algoritma berhenti, dan biaya komputasi bertumbuh?</p></div><div class="as5-tag">Ant System · Ant-Cycle · STSP</div></div>
 <div class="as5-tabs" role="tablist" aria-label="Aspek analisis">
  <button role="tab" id="as5-tab-code" aria-controls="as5-panel-code" aria-selected="true" data-as5-tab="code">01 · Pseudocode</button>
  <button role="tab" id="as5-tab-proof" aria-controls="as5-panel-proof" aria-selected="false" data-as5-tab="proof">02 · Kebenaran & terminasi</button>
  <button role="tab" id="as5-tab-cost" aria-controls="as5-panel-cost" aria-selected="false" data-as5-tab="cost">03 · Kompleksitas</button>
 </div>
 <section class="as5-panel" role="tabpanel" id="as5-panel-code" aria-labelledby="as5-tab-code">
  <div class="as5-card as5-code-pane"><div class="as5-card-head">PSEUDOCODE INTI <span>Urutan sesuai Ant System–Ant-Cycle</span></div>
  <div class="as5-code" aria-label="Pseudocode Ant System">${PSEUDOCODE.map(([n,line])=>`<div class="as5-code-line" data-as5-line="${n}"><span>${String(n).padStart(2,'0')}</span><code>${esc(line)}</code></div>`).join('')}</div></div>
  <div class="as5-card as5-info-pane"><div class="as5-card-head">SOROT TAHAP <span>Pilih kelompok baris</span></div>
   <div class="as5-group-buttons">${ANALYSIS_GROUPS.map((g,i)=>`<button data-as5-group="${g.id}" aria-pressed="${i===0}">${g.title}</button>`).join('')}</div>
   <div class="as5-group-detail"><small id="as5-group-title"></small><p id="as5-group-info"></p></div>
   <div class="as5-critical"><b>Aturan pembaruan global</b><p>Semua m semut menyelesaikan tur menggunakan τ(t) yang sama. Setelah itu evaporasi dilakukan sekali, lalu seluruh semut mendepositkan Q/Lₖ, termasuk sisi kembali ke awal.</p></div>
   <div class="as5-keyline">Tidak ada local update, elitism, ACS, MMAS, atau 2-opt.</div>
  </div>
 </section>
 <section class="as5-panel" role="tabpanel" id="as5-panel-proof" aria-labelledby="as5-tab-proof" hidden>
  <div class="as5-card"><div class="as5-card-head">INVARIANT KONSTRUKSI <span>Setiap kota tepat satu kali</span></div>
   <div class="as5-invariants">
    <div><span>01</span><b>Tidak mengulang kota</b><p>Kandidat selalu berasal dari himpunan kota yang belum dikunjungi.</p></div>
    <div><span>02</span><b>Konstruksi maju</b><p>Setiap langkah menambah tepat satu kota. Sesudah n−1 langkah, semua n kota tercakup.</p></div>
    <div><span>03</span><b>Best-so-far tidak memburuk</b><p>Perbarui nilai terbaik hanya jika kandidat baru lebih pendek.</p></div>
   </div>
   <div class="as5-proof-banner"><strong>Tur Hamilton valid</strong><span>Seluruh kota dikunjungi sekali, kemudian ditutup dengan sisi kembali ke kota awal.</span></div>
  </div>
  <div class="as5-card as5-proof-right"><div class="as5-card-head">DEMONSTRASI INVARIANT <span>V-04 · dua tur</span></div>
   <div class="as5-best-visual"><div>Tur 1 <strong>13</strong></div><div>Tur 2 <strong>18</strong></div><div>Best-so-far <strong id="as5-best-value">13</strong></div></div>
   <button class="as5-primary" id="as5-replay-proof">↺ Ulang demonstrasi</button>
   <div class="as5-proof-progress" id="as5-proof-progress" aria-live="polite">Tur 1: best = 13. Tur 2: best tetap 13.</div>
   <div class="as5-termination"><strong>Terminasi</strong><p>T iterasi × m semut × jumlah langkah konstruksi terbatas. Dengan input valid, proses berakhir.</p></div>
   <p class="as5-caveat">Pembuktian validitas dan terminasi <b>bukan</b> bukti bahwa Ant System selalu mencapai optimum global.</p>
  </div>
 </section>
 <section class="as5-panel" role="tabpanel" id="as5-panel-cost" aria-labelledby="as5-tab-cost" hidden>
  <div class="as5-card"><div class="as5-card-head">DERIVASI WAKTU <span>Implementasi inti penelitian</span></div>
   <div class="as5-cost-steps"><div><strong>1 tur</strong><span>n−1 pilihan · hingga n−1 kandidat per pilihan</span><b>Θ(n²)</b></div><div><strong>m semut</strong><span>Ulangi konstruksi untuk seluruh semut</span><b>Θ(mn²)</b></div><div><strong>T iterasi</strong><span>Ulangi konstruksi, evaluasi, evaporasi, dan deposisi selama T iterasi</span><b>Θ(Tmn²)</b></div></div>
   <div class="as5-formula"><span>WAKTU TOTAL</span><strong>Θ(T · m · n²)</strong></div>
  </div>
  <div class="as5-card"><div class="as5-card-head">DERIVASI RUANG <span>Tanpa penyimpanan trace UI</span></div>
   <div class="as5-space"><div><span>Matriks D, τ, η</span><b>Θ(n²)</b></div><div><span>Tur dan panjang m semut</span><b>Θ(mn)</b></div><div><span>Rute terbaik & penanda kandidat</span><b>O(n)</b></div></div>
   <div class="as5-formula"><span>RUANG TOTAL</span><strong>Θ(n² + m · n)</strong></div>
   <div class="as5-caveat as5-space-note">Riwayat animasi penuh pada Simulation Lab dapat memakai memori tambahan; tidak termasuk batas ruang algoritma inti.</div>
  </div>
 </section>
 <div class="as5-bottom"><span><b>Kesimpulan:</b> tur valid & terminasi terjamin untuk input valid; optimum global tidak dijamin.</span><span>n = kota · m = semut · T = iterasi</span></div>
 <div class="slide-stamp">AS · correctness · termination · complexity</div></article>`;}
const descriptions={setup:'Validasi matriks STSP dan parameter, kemudian siapkan feromon τ, heuristik η, dan solusi terbaik.',construct:'Dalam satu iterasi, semua semut memilih kota yang belum dikunjungi; setiap semut memakai τ(t) yang sama.',evaluate:'Setelah semua kota tercakup, tutup tur, hitung panjangnya, dan perbarui best-so-far jika lebih pendek.',pheromone:'Evaporasi satu kali pada seluruh sisi, lalu semua semut menyumbang Q/Lₖ pada sisi tur masing-masing.'};
export function mountAnalysis(root){
 let active='code',proofTimer=null;
 const $=s=>root.querySelector(s);
 const tabs=[...root.querySelectorAll('[data-as5-tab]')];
 const groups=[...root.querySelectorAll('[data-as5-group]')];
 let group='setup';
 function chooseTab(id){active=id;tabs.forEach(btn=>{const on=btn.dataset.as5Tab===id;btn.setAttribute('aria-selected',String(on));btn.tabIndex=on?0:-1;});['code','proof','cost'].forEach(s=>{$(`#as5-panel-${s}`).hidden=s!==id;});}
 function chooseGroup(id){group=id;const g=ANALYSIS_GROUPS.find(x=>x.id===id);groups.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.as5Group===id)));root.querySelectorAll('[data-as5-line]').forEach(el=>el.classList.toggle('is-highlight',g.lines.includes(Number(el.dataset.as5Line))));$('#as5-group-title').textContent=g.title.toUpperCase();$('#as5-group-info').textContent=descriptions[id];}
 function replay(){if(proofTimer!==null)clearTimeout(proofTimer);$('#as5-proof-progress').textContent='Tur 1: panjang 13 → best diperbarui menjadi 13.';const history=bestSoFar([13,18]);$('#as5-best-value').textContent=history[0];proofTimer=setTimeout(()=>{$('#as5-proof-progress').textContent='Tur 2: panjang 18 → best tetap 13 (tidak meningkat).';$('#as5-best-value').textContent=history[1];proofTimer=null;},1100);}
 const handlers=[];function on(el,type,fn){el.addEventListener(type,fn);handlers.push([el,type,fn]);}
 tabs.forEach((btn,i)=>{on(btn,'click',()=>chooseTab(btn.dataset.as5Tab));on(btn,'keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];chooseTab(next.dataset.as5Tab);next.focus();}});});
 groups.forEach(btn=>on(btn,'click',()=>chooseGroup(btn.dataset.as5Group)));
 on($('#as5-replay-proof'),'click',replay);
 chooseTab('code');chooseGroup('setup');
 return ()=>{if(proofTimer!==null)clearTimeout(proofTimer);handlers.forEach(([el,event,fn])=>el.removeEventListener(event,fn));};
}
