/** Derive ONLY knowledge revealed through the current trace event. No final-result fallback. */
export function replayState(events, index) {
  const state={event:null, iteration:null, ant:null, route:null, tau:null, bestLength:Infinity, bestRoute:null, convergence:[], completed:false};
  if (!Array.isArray(events)||index<0) return state;
  const cap=Math.min(index,events.length-1);
  for(let i=0;i<=cap;i++){
    const e=events[i]; state.event=e;
    if(Number.isInteger(e.iteration))state.iteration=e.iteration;
    if(e.type==='iteration-start'){
      state.ant=null;state.route=null;state.tau=e.tau;
    } else if(e.type==='ant-start'){
      state.ant=e.ant;state.route=e.route;
    } else if(e.type==='city-selected'){
      state.ant=e.ant;state.route=e.route;
    } else if(e.type==='route-completed'){
      state.ant=e.ant;state.route=e.route;
      if(e.length<state.bestLength){state.bestLength=e.length;state.bestRoute=e.route.slice();}
    } else if(e.type==='pheromone-updated'){
      state.tau=e.after;
    } else if(e.type==='iteration-complete'){
      state.route=null;state.ant=null;
      state.convergence.push({iteration:e.iteration,bestLength:state.bestLength});
    } else if(e.type==='simulation-complete'){
      state.completed=true;state.route=null;state.ant=null;
    }
  }
  return state;
}
