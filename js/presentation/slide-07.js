import {loadResearch,summarizeOptimality,idNumber,SOURCES} from './research-results.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function barChart(rows){
 const max=Math.max(...rows.map(r=>+r.mean));
 return `<div class="as7-bars" role="img" aria-label="Grafik rata-rata panjang tur untuk lima instance berbeda. K-10 222, K-20 191, K-40 414 koma 4, K-60 258 koma 2, K-80 343 koma 2.">
 ${rows.map(r=>`<div class="as7-barrow"><span class="as7-name">${esc(r.dataset)}</span><div class="as7-track"><div class="as7-fill" style="width:${(+r.mean/max*100).toFixed(2)}%"></div></div><strong>${idNumber(r.mean)}</strong></div>`).join('')}
 </div>`;
}
function qualityPanel(rows){return `<div class="as7-charthead"><div><h2>Rata-rata panjang tur</h2><p>Hasil Ant System · 5 pengulangan per instance</p></div><span>Semakin kecil = tur lebih pendek*</span></div>${barChart(rows)}<div class="as7-explainer">*Bandingkan kualitas <b>dalam instance yang sama</b>. Nilai antar K-10 hingga K-80 tidak menunjukkan hubungan monoton karena setiap instance memakai matriks jarak berbeda.</div><div class="as7-mini-table"><span>Instance</span><span>Min</span><span>Rerata ± SD</span><span>Maks</span>${rows.map(r=>`<b>${esc(r.dataset)}</b><span>${idNumber(r.minimum)}</span><span>${idNumber(r.mean)} ± ${idNumber(r.std_sample,2)}</span><span>${idNumber(r.maximum)}</span>`).join('')}</div>`;}
function gapPanel(rows){return `<div class="as7-charthead"><div><h2>Gap terhadap optimum</h2><p>Verifikasi dengan enumerasi pada instance kecil</p></div><span>3 instance · 5 seed masing-masing</span></div><div class="as7-optimum-grid">${rows.map(r=>`<div class="as7-optimum-card"><span>${esc(r.dataset)} · ${esc(r.n)} kota</span><strong>${idNumber(r.optimum,0)}</strong><small>Optimum global</small><b>5/5 mencapai optimum</b><small>Rata-rata gap ${idNumber(r.mean_gap_pct)}%</small></div>`).join('')}</div><div class="as7-explainer"><b>Definisi gap:</b> 100% × (panjang AS − panjang optimum) / panjang optimum. Seluruh 15 percobaan instance kecil memiliki gap 0%. <b>Ini tidak membuktikan optimum global untuk instance yang lebih besar.</b></div>`;}
export function renderQualitySlide(){return `<article class="slide-content as7-slide" aria-labelledby="slide-title"><p class="eyebrow">Analisis Algoritma Komputasi · Slide 07</p><div class="as7-heading"><div><h1 id="slide-title">Pengujian & <em>Kualitas Solusi</em></h1><p>Hasil eksperimen Python asli, bukan keluaran Live Simulation.</p></div><span>RESEARCH RESULTS · PYTHON</span></div><div class="as7-summary"><div><small>Pengujian otomatis referensi</small><strong>28/28</strong><span>pytest · implementasi Python</span></div><div><small>Optimalitas pada instance kecil</small><strong id="as7-success">—</strong><span>V-03, V-04, V-05</span></div><div><small>Instance kualitas</small><strong>5</strong><span>K-10 hingga K-80</span></div></div><div class="as7-tabs" role="tablist" aria-label="Hasil pengujian"><button type="button" data-as7-tab="quality" role="tab" aria-selected="true">01 · Kualitas solusi</button><button type="button" data-as7-tab="gap" role="tab" aria-selected="false">02 · Gap optimalitas</button></div><section id="as7-content" class="as7-content" aria-live="polite"><p>Memuat CSV hasil penelitian…</p></section><div class="as7-bottom"><span>Data: repositori Python penelitian · hasil lima seed pada instance K</span><span>Validitas ≠ jaminan optimalitas umum</span></div></article>`;}
export function mountQualitySlide(root){
 let active='quality',alive=true,results=null;
 const panel=root.querySelector('#as7-content'),buttons=[...root.querySelectorAll('[data-as7-tab]')];
 const show=()=>{
  if(!alive||!results)return;
  buttons.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.as7Tab===active)));
  panel.innerHTML=active==='quality'?qualityPanel(results.quality):gapPanel(results.gap);
 };
 const handlers=buttons.map(b=>[b,()=>{active=b.dataset.as7Tab;show();}]);
 handlers.forEach(([b,f])=>b.addEventListener('click',f));
 loadResearch().then(data=>{if(!alive)return;results=data;const total=summarizeOptimality(data.gap);root.querySelector('#as7-success').textContent=`${total.successes}/${total.trials}`;show();}).catch(err=>{if(alive){panel.textContent=`Gagal memuat data penelitian: ${err.message}`;panel.classList.add('as7-error');}});
 return ()=>{alive=false;handlers.forEach(([b,f])=>b.removeEventListener('click',f));};
}
