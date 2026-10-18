import {V04} from './stsp-example.js';
import {updatePheromone,DEMO_CONFIG} from './ant-cycle-demo.js';
export function transitionProbabilities(matrix=V04, current=0, candidates=[1,2,3], tau=null, alpha=1,beta=2){
 if(!Number.isFinite(alpha)||alpha<0||!Number.isFinite(beta)||beta<0)throw new RangeError('α dan β harus berhingga dan tidak negatif');
 if(!Array.isArray(candidates)||!candidates.length||new Set(candidates).size!==candidates.length||candidates.includes(current))throw new Error('Kandidat tidak valid');
 const rows=candidates.map(j=>{const d=matrix[current]?.[j],pheromone=tau?.[current]?.[j]??1;if(!(d>0)||!Number.isFinite(d)||!(pheromone>0)||!Number.isFinite(pheromone))throw new Error('Jarak/feromon tidak valid');const eta=1/d;return {city:j,d,tau:pheromone,eta,logWeight:alpha*Math.log(pheromone)+beta*Math.log(eta)};});
 const max=Math.max(...rows.map(r=>r.logWeight));
 const weights=rows.map(r=>Math.exp(r.logWeight-max));
 const sum=weights.reduce((a,b)=>a+b,0);
 return rows.map((r,i)=>({...r,weight:weights[i],probability:weights[i]/sum}));
}
export function examplePheromone(){return updatePheromone(undefined,DEMO_CONFIG,V04).tau;}
