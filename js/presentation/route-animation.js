/** Observable animation: moving tracer + progressive edges; no CSS keyframe dependency. */
export function routeProgress(elapsedMs, edgeCount, edgeDurationMs = 1050, holdMs = 1100) {
  const total = edgeCount * edgeDurationMs + holdMs;
  const t = ((elapsedMs % total) + total) % total;
  return Array.from({ length: edgeCount }, (_, index) => Math.max(0, Math.min(1, (t - index * edgeDurationMs) / edgeDurationMs)));
}

export function startOpeningRouteAnimation(root) {
  const graph = root.querySelector('.opening-graph');
  if (!graph) return () => {};
  const edges = [...graph.querySelectorAll('.opening-route-edge')];
  const marker = graph.querySelector('#opening-traveler');
  const replay = root.querySelector('#opening-route-replay');
  const toggle = root.querySelector('#opening-route-toggle');
  const status = root.querySelector('#opening-route-status');
  if (!edges.length || !marker) return () => {};
  const lengths = edges.map(edge => edge.getTotalLength());
  const edgeDuration = 1050;
  const cycle = edges.length * edgeDuration + 850;
  let raf = 0;
  let lastTime = null;
  let elapsed = 0;
  // Slide 01 intentionally autoplays on entry; manual Pause remains available.
  let active = true;
  let disposed = false;

  function paint() {
    const t = elapsed % cycle;
    const progress = routeProgress(t, edges.length, edgeDuration, 850);
    edges.forEach((edge, index) => {
      const length = lengths[index];
      edge.style.strokeDasharray = `${length} ${length}`;
      edge.style.strokeDashoffset = String(length * (1 - progress[index]));
      edge.style.opacity = progress[index] === 0 ? '0' : '1';
    });
    const edgeIndex = Math.min(edges.length - 1, Math.floor(t / edgeDuration));
    const distance = Math.min(1, (t - edgeIndex * edgeDuration) / edgeDuration) * lengths[edgeIndex];
    const point = edges[edgeIndex].getPointAtLength(Math.max(0, distance));
    marker.setAttribute('cx', String(point.x));
    marker.setAttribute('cy', String(point.y));
    marker.style.opacity = active ? '1' : '0.75';
    if (status) status.textContent = active
      ? (t >= edges.length * edgeDuration ? 'Siklus lengkap · mengulang…' : `Bergerak: ${'ABCDE'[edgeIndex]} → ${'BCDEA'[edgeIndex]} · ${Math.round(distance / lengths[edgeIndex] * 100)}%`)
      : 'Animasi dijeda';
    if (toggle) toggle.textContent = active ? 'Jeda animasi' : 'Mulai animasi';
  }
  function frame(now) {
    if (disposed || !active) return;
    if (lastTime !== null) elapsed += Math.min(100, Math.max(0, now - lastTime));
    lastTime = now;
    paint();
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    active = false;
    cancelAnimationFrame(raf);
    lastTime = null;
    paint();
  }
  function play(reset = false) {
    cancelAnimationFrame(raf);
    if (reset) elapsed = 0;
    active = true;
    lastTime = null;
    paint();
    raf = requestAnimationFrame(frame);
  }
  const onReplay = () => play(true);
  const onToggle = () => active ? pause() : play();
  replay?.addEventListener('click', onReplay);
  toggle?.addEventListener('click', onToggle);
  if (active) play(true); else paint();
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    replay?.removeEventListener('click', onReplay);
    toggle?.removeEventListener('click', onToggle);
  };
}
