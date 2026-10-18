// Educational analysis of the core Ant System implementation; UI trace storage is excluded.
export const ANALYSIS_GROUPS = Object.freeze([
 {id:'setup',title:'Validasi & inisialisasi',lines:[1,2,3]},
 {id:'construct',title:'Konstruksi tur',lines:[5,6,7,8]},
 {id:'evaluate',title:'Evaluasi & best-so-far',lines:[9,10]},
 {id:'pheromone',title:'Evaporasi & deposisi global',lines:[11,12]}
]);
export const PSEUDOCODE = Object.freeze([
 [1,'VALIDASI matriks D dan parameter AS'],
 [2,'INISIALISASI τ, η, best ← +∞'],
 [3,'UNTUK iterasi t = 1 sampai T:'],
 [4,'    tur_semut ← []; panjang_semut ← []'],
 [5,'    UNTUK setiap semut k = 1 sampai m:'],
 [6,'        Pilih kota awal; tandai sudah dikunjungi'],
 [7,'        SELAMA ada kota belum dikunjungi:'],
 [8,'            Pilih berikutnya dari peluang τ(t), η'],
 [9,'        Tutup tur ke kota awal; hitung Lₖ'],
 [10,'        Simpan tur; perbarui best-so-far'],
 [11,'    τ ← (1 − ρ) × τ       // evaporasi sekali'],
 [12,'    UNTUK tiap tur semut: deposit Q/Lₖ per sisi'],
 [13,'KEMBALIKAN best route dan best length']
]);
export function complexityComponents(n,m,T){
 if(![n,m,T].every(Number.isSafeInteger)||n<3||m<1||T<1)throw new RangeError('n≥3, m≥1, T≥1 wajib bilangan bulat positif');
 return {citySelections:m*T*(n-1),candidateUpperBound:m*T*n*(n-1)/2,pheromoneEdgePasses:T*n*(n-1)/2,storedTourCities:m*n,distanceCells:n*n};
}
export function checkTourInvariant(route,n){
 if(!Number.isInteger(n)||n<3||!Array.isArray(route)||route.length!==n+1)return false;
 return route[0]===route[n] && new Set(route.slice(0,n)).size===n && route.slice(0,n).every(v=>Number.isInteger(v)&&v>=0&&v<n);
}
export function bestSoFar(lengths){
 if(!Array.isArray(lengths)||lengths.some(x=>!Number.isFinite(x)||x<=0))throw new TypeError('Panjang tur harus positif dan berhingga');
 let best=Infinity;return lengths.map(x=>best=Math.min(best,x));
}
