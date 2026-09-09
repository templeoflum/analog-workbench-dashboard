export const sampleNs=.25;
export const sampleCount=4001;
export const sources=[
 {id:'flat',name:'Flat level',description:'0.100 V for 1 µs. Checks DC bias and gain at a fixed level.'},
 {id:'staircase',name:'Five-level staircase',description:'0, 50, 100, 150, 200 mV; transitions at 190–200, 390–400, 590–600 and 790–800 ns.'},
 {id:'ramp',name:'Up / down ramp',description:'0 V to 100 ns; rise to 200 mV at 450 ns; fall to 0 V at 800 ns; hold.'},
 {id:'pulse',name:'Controlled pulse',description:'0 V to 200 ns; 10 ns rise to 160 mV; hold to 600 ns; 10 ns fall; hold 0 V.'},
 {id:'sine1',name:'1 MHz sine',description:'100 mV centre, 80 mV amplitude, one cycle. Starts at 100 mV DC, zero phase.'},
 {id:'sine5',name:'5 MHz sine',description:'100 mV centre, 80 mV amplitude, five cycles. Starts at 100 mV DC, zero phase.'}
];
function pwl(t,points){for(let j=1;j<points.length;j++){const [end,v]=points[j],[start,a]=points[j-1];if(t<=end)return a+(v-a)*(t-start)/(end-start);}return points.at(-1)[1];}
export function diagnosticInput(id){
 if(!sources.some(s=>s.id===id))throw Error('Unknown diagnostic source');
 return Float64Array.from({length:sampleCount},(_,i)=>{const t=i*sampleNs;
 switch(id){
 case 'flat':return .1;
 case 'staircase':return pwl(t,[[0,0],[190,0],[200,.05],[390,.05],[400,.1],[590,.1],[600,.15],[790,.15],[800,.2],[1000,.2]]);
 case 'ramp':return pwl(t,[[0,0],[100,0],[450,.2],[800,0],[1000,0]]);
 case 'pulse':return pwl(t,[[0,0],[200,0],[210,.16],[600,.16],[610,0],[1000,0]]);
 default:return .1+.08*Math.sin(2*Math.PI*(id==='sine1'?1:5)*t/1000);
 }
 });
}
export function compareTrace(actual,reference){
 if(actual.length!==sampleCount||reference.length!==sampleCount)throw Error('Incomplete trace');
 let peak=0,sum=0,peakIndex=0,bias=0;const residual=new Float64Array(sampleCount);
 for(let i=0;i<sampleCount;i++){if(!Number.isFinite(actual[i])||!Number.isFinite(reference[i]))throw Error('Non-finite trace');const e=actual[i]-reference[i];residual[i]=e;sum+=e*e;bias+=e;if(Math.abs(e)>peak){peak=Math.abs(e);peakIndex=i;}}
 const rms=Math.sqrt(sum/sampleCount);return {peak,rms,bias:bias/sampleCount,peakIndex,residual,passed:peak<=.001&&rms<=.0001};
}
