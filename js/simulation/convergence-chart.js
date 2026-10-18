/** SVG best-so-far chart. Only completed iterations provided by replayState may be plotted. */
export function renderConvergenceChart(history = []) {
 const W=480,H=150,L=59,R=16,T=25,B=38;
 const plotW=W-L-R,plotH=H-T-B;
 const valid=history.filter(p=>Number.isInteger(p.iteration)&&p.iteration>=1&&Number.isFinite(p.bestLength)&&p.bestLength>0);
 const esc=n=>Number(n.toFixed(2)).toLocaleString('id-ID',{maximumFractionDigits:2});
 const text=(x,y,v,more='')=>`<text x="${x}" y="${y}" fill="#c4deee" font-size="12" ${more}>${v}</text>`;
 if(!valid.length)return `<g aria-label="Belum ada iterasi selesai">${text(W/2,67,'Grafik muncul setelah iterasi pertama selesai','text-anchor="middle"')}${text(W/2,88,'Sumbu X: Iterasi · Sumbu Y: Panjang tur terbaik','text-anchor="middle"')}</g>`;
 const first=valid[0].iteration,last=valid.at(-1).iteration;
 const low=Math.min(...valid.map(p=>p.bestLength)),high=Math.max(...valid.map(p=>p.bestLength));
 const flat=Math.abs(high-low)<1e-10;
 const pad=flat?Math.max(1,Math.abs(low)*.08):Math.max(.5,(high-low)*.12);
 const yMin=Math.max(0,low-pad),yMax=high+pad;
 const x=i=>L+(last===first?0:(i-first)/(last-first)*plotW);
 const y=v=>T+(yMax-v)/(yMax-yMin)*plotH;
 const ticks=[yMin,(yMin+yMax)/2,yMax];
 let out=`<g aria-label="Grafik konvergensi best-so-far sampai iterasi ${last}">`;
 for(const v of ticks){const py=y(v);out+=`<line x1="${L}" y1="${py}" x2="${W-R}" y2="${py}" stroke="#456980" stroke-dasharray="3 5" opacity=".65"/>${text(L-9,py+4,esc(v),'text-anchor="end"')}`;}
 out+=`<line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" stroke="#8bb9d5"/><line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="#8bb9d5"/>`;
 if(first===last){out+=`<circle cx="${L}" cy="${y(valid[0].bestLength)}" r="5" fill="#8de2ff" stroke="#102235" stroke-width="2"/>`;}else{
  out+=`<polyline points="${valid.map(p=>`${x(p.iteration)},${y(p.bestLength)}`).join(' ')}" fill="none" stroke="#8de2ff" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"/>`;
  const step=Math.max(1,Math.ceil(valid.length/28));
  valid.forEach((p,i)=>{if(i===0||i===valid.length-1||i%step===0)out+=`<circle cx="${x(p.iteration)}" cy="${y(p.bestLength)}" r="2.6" fill="#b5eeff"/>`;});
 }
 const final=valid.at(-1), lastX=x(final.iteration),lastY=y(final.bestLength);
 out+=`<circle cx="${lastX}" cy="${lastY}" r="4.2" fill="#b5eeff" stroke="#11243a" stroke-width="1.5"/>`;
 out+=text(L,H-22,String(first),'text-anchor="middle"')+text(W-R,H-22,String(last),'text-anchor="end"');
 out+=text(W/2,H-5,'Iterasi','text-anchor="middle"')+text(14,80,'Panjang tur','transform="rotate(-90 14 80)" text-anchor="middle"');
 out+=text(L,T-11,`Best-so-far: ${esc(final.bestLength)}`);
 if(flat)out+=text(W-R,T-11,'Tidak ada perbaikan','text-anchor="end"');
 else out+=text(W-R,T-11,`Perbaikan: ${esc(valid[0].bestLength-final.bestLength)}`,'text-anchor="end"');
 return out+'</g>';
}
