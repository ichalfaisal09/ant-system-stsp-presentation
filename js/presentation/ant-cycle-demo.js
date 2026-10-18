// Deterministic educational example: two completed STSP tours, never a stochastic engine.
export const DEMO_MATRIX = Object.freeze([[0,2,4,6],[2,0,3,5],[4,3,0,2],[6,5,2,0]]);
export const DEMO_ROUTES = Object.freeze([[0,1,2,3,0],[0,3,1,2,0]]);
export const DEMO_CONFIG = Object.freeze({rho:0.5,Q:12,tau0:1});
export function routeDistance(route,matrix=DEMO_MATRIX){
 if(route.length!==matrix.length+1||route[0]!==route.at(-1)||new Set(route.slice(0,-1)).size!==matrix.length) throw new Error('Tur harus mengunjungi seluruh kota tepat sekali dan kembali ke awal');
 return route.slice(1).reduce((total,to,i)=>total+matrix[route[i]][to],0);
}
export function updatePheromone(routes=DEMO_ROUTES,config=DEMO_CONFIG,matrix=DEMO_MATRIX){
 const n=matrix.length;
 const tau=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?0:(1-config.rho)*config.tau0));
 const lengths=routes.map(route=>routeDistance(route,matrix));
 routes.forEach((route,k)=>{const deposit=config.Q/lengths[k];for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i];tau[a][b]+=deposit;tau[b][a]+=deposit;}});
 return {lengths,tau};
}
export const STAGES=Object.freeze([
 {title:'Inisialisasi',tag:'Sebelum iterasi',description:'Siapkan matriks jarak D, feromon awal τ₀ dan parameter. Pada awal iterasi, seluruh semut membaca τ(t) yang sama.'},
 {title:'Konstruksi rute',tag:'Langkah 1 · seluruh semut',description:'Setiap semut memilih hanya kota yang belum dikunjungi. Pemilihan berikutnya bergantung pada feromon τ(t) dan heuristik jarak. Kedua contoh tur sudah ditentukan untuk keperluan penjelasan.'},
 {title:'Evaluasi panjang',tag:'Langkah 2 · seluruh semut',description:'Semua tur selesai dan kembali ke kota awal. Panjang L₁ = 13 dan L₂ = 18 dihitung dari matriks jarak. Solusi terbaik iterasi adalah 13.'},
 {title:'Evaporasi',tag:'Langkah 3 · sekali per iterasi',description:'Setelah semua semut selesai, setiap sisi diperbarui dari τ(t) = 1 menjadi (1−ρ)τ(t) = 0,5. Tidak ada pembaruan lokal selama konstruksi.'},
 {title:'Deposisi Ant-Cycle',tag:'Langkah 4 · kontribusi seluruh semut',description:'Tambahkan Q/Lₖ pada setiap sisi tur semut k, termasuk sisi kembali ke awal. Semut 1 memberi 12/13 per sisi; semut 2 memberi 12/18 per sisi.'},
 {title:'Iterasi berikutnya',tag:'Siklus selesai',description:'Matriks τ(t+1) dipakai pada iterasi selanjutnya. Proses diulang sampai batas T, sambil mempertahankan solusi terbaik global.'}
]);
