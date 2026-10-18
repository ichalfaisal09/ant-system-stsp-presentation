/** Browser implementation of basic Ant System with global Ant-Cycle updating. No DOM dependencies. */
export const BASELINE=Object.freeze({m:10,T:50,alpha:1,beta:2,rho:0.5,Q:100,tau0:1,seed:101});
export const V04=Object.freeze([[0,2,4,6],[2,0,3,5],[4,3,0,2],[6,5,2,0]]);
export const V05=Object.freeze([[0,3,5,4,6],[3,0,2,5,7],[5,2,0,3,4],[4,5,3,0,2],[6,7,4,2,0]]);
export function validateMatrix(D){
 if(!Array.isArray(D)||D.length<3||D.length>80)throw Error('Matriks wajib memiliki 3–80 kota.');
 const n=D.length;
 for(let i=0;i<n;i++){
  if(!Array.isArray(D[i])||D[i].length!==n)throw Error('Matriks harus persegi.');
  for(let j=0;j<n;j++){
   const d=D[i][j];if(!Number.isFinite(d)||(i===j?d!==0:d<=0))throw Error('Diagonal harus nol; jarak antarkota harus positif dan berhingga.');
   if(j<i&&Math.abs(d-D[j][i])>1e-9)throw Error('Matriks harus simetris.');
  }
 }
 return n;
}
export function validateParameters(p){
 const integers=['m','T','seed'];for(const k of integers)if(!Number.isSafeInteger(p[k]))throw Error(`${k} harus bilangan bulat.`);
 if(p.m<1||p.m>80||p.T<1||p.T>250)throw Error('Rentang: semut 1–80; iterasi 1–250.');
 if(p.seed<0||p.seed>4294967295)throw Error('Seed harus 0–4294967295.');
 if(!Number.isFinite(p.alpha)||p.alpha<0||p.alpha>10||!Number.isFinite(p.beta)||p.beta<0||p.beta>15)throw Error('Rentang: α 0–10, β 0–15.');
 if(!Number.isFinite(p.rho)||p.rho<=0||p.rho>=1)throw Error('ρ harus lebih dari 0 dan kurang dari 1.');
 if(!Number.isFinite(p.Q)||p.Q<=0||!Number.isFinite(p.tau0)||p.tau0<=0)throw Error('Q dan τ₀ harus positif.');
 return true;
}
export function createRng(seed){let s=seed>>>0;return ()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
export function routeLength(route,D){const n=validateMatrix(D);if(route.length!==n||new Set(route).size!==n||route.some(x=>!Number.isInteger(x)||x<0||x>=n))throw Error('Rute bukan permutasi valid.');let sum=0;for(let i=0;i<n;i++)sum+=D[route[i]][route[(i+1)%n]];return sum;}
export function transitionProbabilities(current,candidates,D,tau,p){
 if(!candidates.length)throw Error('Tidak ada kandidat.');
 const logs=candidates.map(j=>p.alpha*Math.log(tau[current][j])-p.beta*Math.log(D[current][j]));
 const max=Math.max(...logs);const weights=logs.map(v=>Math.exp(v-max));const total=weights.reduce((a,b)=>a+b,0);
 const probabilities=weights.map(w=>w/total);
 return candidates.map((city,i)=>({city,distance:D[current][city],pheromone:tau[current][city],heuristic:1/D[current][city],weight:weights[i],probability:probabilities[i]}));
}
function depositAll(tau,routes,lengths,p){const n=tau.length;const updated=tau.map((row,i)=>row.map((v,j)=>i===j?0:v*(1-p.rho)));for(let k=0;k<routes.length;k++){const route=routes[k],add=p.Q/lengths[k];for(let i=0;i<n;i++){const a=route[i],b=route[(i+1)%n];updated[a][b]+=add;updated[b][a]+=add;}}return updated;}
/** Deterministic full execution, optional event trace. The core algorithm never updates pheromone inside route construction. */
export function runAntSystem(D,params=BASELINE,{trace=true}={}){
 const n=validateMatrix(D);const p={...BASELINE,...params};validateParameters(p);
 const rng=createRng(p.seed);let tau=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?0:p.tau0));
 let bestLength=Infinity,bestRoute=null;const history=[],events=[];
 const emit=(type,data)=>{if(trace)events.push({type,...data});};
 for(let iteration=1;iteration<=p.T;iteration++){
  const routes=[],lengths=[];
  emit('iteration-start',{iteration,tau:tau.map(r=>r.slice()),bestLength});
  for(let ant=1;ant<=p.m;ant++){
   const start=Math.floor(rng()*n);const route=[start];const visited=new Set(route);
   emit('ant-start',{iteration,ant,route:[...route]});
   while(route.length<n){
    const current=route.at(-1), candidates=Array.from({length:n},(_,i)=>i).filter(i=>!visited.has(i));
    const choices=transitionProbabilities(current,candidates,D,tau,p);
    const draw=rng();let cumulative=0,chosen=choices.at(-1).city;
    for(const choice of choices){cumulative+=choice.probability;if(draw<cumulative){chosen=choice.city;break;}}
    emit('city-selected',{iteration,ant,current,choices,draw,chosen,route:[...route,chosen]});
    route.push(chosen);visited.add(chosen);
   }
   const length=routeLength(route,D);routes.push(route);lengths.push(length);
   if(length<bestLength){bestLength=length;bestRoute=[...route];}
   emit('route-completed',{iteration,ant,route:[...route],length,bestLength});
  }
  emit('all-ants-complete',{iteration,routes:routes.map(r=>r.slice()),lengths:[...lengths],bestLength});
  const before=tau;
  tau=depositAll(before,routes,lengths,p);
  emit('pheromone-updated',{iteration,before:before.map(r=>r.slice()),after:tau.map(r=>r.slice()),routes:routes.map(r=>r.slice()),lengths:[...lengths],bestLength});
  history.push({iteration,bestLength,iterationBest:Math.min(...lengths)});
  emit('iteration-complete',{iteration,bestLength});
 }
 emit('simulation-complete',{iteration:p.T,bestLength,bestRoute:[...bestRoute]});
 return {bestLength,bestRoute,tau,history,events,parameters:p};
}
