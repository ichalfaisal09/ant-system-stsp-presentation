// Parse of local, unmodified research CSV summaries; no synthetic fallback.
export const QUALITY_URL='data/results/quality_summary.csv';
export const GAP_URL='data/results/optimality_gap_summary.csv';
export const SOURCES={quality:'https://github.com/ichalfaisal09/ant-system-stsp-analysis/blob/main/results/quality_summary.csv',gap:'https://github.com/ichalfaisal09/ant-system-stsp-analysis/blob/main/results/optimality_gap_summary.csv',tests:'https://github.com/ichalfaisal09/ant-system-stsp-analysis/blob/main/README.md'};
export function parseSummary(csv, required){
 const lines=csv.trim().split(/\r?\n/).filter(Boolean);
 if(lines.length<2)throw new Error('CSV tidak memiliki baris data');
 const columns=lines.shift().split(',').map(s=>s.trim());
 for(const field of required)if(!columns.includes(field))throw new Error(`Kolom CSV tidak ditemukan: ${field}`);
 return lines.map((line,i)=>{
   const cells=line.split(',').map(s=>s.trim());
   if(cells.length!==columns.length)throw new Error(`Jumlah kolom salah pada baris ${i+2}`);
   const row=Object.fromEntries(columns.map((name,k)=>[name,cells[k]]));
   for(const field of required.filter(x=>!['dataset','config'].includes(x)))if(row[field]===''||!Number.isFinite(Number(row[field])))throw new Error(`Nilai numerik salah: ${field} baris ${i+2}`);
   return row;
 });
}
export async function loadResearch(fetcher=fetch){
 const responses=await Promise.all([QUALITY_URL,GAP_URL].map(url=>fetcher(url)));
 if(responses.some(r=>!r.ok))throw new Error('File CSV penelitian tidak berhasil dibuka. Pastikan menjalankan localhost dan folder data/results tersedia.');
 const [q,g]=await Promise.all(responses.map(r=>r.text()));
 const quality=parseSummary(q,['dataset','n','repetitions','minimum','mean','std_sample','maximum']);
 const gap=parseSummary(g,['dataset','n','optimum','repetitions','as_mean_length','mean_gap_pct','optimal_found_count','success_rate_pct']);
 if(quality.length!==5||gap.length!==3)throw new Error('Jumlah dataset CSV tidak sesuai data referensi penelitian');
 if(new Set(quality.map(x=>x.dataset)).size!==quality.length||new Set(gap.map(x=>x.dataset)).size!==gap.length)throw new Error('Dataset duplikat pada CSV');
 return {quality,gap};
}
export function summarizeOptimality(rows){
 const trials=rows.reduce((s,r)=>s+Number(r.repetitions),0);
 const successes=rows.reduce((s,r)=>s+Number(r.optimal_found_count),0);
 const gapZero=rows.every(r=>Number(r.mean_gap_pct)===0&&Number(r.success_rate_pct)===100);
 return {trials,successes,gapZero};
}
export const idNumber=(n,digits=1)=>Number(n).toLocaleString('id-ID',{minimumFractionDigits:digits,maximumFractionDigits:digits});
