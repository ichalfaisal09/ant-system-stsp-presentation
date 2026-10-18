const targets = Object.freeze({complexity:5,quality:7,performance:8});
export function getQATarget(key){return targets[key] ?? null;}
export function renderConclusionSlide(){return `<article class="slide-content as10-slide" aria-labelledby="slide-title">
<p class="eyebrow">Analisis Algoritma Komputasi · Slide 10</p>
<div class="as10-head"><div><h1 id="slide-title">Kesimpulan <em>&amp; Q&amp;A</em></h1><p>Ant Colony Optimization (ACO) · Ant System–Ant-Cycle · STSP</p></div><span>RANGKUMAN PENELITIAN</span></div>
<section class="as10-thesis"><small>KESIMPULAN UTAMA</small><strong>Ant System dapat membentuk tur STSP yang valid dan menghasilkan solusi heuristik yang kompetitif pada instance yang diuji, dengan biaya komputasi yang terukur—tanpa jaminan optimum global.</strong></section>
<div class="as10-claims">
<div class="as10-claim"><span>01 · KEBENARAN</span><strong>Tur valid &amp; terminasi</strong><p>Setiap kota dikunjungi sekali sebelum kembali ke awal. Dengan input dan batas iterasi valid, proses berakhir.</p></div>
<div class="as10-claim"><span>02 · BIAYA KOMPUTASI</span><strong>Θ(Tmn²) waktu</strong><p>Ruang inti Θ(n² + mn). Biaya perhitungan bertambah ketika n, m, atau T meningkat.</p></div>
<div class="as10-claim"><span>03 · BUKTI EMPIRIS</span><strong>28/28 · 15/15</strong><p>Uji Python lulus; semua 15 eksekusi instance kecil mencapai optimum, terbatas pada instance yang diuji.</p></div>
</div>
<section class="as10-limit"><strong>Batas interpretasi:</strong> lima instance sintetis dan lima pengulangan; klaim optimum hanya dibuktikan pada V-03 sampai V-05. Perbandingan dengan NN tidak menyetarakan anggaran komputasi.</section>
<section class="as10-qa" aria-label="Navigasi cepat untuk sesi pertanyaan"><div><span>DISKUSI / TANYA JAWAB</span><h2>Terima kasih. Ada pertanyaan?</h2><p>Pilih bukti yang relevan untuk menjawab pertanyaan dosen.</p></div><div class="as10-actions"><button type="button" data-qa-target="complexity">Analisis kompleksitas <b>05 ↗</b></button><button type="button" data-qa-target="quality">Hasil pengujian <b>07 ↗</b></button><button type="button" data-qa-target="performance">Kinerja &amp; NN <b>08 ↗</b></button><button type="button" data-qa-lab="true">Simulation Lab <b>Lab ↗</b></button></div></section>
<div class="as10-source">Sumber: laporan dan CSV eksperimen Python penelitian. Demonstrasi browser bukan hasil eksperimen Python.</div>
</article>`;}
export function mountConclusionSlide(root,{navigate,openLab}={}){
 const bindings=[];
 for(const b of root.querySelectorAll('[data-qa-target]')){
  const key=b.dataset.qaTarget, destination=getQATarget(key);
  const handler=()=>{if(destination!==null) navigate?.(destination);};
  b.addEventListener('click',handler); bindings.push([b,handler]);
 }
 for(const b of root.querySelectorAll('[data-qa-lab]')){
  const handler=()=>openLab?.();b.addEventListener('click',handler);bindings.push([b,handler]);
 }
 return ()=>bindings.forEach(([b,handler])=>b.removeEventListener('click',handler));
}
