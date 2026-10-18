/** Opening illustration. This is an illustrative Hamiltonian cycle, not a research result. */
export function renderOpening() {
  return `<article class="slide-content opening-slide" aria-labelledby="slide-title">
    <p class="eyebrow">Analisis Algoritma Komputasi · Presentasi Penelitian</p>
    <div class="opening-grid">
      <div class="opening-copy">
        <p class="opening-kicker">ANT COLONY OPTIMIZATION · ANT SYSTEM–ANT-CYCLE · STSP</p>
        <h1 id="slide-title" class="opening-title">Algoritma <em>Ant Colony Optimization (ACO)</em></h1>
        <p class="opening-subtitle">Ant System–Ant-Cycle untuk Symmetric Traveling Salesman Problem (STSP) · Analisis Kebenaran, Kompleksitas, dan Kinerja Empiris</p>
        <div class="opening-rule"></div>
        <div class="opening-identity"><strong>Faisal</strong><span>D082261012 · Magister Teknik Informatika</span><span>Fakultas Teknik · Universitas Hasanuddin · 2026</span></div>
      </div>
      <div class="opening-visual">
        <div class="opening-visual-header"><span class="live-dot" aria-hidden="true"></span> ILUSTRASI SIKLUS STSP <span class="diagram-legend">5 kota · rute tertutup</span></div>
        <svg class="opening-graph" viewBox="0 0 460 375" role="img" aria-label="Diagram ilustrasi graf lima kota A, B, C, D dan E yang terhubung oleh suatu rute perjalanan tertutup kembali ke A.">
          <defs><filter id="nodeglow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <g class="opening-background-edges"><path d="M95 90 L335 70 L402 207 L274 315 L70 249 Z M95 90 L402 207 M95 90 L274 315 M335 70 L70 249 M335 70 L274 315 M402 207 L70 249"/></g>
          <g class="opening-route-edges" aria-hidden="true">
            <path class="opening-route-edge" style="--edge-index:0" d="M95 90 L335 70" pathLength="1" />
            <path class="opening-route-edge" style="--edge-index:1" d="M335 70 L402 207" pathLength="1" />
            <path class="opening-route-edge" style="--edge-index:2" d="M402 207 L274 315" pathLength="1" />
            <path class="opening-route-edge" style="--edge-index:3" d="M274 315 L70 249" pathLength="1" />
            <path class="opening-route-edge" style="--edge-index:4" d="M70 249 L95 90" pathLength="1" />
          </g>
          <circle id="opening-traveler" cx="95" cy="90" r="9" fill="#ffffff" stroke="#53bfff" stroke-width="4" style="filter:drop-shadow(0 0 8px #76c4f2);pointer-events:none" aria-hidden="true"/><g class="opening-cities"><g transform="translate(95 90)"><circle r="22"/><text y="6">A</text></g><g transform="translate(335 70)"><circle r="22"/><text y="6">B</text></g><g transform="translate(402 207)"><circle r="22"/><text y="6">C</text></g><g transform="translate(274 315)"><circle r="22"/><text y="6">D</text></g><g transform="translate(70 249)"><circle r="22"/><text y="6">E</text></g></g>
        </svg>
        <div class="opening-route-controls"><button type="button" id="opening-route-replay" class="route-replay">↻ Putar ulang rute</button><button type="button" id="opening-route-toggle" class="route-replay">Jeda animasi</button><span id="opening-route-status" class="route-status" aria-live="off">Menggambar rute...</span></div><p class="graph-caption">Ilustrasi konseptual, bukan keluaran eksperimen.</p>
      </div>
    </div>
    <div class="opening-question"><span>PERTANYAAN UTAMA</span><p>Bagaimana Ant System dalam keluarga ACO membentuk rute STSP yang valid dan berkualitas, serta berapa biaya komputasinya?</p></div>
    <div class="slide-stamp">Ant Colony Optimization (ACO) · varian Ant System–Ant-Cycle</div>
  </article>`;
}
