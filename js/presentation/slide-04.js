import {V04} from './stsp-example.js';
import {transitionProbabilities,examplePheromone} from './as-math.js';
const cities=['A','B','C','D'];
const nodes=[[82,65],[348,65],[348,242],[82,242]];
const fmt=(v,d=3)=>v.toLocaleString('id-ID',{minimumFractionDigits:0,maximumFractionDigits:d});
function mathGraph(){
 const lines=[];
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
  const [x1,y1]=nodes[i],[x2,y2]=nodes[j];lines.push(`<line class="as4-edge" data-edge="${i}-${j}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
 }
 const dots=nodes.map(([x,y],i)=>`<g class="as4-node ${i===0?'as4-start':''}"><circle cx="${x}" cy="${y}" r="23"/><text x="${x}" y="${y+6}">${cities[i]}</text></g>`).join('');
 return `<svg viewBox="0 0 430 300" class="as4-svg" role="img" aria-label="Graf V-04 dan bobot probabilitas atau feromon pada setiap sisi">${lines.join('')}<g id="as4-overlay"></g>${dots}</svg>`;
}
const probEq=String.raw`p_{ij}^{k}(t)=\frac{[\tau_{ij}(t)]^{\alpha}[1/d_{ij}]^{\beta}}{\sum_{l\in J_i^k(t)}[\tau_{il}(t)]^{\alpha}[1/d_{il}]^{\beta}}`;
const updateEq=String.raw`\tau_{ij}(t+1)=(1-\rho)\tau_{ij}(t)+\sum_{k=1}^{m}\Delta\tau_{ij}^{k}(t)`;
function probabilityPane(){return `<div class="as4-calc-head"><strong>Dari kota A → kandidat belum dikunjungi</strong><span>τ AB = τ AC = τ AD = 1</span></div>
<div class="as4-controls"><label>α <output id="as4-alpha-out">1</output><input id="as4-alpha" type="range" min="0" max="4" step="0.5" value="1"></label><label>β <output id="as4-beta-out">2</output><input id="as4-beta" type="range" min="0" max="5" step="0.5" value="2"></label><button type="button" id="as4-reset">Atur ulang</button></div>
<div class="as4-table-wrap"><table class="as4-table"><thead><tr><th>Kandidat</th><th>Jarak d</th><th>Heuristik η</th><th>Bobot relatif</th><th>Probabilitas</th></tr></thead><tbody id="as4-prob-rows"></tbody></table></div>
<div class="as4-prob-summary"><span id="as4-prob-sum">Σ p = 100%</span><strong id="as4-prob-best">B paling mungkin</strong></div>
<p class="as4-footnote" id="as4-alpha-note">Karena feromon masih seragam, perubahan α saja tidak mengubah peluang.</p>`;}
function updatePane(){return `<div class="as4-calc-head"><strong>Contoh manual Ant-Cycle · dua semut</strong><span>ρ = 0,5 · Q = 12 · τ₀ = 1</span></div>
<div class="as4-tour-cards"><div><small>Semut 1 · L₁ = 13</small><strong>A–B–C–D–A</strong><span>Deposit per sisi: 12/13 = 0,923</span></div><div><small>Semut 2 · L₂ = 18</small><strong>A–D–B–C–A</strong><span>Deposit per sisi: 12/18 = 0,667</span></div></div>
<div class="as4-table-wrap"><table class="as4-table"><thead><tr><th>Sisi</th><th>Evaporasi</th><th>Deposit 1</th><th>Deposit 2</th><th>τ(t+1)</th></tr></thead><tbody id="as4-tau-rows"></tbody></table></div>
<p class="as4-footnote">Semua semut memakai τ(t) yang sama sampai tur lengkap. Pembaruan global dilakukan sekali per iterasi; sisi kembali ke A ikut dihitung.</p>`;}
export function renderMathSlide(){return `<article class="slide-content as4-slide" aria-labelledby="slide-title"><p class="eyebrow">Analisis Algoritma Komputasi · Slide 04</p><div class="as4-heading"><div><h1 id="slide-title">Model <em>Matematis</em> Ant System</h1><p>Probabilitas transisi dan pembaruan feromon Ant-Cycle pada instance V-04.</p></div><span>ACO · Ant System · Ant-Cycle</span></div>
<div class="as4-tabs" role="tablist" aria-label="Pilih konsep matematis"><button role="tab" type="button" aria-selected="true" id="as4-tab-prob" aria-controls="as4-panel">01 · Probabilitas transisi</button><button role="tab" type="button" aria-selected="false" id="as4-tab-update" aria-controls="as4-panel">02 · Pembaruan feromon</button></div>
<div class="as4-grid"><section class="as4-visual"><div class="as4-card-title"><strong>GRAF STSP · V-04</strong><span id="as4-graph-label">Posisi semut: A</span></div>${mathGraph()}<div class="as4-visual-legend" id="as4-legend">Garis menunjukkan peluang memilih kota berikutnya; lebih terang berarti peluang lebih tinggi.</div><div class="as4-equation"><strong id="as4-eq-name">PROBABILITAS TRANSISI</strong><div class="as4-equation-body" id="as4-equation-body"><span class="as4-eq-text">pᵏᵢⱼ(t) = [τᵢⱼ(t)]<sup>α</sup>[ηᵢⱼ]<sup>β</sup> / Σ<sub>l∈J</sub> [τᵢₗ(t)]<sup>α</sup>[ηᵢₗ]<sup>β</sup></span></div><small id="as4-eq-caption">ηᵢⱼ = 1/dᵢⱼ; J adalah kandidat yang belum dikunjungi.</small></div></section>
<section class="as4-calculations" id="as4-panel" role="tabpanel" aria-live="polite">${probabilityPane()}</section></div><div class="as4-footer"><span>Contoh perhitungan pendidikan, bukan hasil eksperimen Python. Angka berasal dari matriks V-04.</span><span id="as4-mode-status">Probabilitas setiap kandidat dijumlahkan menjadi 1.</span></div></article>`;}
export function mountMathSlide(root){
 const get=id=>root.querySelector('#'+id);
 const pane=get('as4-panel'),graph=get('as4-overlay');
 let mode='prob';let alpha=1,beta=2;
 const tau=examplePheromone();
 const edges=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)edges.push([i,j]);
 function drawProbability(){
  const rows=transitionProbabilities(V04,0,[1,2,3],null,alpha,beta);
  graph.innerHTML=rows.map(r=>{const [x1,y1]=nodes[0],[x2,y2]=nodes[r.city];return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#83d4ff" stroke-width="${(2+10*r.probability).toFixed(2)}" opacity="${(0.35+0.65*r.probability).toFixed(2)}" stroke-linecap="round"/>`;}).join('');
  get('as4-prob-rows').innerHTML=rows.map(r=>`<tr><th>A → ${cities[r.city]}</th><td>${r.d}</td><td>${fmt(r.eta,4)}</td><td>${fmt(Math.pow(r.tau,alpha)*Math.pow(r.eta,beta),5)}</td><td><div class="as4-meter"><span style="width:${(100*r.probability).toFixed(2)}%"></span></div><b>${fmt(100*r.probability,2)}%</b></td></tr>`).join('');
  const total=rows.reduce((s,r)=>s+r.probability,0);
  get('as4-prob-sum').textContent=`Σ p = ${fmt(100*total,2)}%`;
  const max=rows.reduce((a,b)=>a.probability>=b.probability?a:b);
  get('as4-prob-best').textContent=`Peluang terbesar: kota ${cities[max.city]} (${fmt(max.probability*100,2)}%)`;
  get('as4-alpha-out').textContent=fmt(alpha,1);get('as4-beta-out').textContent=fmt(beta,1);
  get('as4-alpha-note').textContent='Karena feromon tiap sisi masih seragam (τ=1), perubahan α saja tidak mengubah probabilitas. β mengatur pengaruh jarak.';
 }
 function drawUpdate(){
  const d1=12/13,d2=12/18;
  graph.innerHTML=edges.map(([i,j])=>{const [x1,y1]=nodes[i],[x2,y2]=nodes[j];const val=tau[i][j];return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#90ddff" stroke-width="${(2+6*(val-0.5)/(2.0897435897-0.5)).toFixed(2)}" opacity="${(0.30+0.7*(val-0.5)/(2.0897435897-0.5)).toFixed(2)}" stroke-linecap="round"/>`;}).join('');
  const used1=new Set(['0-1','1-2','2-3','0-3']);const used2=new Set(['0-3','1-3','1-2','0-2']);
  get('as4-tau-rows').innerHTML=edges.map(([i,j])=>{const key=`${i}-${j}`;return `<tr><th>${cities[i]}–${cities[j]}</th><td>0,5</td><td>${used1.has(key)?fmt(d1):'0'}</td><td>${used2.has(key)?fmt(d2):'0'}</td><td><b>${fmt(tau[i][j])}</b></td></tr>`;}).join('');
 }
 function paint(){
  root.querySelector('.as4-slide')?.classList.toggle('as4-update-mode',mode==='update');
  get('as4-tab-prob').setAttribute('aria-selected',String(mode==='prob'));
  get('as4-tab-update').setAttribute('aria-selected',String(mode==='update'));
  pane.innerHTML=mode==='prob'?probabilityPane():updatePane();
  get('as4-graph-label').textContent=mode==='prob'?'Posisi semut: A':'τ(t+1) setelah semua semut selesai';
  get('as4-eq-name').textContent=mode==='prob'?'PROBABILITAS TRANSISI':'PEMBARUAN GLOBAL ANT-CYCLE';
  get('as4-equation-body').innerHTML=mode==='prob'?'<span class="as4-eq-text">pᵏᵢⱼ(t) = τᵢⱼ<sup>α</sup> ηᵢⱼ<sup>β</sup> / Σ<sub>l∈J</sub> τᵢₗ<sup>α</sup> ηᵢₗ<sup>β</sup></span>':'<span class="as4-eq-text">τᵢⱼ(t+1) = (1−ρ)τᵢⱼ(t) + Σ<sub>k=1..m</sub> Δτᵏᵢⱼ</span>';
  get('as4-eq-caption').textContent=mode==='prob'?'ηᵢⱼ = 1/dᵢⱼ; J adalah kandidat yang belum dikunjungi.':'Δτᵏᵢⱼ = Q/Lₖ jika sisi dilalui semut k; lainnya 0.';
  get('as4-legend').textContent=mode==='prob'?'Garis yang lebih terang dan tebal menunjukkan probabilitas transisi lebih besar.':'Ketebalan sisi mengikuti intensitas feromon sesudah evaporasi dan deposisi global.';
  get('as4-mode-status').textContent=mode==='prob'?'Probabilitas semua kandidat berjumlah 1.':'Contoh khusus Q=12, berbeda dari baseline penelitian Q=100.';
  if(mode==='prob'){
   get('as4-alpha').value=alpha;get('as4-beta').value=beta;
   drawProbability();
  }else drawUpdate();
 }
 const onClick=e=>{
  const target=e.target.closest('button');if(!target)return;
  if(target.id==='as4-tab-prob'){mode='prob';paint();}
  else if(target.id==='as4-tab-update'){mode='update';paint();}
  else if(target.id==='as4-reset'){alpha=1;beta=2;paint();}
 };
 const onInput=e=>{if(e.target.id==='as4-alpha'){alpha=Number(e.target.value);drawProbability();}else if(e.target.id==='as4-beta'){beta=Number(e.target.value);drawProbability();}};
 root.addEventListener('click',onClick);root.addEventListener('input',onInput);paint();
 return ()=>{root.removeEventListener('click',onClick);root.removeEventListener('input',onInput);};
}
