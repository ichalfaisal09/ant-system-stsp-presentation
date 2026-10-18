export function parseRoute(hash, maxSlides) {
  const path = (hash || '').replace(/^#/, '');
  if (path === '/lab') return {type:'lab'};
  const match = /^\/(?:slide\/)?(\d+)$/.exec(path);
  if (match) {
    const number = Number(match[1]);
    if (number >= 1 && number <= maxSlides) return {type:'slide', number};
  }
  return {type:'slide', number:1};
}
export function slideHash(number) {return `#/slide/${number}`;}
