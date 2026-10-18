import {DEMO_ROUTES,DEMO_MATRIX,STAGES,updatePheromone} from './ant-cycle-demo.js';
const cities=['A','B','C','D'];
const points=[[85,62],[349,62],[349,244],[85,244]];
const fmt=v=>Number(v.toFixed(3)).toLocaleString('id-ID',{maximumFractionDigits:3});
function graph(){
 const lines=[];
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
  const [a,b]=[points[i],points[j]];
  lines.push(`<line class="mechanism-edge" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`)
 }
 const nodes=points.map(([x,y],i)=>`<g class="mechanism-node"><circle cx="${x}" cy="${y}" r="23"/><text x="${x}" y="${y+6}">${cities[i]}</text></g>`).join('');
 return `<svg class="mechanism-graph" viewBox="0 0 434 305" aria-label="Contoh dua rute Ant System pada graf empat kota" role="img"><defs>
 <filter id="mechanismGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 </defs>${lines.join('')}<g id="mechanism-paths"></g><g id="mechanism-pheromone-labels"></g>${nodes}</svg>`;
}
export function renderMechanism(){return `<article class="slide-content mechanism-slide" aria-labelledby="slide-title"><p class="eyebrow">Analisis Algoritma Komputasi · Slide 03</p><div class="mechanism-head"><div><h1 class="mechanism-title" id="slide-title">Bagaimana <em>Ant System</em> bekerja?</h1><p>Dalam satu iterasi, <strong>semua semut menyelesaikan tur</strong> sebelum feromon diperbarui secara global.</p></div><div class="mechanism-tag">ACO · Ant System · Ant-Cycle</div></div>
<div class="mechanism-progress" role="group" aria-label="Tahapan algoritma">${STAGES.map((s,i)=>`<button class="mechanism-stage" data-stage="${i}" aria-pressed="${i===0}"><small>${String(i+1).padStart(2,'0')}</small><span>${s.title}</span></button>`).join('')}</div>
<div class="mechanism-grid"><section class="mechanism-visual"><div class="mechanism-card-head">ILUSTRASI V-04 <span>2 semut · demonstrasi deterministik</span></div>${graph()}<div class="mechanism-legend" id="mechanism-legend"><span><i class="legend-a"></i>Semut 1 · A–B–C–D–A</span><span><i class="legend-b"></i>Semut 2 · A–D–B–C–A</span></div><p id="mechanism-graph-caption" class="mechanism-caption"></p></section>
<section class="mechanism-explain" aria-live="polite"><div class="mechanism-mini" id="mechanism-phase"></div><h2 id="mechanism-step-title"></h2><p id="mechanism-description"></p><div class="mechanism-metrics" id="mechanism-metrics"></div><div class="mechanism-rule"><strong>Aturan Ant-Cycle</strong><p>τ(t) tetap selama seluruh proses konstruksi. Evaporasi dan deposisi dilakukan <b>setelah seluruh semut membentuk tur lengkap.</b></p></div></section></div>
<div class="mechanism-bottom"><div class="mechanism-navigation"><button type="button" id="mechanism-previous">← Tahap sebelumnya</button><span id="mechanism-index">1 / 6</span><button type="button" id="mechanism-next">Tahap berikutnya →</button><button type="button" id="mechanism-replay">↺ Ulangi</button></div><div class="mechanism-status">Contoh pembelajaran: ρ = 0,5 · Q = 12 · τ₀ = 1. <b>Bukan konfigurasi eksperimen utama (Q = 100).</b></div></div><div class="slide-stamp">AS · konstruksi → evaluasi → evaporasi → deposisi global</div></article>`;}
export function mountMechanism(root){
 let stage=0;
 const $=id=>root.querySelector('#'+id);
 const allButtons=[...root.querySelectorAll('[data-stage]')];
 const result=updatePheromone();
 const edgeIndex=new Map(['0-1','0-2','0-3','1-2','1-3','2-3'].map(key=>[key,0]));
 DEMO_ROUTES.forEach(route=>{
  for(let i=1;i<route.length;i++){
   const a=Math.min(route[i-1],route[i]);
   const b=Math.max(route[i-1],route[i]);
   const key=`${a}-${b}`;
   edgeIndex.set(key,(edgeIndex.get(key)||0)+1);
  }
 });
 const getEdgeKey=(i,j)=>`${Math.min(i,j)}-${Math.max(i,j)}`;
 const edgePath=(route,color,offset=0)=>{
  const seq=route.map(k=>points[k].join(',')).join(' ');
  return `<polyline points="${seq}" fill="none" stroke="${color}" stroke-width="${offset?4:6}" stroke-dasharray="${offset?'11 7':'none'}" stroke-linecap="round" stroke-linejoin="round" opacity="${offset?.92:1}"/>`;
 };
 const finalPheromonePaths=()=>{
  const edges=[];
  const labels=[];
  let maxTau=0;
  for(let i=0;i<DEMO_MATRIX.length;i++)for(let j=i+1;j<DEMO_MATRIX.length;j++) maxTau=Math.max(maxTau,result.tau[i][j]);
  for(let i=0;i<DEMO_MATRIX.length;i++){
   for(let j=i+1;j<DEMO_MATRIX.length;j++){
    const [a,b]=[points[i],points[j]];
    const tau=result.tau[i][j];
    const usage=edgeIndex.get(getEdgeKey(i,j))||0;
    if(!usage) continue;
    const ratio=tau/maxTau;
    // Encode the numerical tau, not the ant-route overlay, as thickness.
    const width=2+ratio*7.5;
    const opacity=0.2+ratio*0.8;
    const color=tau>2?'#b2efff':tau>1.3?'#6cbce6':'#45769c';
    edges.push({tau,markup:`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${width.toFixed(2)}" stroke-linecap="round" opacity="${opacity.toFixed(2)}" ${tau>2?'filter="url(#mechanismGlow)"':''}/>`});
    let mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
    let labelDx=0, labelDy=0;
    // Separate the two crossing diagonal labels; no ambiguity with the opposite side.
    if(i===0&&j===2){mx=a[0]*.68+b[0]*.32; my=a[1]*.68+b[1]*.32; labelDy=-16;}
    else if(i===1&&j===3){mx=a[0]*.68+b[0]*.32;my=a[1]*.68+b[1]*.32;labelDy=16;}
    else if(Math.abs(a[1]-b[1])<5)labelDy=-18;
    else labelDx=i===0?-22:22;
    labels.push(`<g class="mechanism-pheromone-label ${usage===2?'is-strong':''}" transform="translate(${mx+labelDx},${my+labelDy})"><rect x="-28" y="-13" width="56" height="22" rx="11"/><text x="0" y="4" text-anchor="middle">τ=${fmt(tau)}</text></g>`);
   }
  }
  return {edges:edges.sort((a,b)=>a.tau-b.tau).map(e=>e.markup).join(''),labels:labels.join('')};
 };
 function metrics(){
  if(stage===0)return '<div><small>Feromon awal tiap sisi</small><strong>τ(t) = 1</strong></div><div><small>Semut</small><strong>m = 2</strong></div>';
  if(stage===1)return '<div><small>Tur semut 1</small><strong>A–B–C–D–A</strong></div><div><small>Tur semut 2</small><strong>A–D–B–C–A</strong></div>';
  if(stage===2)return `<div><small>Panjang semut 1</small><strong>${result.lengths[0]}</strong></div><div><small>Panjang semut 2</small><strong>${result.lengths[1]}</strong></div>`;
  if(stage===3)return '<div><small>Evaporasi</small><strong>ρ = 0,5</strong></div><div><small>Feromon sesudah evaporasi</small><strong>0,5</strong></div>';
  if(stage===4)return '<div><small>Deposisi semut 1</small><strong>12/13 ≈ 0,923</strong></div><div><small>Deposisi semut 2</small><strong>12/18 ≈ 0,667</strong></div>';
  return `<div><small>Feromon terkuat</small><strong>A–D dan B–C = ${fmt(result.tau[0][3])}</strong></div><div><small>Best-so-far</small><strong>13 satuan</strong></div>`;
 }
 function paint(){
  const s=STAGES[stage];
  $('mechanism-step-title').textContent=s.title;
  $('mechanism-phase').textContent=s.tag;
  $('mechanism-description').textContent=s.description;
  $('mechanism-metrics').innerHTML=metrics();
  $('mechanism-index').textContent=`${stage+1} / ${STAGES.length}`;
  allButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===stage)));
  $('mechanism-previous').disabled=stage===0;
  $('mechanism-next').disabled=stage===STAGES.length-1;
  const path=$('mechanism-paths');
  const labels=$('mechanism-pheromone-labels');
  const legend=$('mechanism-legend');
  legend.innerHTML=stage===5?'<span><i class="legend-high"></i>Feromon tinggi · 2,090</span><span><i class="legend-mid"></i>Feromon sedang · 1,423</span><span><i class="legend-low"></i>Feromon rendah · 1,167</span>':'<span><i class="legend-a"></i>Semut 1 · A–B–C–D–A</span><span><i class="legend-b"></i>Semut 2 · A–D–B–C–A</span>';
  labels.innerHTML='';
  path.innerHTML=stage===0?'':stage===1?edgePath(DEMO_ROUTES[0],'#74caff')+edgePath(DEMO_ROUTES[1],'#ffa980',1):stage===2?edgePath(DEMO_ROUTES[0],'#74caff')+edgePath(DEMO_ROUTES[1],'#ffa980',1):stage===3?'':edgePath(DEMO_ROUTES[0],'#74caff')+edgePath(DEMO_ROUTES[1],'#ffa980',1);
  if(stage===3){
   path.innerHTML='<text x="217" y="148" text-anchor="middle" fill="#aee5ff" font-size="20" font-weight="700">τ × (1 − ρ)</text>';
  }
  if(stage===5){
   const finalState=finalPheromonePaths();
   path.innerHTML=finalState.edges;
   labels.innerHTML=finalState.labels;
  }
  $('mechanism-graph-caption').textContent=stage===0?'Graf lengkap, feromon awal sama pada seluruh sisi.':stage===1?'Kedua tur ditampilkan sebagai contoh selesai; pemilihan probabilistik tidak disimulasikan di sini.':stage===2?'Semua tur sudah lengkap sebelum pembaruan feromon.':stage===3?'Evaporasi dilakukan satu kali untuk seluruh sisi.':stage===4?'Setiap semut menyumbang Q/L pada seluruh sisi yang dilewati.':'Ketebalan dan cahaya sisi merepresentasikan besar feromon τ(t+1); A–D dan B–C paling kuat karena dilalui dua semut.';
 }
 const buttons={previous:$('mechanism-previous'),next:$('mechanism-next'),replay:$('mechanism-replay')};
 const handlers=[...allButtons.map((b,i)=>[b,()=>{stage=i;paint();}]),[buttons.previous,()=>{stage=Math.max(0,stage-1);paint();}],[buttons.next,()=>{stage=Math.min(STAGES.length-1,stage+1);paint();}],[buttons.replay,()=>{stage=0;paint();}]];
 handlers.forEach(([b,fn])=>b.addEventListener('click',fn));
 paint();
 return ()=>handlers.forEach(([b,fn])=>b.removeEventListener('click',fn));
}
