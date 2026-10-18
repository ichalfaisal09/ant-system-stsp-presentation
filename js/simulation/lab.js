import {BASELINE,V04,V05,runAntSystem} from '../engine/ant-system.js';
import {replayState} from './replay-state.js';
import {renderConvergenceChart} from './convergence-chart.js';
const presets={v04:V04,v05:V05};
const format=n=>Number.isFinite(n)?Number(n.toFixed(3)).toLocaleString('id-ID',{maximumFractionDigits:3}):'—';
const labels=i=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]||`K${i+1}`;
function positions(n){return Array.from({length:n},(_,i)=>{const theta=-Math.PI/2+i*2*Math.PI/n;return [250+170*Math.cos(theta),195+140*Math.sin(theta)];});}
function drawGraph(svg,D,visible){
 const n=D.length,pos=positions(n);const tau=visible?.tau;
 const hi=tau?Math.max(...tau.flat()):1;let out='';
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
  const [x1,y1]=pos[i],[x2,y2]=pos[j],ratio=tau?tau[i][j]/hi:0;
  out+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6db9df" stroke-width="${(1+5*ratio).toFixed(2)}" opacity="${(0.20+ratio*0.6).toFixed(2)}"/>`;
 }
 const route=visible?.route;
 if(route){const pts=[...route,route[0]].map(i=>pos[i].join(',')).join(' ');out+=`<polyline points="${pts}" fill="none" stroke="#ffbf8b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;}
 for(let i=0;i<n;i++)out+=`<g><circle cx="${pos[i][0]}" cy="${pos[i][1]}" r="20" fill="#214762" stroke="#a0dfff" stroke-width="2.3"/><text x="${pos[i][0]}" y="${pos[i][1]+5}" text-anchor="middle" fill="#fff" font-size="16" font-weight="750">${labels(i)}</text></g>`;
 svg.innerHTML=out;
}
function chart(svg,history){svg.innerHTML=renderConvergenceChart(history);}
export function renderLab({embedded=false}={}){return `<section class="simulation-shell ${embedded?'simulation-embedded':'simulation-full'}"><div class="simulation-heading"><div><p class="eyebrow">${embedded?'Slide 06 · Demonstrasi langsung':'Simulation Lab · Eksplorasi interaktif'}</p><h1>${embedded?'Live Simulation':'Simulation Lab Ant System–Ant-Cycle'}</h1><p>Mesin Ant System berjalan di browser. Hasil ini <b>bukan</b> data eksperimen Python.</p></div>${embedded?'<button type="button" id="sim-open-lab">Buka Full Lab ↗</button>':''}</div><div class="simulation-layout"><div class="simulation-panel"><div class="simulation-panel-top"><b>Graf STSP</b><span id="sim-phase">Belum dijalankan</span></div><svg id="sim-graph" viewBox="0 0 500 390" role="img" aria-label="Graf kota dan jalur simulasi"></svg><div class="simulation-mini-info"><span id="sim-iteration">Iterasi —</span><span id="sim-ant">Semut —</span><span id="sim-best">Terbaik —</span></div><svg id="sim-chart" viewBox="0 0 480 150" role="img" aria-label="Grafik konvergensi best-so-far: sumbu X iterasi, sumbu Y panjang tur"></svg></div><div class="simulation-panel simulation-right"><div class="simulation-panel-top"><b>Pengaturan simulasi</b><span>Ant System · Ant-Cycle</span></div><div class="simulation-inputs"><label>Dataset<select id="sim-dataset"><option value="v04">V-04 (4 kota)</option><option value="v05">Contoh sintetis (5 kota)</option></select></label>${[['m','Semut (m)','1','30','1'],['T','Iterasi (T)','1','100','1'],['alpha','α','0','10','0.5'],['beta','β','0','15','0.5'],['rho','ρ','0.05','0.95','0.05'],['Q','Q','1','1000','1'],['tau0','τ₀','0.1','100','0.1'],['seed','Seed','0','4294967295','1']].map(([key,label,min,max,step])=>`<label>${label}<input id="sim-${key}" type="number" min="${min}" max="${max}" step="${step}" value="${BASELINE[key]}"/></label>`).join('')}</div><div class="simulation-actions"><button type="button" id="sim-run">Run</button><button type="button" id="sim-pause">Pause</button><button type="button" id="sim-step">Step</button><button type="button" id="sim-reset">Reset</button><button type="button" id="sim-baseline">Baseline</button></div><label class="simulation-speed">Kecepatan pemutaran <select id="sim-speed"><option value="750">Lambat</option><option value="250" selected>Normal</option><option value="60">Cepat</option></select></label><p class="simulation-error" id="sim-error" role="alert" aria-live="polite"></p><div class="simulation-current"><strong id="sim-description">Atur parameter, lalu tekan Run atau Step.</strong><div id="sim-candidates"></div></div><small>Langkah visual: awal iterasi, pemilihan kota, penyelesaian rute, dan pembaruan feromon global. Semua semut memakai τ(t) yang sama.</small></div></div></section>`;}
export function mountLab(root,{openLab}={}){
 const $=id=>root.querySelector(`#${id}`);
 let result=null,index=-1,timer=null,computedConfig=null;
 const D=()=>presets[$('sim-dataset').value];
 const params=()=>Object.fromEntries(Object.keys(BASELINE).map(k=>[k,Number($(`sim-${k}`).value)]));
 const snapshotConfig=()=>JSON.stringify({dataset:$('sim-dataset').value,...params()});
 const clear=()=>{if(timer!==null){clearTimeout(timer);timer=null;}};
 function refresh(){
  const visible=replayState(result?.events,index);
  const evt=visible.event;
  drawGraph($('sim-graph'),D(),visible);
  const iteration=visible.iteration??'—';
  $('sim-iteration').textContent=`Iterasi ${iteration} / ${params().T}`;
  $('sim-ant').textContent=`Semut ${visible.ant??'—'}`;
  $('sim-best').textContent=`Terbaik ${format(visible.bestLength)}`;
  $('sim-phase').textContent=evt?evt.type:'Belum dijalankan';
  let detail=evt?`Event ${index+1}/${result.events.length}: ${evt.type}`:'Atur parameter, lalu tekan Run atau Step.';
  if(evt?.type==='city-selected')detail+=` · ${labels(evt.current)} → ${labels(evt.chosen)} (acak ${format(evt.draw)})`;
  if(evt?.type==='route-completed')detail+=` · Panjang ${format(evt.length)}`;
  $('sim-description').textContent=detail;
  $('sim-candidates').textContent=evt?.choices?evt.choices.map(c=>`${labels(c.city)}: ${(100*c.probability).toFixed(1)}%`).join(' · '):'';
  chart($('sim-chart'),visible.convergence);
 }
 function invalidate(){clear();result=null;computedConfig=null;index=-1;$('sim-error').textContent='';refresh();}
 function prepare(){
  if(result&&snapshotConfig()===computedConfig)return true;
  if(result)invalidate();
  try{
   const p=params();
   if(p.m*p.T*D().length>14000)throw Error('Konfigurasi terlalu besar untuk penelusuran visual. Kurangi semut atau iterasi.');
   result=runAntSystem(D(),p,{trace:true});
   computedConfig=snapshotConfig();$('sim-error').textContent='';index=-1;
   return true;
  }catch(e){$('sim-error').textContent=e.message;return false;}
 }
 function step(){if(!prepare())return false;if(index>=result.events.length-1){clear();return false;}index++;refresh();return true;}
 function play(){clear();if(!prepare())return;const tick=()=>{if(step())timer=setTimeout(tick,Number($('sim-speed').value));};tick();}
 function reset(){invalidate();}
 const handlers=[
  [$('sim-run'),'click',play],[$('sim-pause'),'click',clear],
  [$('sim-step'),'click',()=>{clear();step();}],[$('sim-reset'),'click',reset],
  [$('sim-baseline'),'click',()=>{for(const [k,v] of Object.entries(BASELINE))$(`sim-${k}`).value=v;$('sim-dataset').value='v04';reset();}],
  [$('sim-dataset'),'change',invalidate]
 ];
 for(const k of Object.keys(BASELINE)){
  const el=$(`sim-${k}`);
  handlers.push([el,'input',invalidate]);
  handlers.push([el,'change',invalidate]);
 }
 if($('sim-open-lab')&&openLab)handlers.push([$('sim-open-lab'),'click',openLab]);
 for(const [el,event,fn] of handlers)el.addEventListener(event,fn);
 refresh();
 return ()=>{clear();for(const [el,event,fn] of handlers)el.removeEventListener(event,fn);};
}
