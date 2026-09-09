"use client";
import {useEffect,useMemo,useState} from 'react';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Slider} from '@/components/ui/slider';
import {SignalProcessor} from '@/lib/signal-runtime.mjs';
import {sources,diagnosticInput,compareTrace,sampleNs,sampleCount} from '@/lib/diagnostic-source.mjs';
import model from './playable-model.json';
type Reference={source:string,mode:string,gain:number,sampleNs:number,sampleCount:number,reference:number[]};
function Trace({series,min,max,unit,cursor}:{series:{values:ArrayLike<number>,color:string,name:string,dashed?:boolean}[],min:number,max:number,unit:string,cursor:number}){
 const W=900,H=250,left=70,top=25,width=800,height=175;
 const x=(i:number)=>left+i/(sampleCount-1)*width,y=(v:number)=>top+(max-v)/(max-min)*height;
 return <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${series.map(s=>s.name).join(', ')} against time; ${min} to ${max} ${unit}`} style={{width:'100%',background:'#101419'}}>
 {[min,(min+max)/2,max].map(v=><g key={v}><line x1={left} x2={left+width} y1={y(v)} y2={y(v)} stroke="#35424c"/><text x={left-8} y={y(v)+4} fill="#b6c2cc" textAnchor="end" fontSize="14">{v.toFixed(2)}</text></g>)}
 {[0,250,500,750,1000].map(t=><g key={t}><line x1={x(t/sampleNs)} x2={x(t/sampleNs)} y1={top} y2={top+height} stroke="#273039"/><text x={x(t/sampleNs)} y={top+height+22} fill="#b6c2cc" textAnchor="middle" fontSize="14">{t}</text></g>)}
 {min<0&&max>0&&<line x1={left} x2={left+width} y1={y(0)} y2={y(0)} stroke="#6c7d8c"/>}
 {series.map(s=><path key={s.name} d={Array.from(s.values,(v,i)=>(i?'L':'M')+x(i).toFixed(2)+','+y(v).toFixed(3)).join(' ')} fill="none" stroke={s.color} strokeWidth="1.5" strokeDasharray={s.dashed?'5 4':undefined}/>)}
 <line x1={x(cursor)} x2={x(cursor)} y1={top} y2={top+height} stroke="#ffffff" opacity=".6"/><text x="10" y="18" fill="#b6c2cc" fontSize="14">{unit}</text><text x="870" y="245" textAnchor="end" fill="#b6c2cc" fontSize="14">Time / ns</text>
 </svg>;
}
function Strip({values,name}:{values:ArrayLike<number>,name:string}){
 // One horizontal pixel per sample, replicated vertically: time is never wrapped into rows.
 const ref=useMemo(()=>({current:null as HTMLCanvasElement|null}),[]);
 useEffect(()=>{const ctx=ref.current?.getContext('2d');if(!ctx)return;const im=ctx.createImageData(sampleCount,1);for(let i=0;i<sampleCount;i++){const v=Math.round(255*Math.max(0,Math.min(1,(values[i]+.4)/.7)));im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=v;im.data[i*4+3]=255;}ctx.putImageData(im,0,0);},[values,ref]);
 return <figure><figcaption>{name}</figcaption><canvas ref={ref} width={sampleCount} height={1} style={{width:'100%',height:64,imageRendering:'pixelated'}} aria-label={`${name}, horizontal time strip with fixed voltage scale`}/></figure>;
}
export default function DiagnosticPanel(){
 const [source,setSource]=useState('staircase'),[gain,setGain]=useState('1'),[mode,setMode]=useState('offset_input'),[cursor,setCursor]=useState(0);
 const [loaded,setLoaded]=useState<{key:string,data:Reference}|null>(null),[error,setError]=useState('');
 const key=`${mode}-${gain}-${source}`;
 const input=useMemo(()=>diagnosticInput(source),[source]);
 const output=useMemo(()=>{const c=model.cases.find(c=>c.mode===mode&&c.gain===Number(gain))!;return new SignalProcessor(c.kernel,c.dc,input[0]).process(input);},[mode,gain,input]);
 useEffect(()=>{const abort=new AbortController();setError('');fetch(`/evidence/diagnostics/${key}.json`,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Reference could not be loaded');return r.json();}).then((value:unknown)=>{if(!value||typeof value!=='object')throw Error('Invalid reference');const r=value as Reference;if(r.source!==source||r.mode!==mode||r.gain!==Number(gain)||r.sampleNs!==sampleNs||r.sampleCount!==sampleCount||!Array.isArray(r.reference)||r.reference.length!==sampleCount||r.reference.some(v=>!Number.isFinite(v)))throw Error('Reference does not match this acquisition');setLoaded({key,data:r});}).catch(e=>{if(e.name!=='AbortError')setError(String(e.message));});return()=>abort.abort();},[key,source,mode,gain]);
 const reference=loaded?.key===key?loaded.data.reference:null;
 const metrics=useMemo(()=>reference?compareTrace(output,reference):null,[output,reference]);
 const residual=useMemo(()=>metrics?Float64Array.from(metrics.residual,v=>v*1000):null,[metrics]);
 function download(){if(!reference)return;const lines=['# Cadet diagnostic acquisition v1',`# source=${source}; gain_pot=${gain}; route=${mode}; offset_pot=0.6; B_V=0; source_ohm=499; load_ohm=100000; ideal_rails_V=+/-12`,`# dt_ns=0.25; samples=4001; initial_state=DC; source_reconstruction=piecewise_linear; peak_limit_V=0.001; rms_limit_V=0.0001`,'sample,time_ns,input_V,runtime_V,reference_V,error_V'];for(let i=0;i<sampleCount;i++)lines.push([i,i*sampleNs,input[i],output[i],reference[i],output[i]-reference[i]].join(','));const url=URL.createObjectURL(new Blob([lines.join('\n')+'\n'],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download=`cadet-${key}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const selected=sources.find(s=>s.id===source)!;
 return <><section className="panel"><div className="sectionhead"><h2>Diagnostic acquisition</h2><span className="tag">SIMULATION REFERENCE · v1</span></div>
 <Tabs value={source} onValueChange={v=>setSource(String(v))}><TabsList className="navtabs" style={{height:'auto',flexWrap:'wrap'}}>{sources.map(s=><TabsTrigger key={s.id} value={s.id}>{s.name}</TabsTrigger>)}</TabsList></Tabs>
 <p>{selected.description}</p><div className="roadmap-focus"><div><label className="group-label">Nominal gain position</label><Tabs value={gain} onValueChange={v=>setGain(String(v))}><TabsList className="mode">{['0','0.5','1'].map(v=><TabsTrigger key={v} value={v}>{2*Number(v)-1}×</TabsTrigger>)}</TabsList></Tabs></div><div><label className="group-label">Offset route</label><Tabs value={mode} onValueChange={v=>setMode(String(v))}><TabsList className="mode"><TabsTrigger value="offset_input">Input path</TabsTrigger><TabsTrigger value="offset_thru">Thru path</TabsTrigger></TabsList></Tabs></div><div><p>1 µs · 4,001 samples · 0.25 ns spacing</p><p className="fine">Single acquisition, initialized at DC. Every selection recomputes the runtime output.</p></div></div></section>
 <section className="view"><div className="sectionhead"><h2>Voltage response</h2><span className="fine">Fixed scale · −0.4 to +0.3 V</span></div><Trace series={[{name:'Input',values:input,color:'#93adbf'},{name:'Runtime',values:output,color:'#f3b84b'},...(reference?[{name:'Reference',values:reference,color:'#66dfcb',dashed:true}]:[])]} min={-.4} max={.3} unit="V" cursor={cursor}/><div className="presets"><span style={{color:'#93adbf'}}>━ Input</span><span style={{color:'#f3b84b'}}>━ Runtime</span><span style={{color:'#66dfcb'}}>┄ Reference</span></div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}}><Strip name="Input" values={input}/><Strip name="Runtime" values={output}/>{reference&&<Strip name="Reference" values={reference}/>}</div><p className="fine">Time runs left to right, 0–1,000 ns, repeated vertically. All strips share black −0.4 V / white +0.3 V. Screen scaling compresses samples; use the cursor or CSV for exact values.</p></section>
 <section className="panel" aria-busy={!reference&&!error}><div className="sectionhead"><h2>Reference comparison</h2><strong role="status">{error?'UNAVAILABLE':metrics?(metrics.passed?'PASS':'FAIL'):'Loading reference…'}</strong></div>{error&&<p role="alert">{error}. No pass/fail claim is available for this selection.</p>}
 {metrics&&reference&&residual&&<><div className="readout"><span>Peak absolute error<b>{(metrics.peak*1000).toFixed(6)} mV</b></span><span>RMS error<b>{(metrics.rms*1000).toFixed(6)} mV</b></span><span>Mean signed error<b>{(metrics.bias*1000).toFixed(6)} mV</b></span></div><p>Limits: peak ≤1 mV and RMS ≤0.1 mV. Compared at all 4,001 samples, including startup; no alignment adjustment or fitted correction.</p>
 <Trace series={[{name:'Runtime minus reference',values:residual,color:'#f3b84b'}]} min={-1} max={1} unit="mV" cursor={cursor}/><p className="fine">Residual = runtime − reference. Fixed ±1 mV scale matches the peak-error limit.</p>
 <label className="group-label">Sample cursor · {(cursor*sampleNs).toFixed(2)} ns · sample {cursor} of 4000</label><Slider aria-label="Sample cursor" min={0} max={4000} step={1} value={[cursor]} onValueChange={v=>setCursor(Array.isArray(v)?v[0]:v)}/>
 <div className="readout"><span>Input<b>{input[cursor].toFixed(9)} V</b></span><span>Runtime<b>{output[cursor].toFixed(9)} V</b></span><span>Reference<b>{reference[cursor].toFixed(9)} V</b></span><span>Residual<b>{residual[cursor].toFixed(6)} mV</b></span></div>
 <div className="presets"><button onClick={()=>setCursor(metrics.peakIndex)}>Inspect worst sample</button><button onClick={download}>Export acquisition CSV</button></div></>}
 </section><div className="limit"><span>FIXED CIRCUIT</span><p>Offset 0.6; B = 0 V; 499 Ω sources; 100 kΩ load; ideal ±12 V supplies and offset reference. Sources are reconstructed linearly between samples. The reference is the retained four-amplifier simulation, not a hardware measurement. Numerical agreement does not calibrate a physical module.</p></div><section className="panel"><h2>Reproduce and inspect</h2><p>The runtime kernels are unchanged from the playable prototype. The diagnostic sources were not used to fit them. These checks cover six sources at six settings; they do not establish accuracy outside that boundary.</p><a href="/evidence/diagnostics/report.md" target="_blank">Method and complete results ↗</a> · <a href="/evidence/diagnostics/proof.tar.gz" download>Download reproduction bundle ↓</a> · <a href="/evidence/diagnostics/validation.json" target="_blank">All 36 cases ↗</a></section></>;
}
