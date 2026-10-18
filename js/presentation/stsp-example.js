/** Small, deterministic educational V-04 STSP example; distances are matrix weights, not SVG pixel lengths. */
export const V04 = Object.freeze([
  Object.freeze([0, 2, 4, 6]),
  Object.freeze([2, 0, 3, 5]),
  Object.freeze([4, 3, 0, 2]),
  Object.freeze([6, 5, 2, 0])
]);
export const ROUTE_MODES = Object.freeze({
  optimal: Object.freeze({label:'Optimal', route:Object.freeze([0,1,2,3,0]), description:'Siklus Hamilton dengan panjang minimum 13. Nilai optimum diverifikasi melalui enumerasi semua rute pada graf empat kota.'}),
  nonoptimal: Object.freeze({label:'Valid, belum optimal', route:Object.freeze([0,3,1,2,0]), description:'Keempat kota dikunjungi tepat sekali dan kembali ke A, tetapi panjang 18 lebih besar dari optimum 13.'}),
  invalid: Object.freeze({label:'Tidak valid', route:Object.freeze([0,1,2,1,0]), description:'Kota B dikunjungi dua kali sementara kota D tidak dikunjungi. Ini bukan solusi STSP yang sah.'})
});
export function routeValidation(route, n=V04.length) {
  if (!Array.isArray(route) || route.length !== n+1) return {valid:false, reason:'Jumlah langkah tidak sesuai siklus Hamilton.'};
  if (route[0] !== route[route.length-1]) return {valid:false, reason:'Rute tidak kembali ke kota awal.'};
  if (!route.every(v => Number.isInteger(v) && v >= 0 && v < n)) return {valid:false, reason:'Indeks kota tidak sah.'};
  if (new Set(route.slice(0,-1)).size !== n) return {valid:false, reason:'Ada kota berulang atau tidak dikunjungi.'};
  return {valid:true, reason:'Semua kota dikunjungi tepat satu kali dan kembali ke awal.'};
}
export function tourLength(route, matrix=V04) {
  if (!routeValidation(route,matrix.length).valid) return null;
  return route.slice(1).reduce((total,to,i)=>total+matrix[route[i]][to],0);
}
export function exactOptimalTour(matrix=V04) {
  const n=matrix.length;
  if(n>10) throw new RangeError('Enumerasi demonstrasi dibatasi hingga 10 kota.');
  const used=Array(n).fill(false); used[0]=true;
  let bestLength=Infinity, bestRoute=null;
  function visit(path) {
    if(path.length===n){const route=[...path,0], length=tourLength(route,matrix);if(length<bestLength){bestLength=length;bestRoute=route;}return;}
    for(let i=1;i<n;i++) if(!used[i]){used[i]=true;visit([...path,i]);used[i]=false;}
  }
  visit([0]);
  return {route:bestRoute, length:bestLength};
}
export const cityLetter = index => String.fromCharCode(65+index);
export const describeRoute = route => route.map(cityLetter).join(' → ');
