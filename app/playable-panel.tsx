"use client";
import {useEffect,useRef,useState} from 'react';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Input} from '@/components/ui/input';
import {SignalProcessor,patternBlock} from '@/lib/signal-runtime.mjs';
import {sources,diagnosticInput} from '@/lib/diagnostic-source.mjs';
import {makePatch,decodePatch,decodeLibrary,MODEL_ID} from '@/lib/instrument-patches.mjs';
import model from './playable-model.json';
type Patch=ReturnType<typeof makePatch>;
type Frame={input:Float64Array,output:Float64Array,index:number,source:string,gain:string,mode:string};
const LIBRARY='phosphlux:patches:v1';
export default function PlayablePanel(){
 const [gain,setGain]=useState('1'),[mode,setMode]=useState('offset_input'),[source,setSource]=useState('moving'),[running,setRunning]=useState(true),[reset,setReset]=useState(0),[step,setStep]=useState(0);
 const [name,setName]=useState('First light'),[patches,setPatches]=useState<Patch[]>([]),[storageReady,setStorageReady]=useState(false),[message,setMessage]=useState('');
 const [stats,setStats]=useState({fps:0,min:0,max:0,frame:0,clipped:0});
 const a=useRef<HTMLCanvasElement>(null),b=useRef<HTMLCanvasElement>(null),wave=useRef<HTMLCanvasElement>(null),file=useRef<HTMLInputElement>(null),snapshot=useRef<Frame|null>(null);
 const lastStep=useRef(0);
 const state=useRef<{processor:SignalProcessor,key:string,frame:number,previous:number}|null>(null);
 useEffect(()=>{try{const raw=localStorage.getItem(LIBRARY);setPatches(raw?decodeLibrary(raw):[]);setStorageReady(true);}catch{setMessage('Saved patches could not be read. Existing storage is preserved; patch export still works.');}},[]);
 useEffect(()=>{
  const c=model.cases.find(c=>c.mode===mode&&c.gain===Number(gain))!,key=mode+gain+source+reset;
  const changed=state.current?.key!==key;
  if(changed)state.current={processor:new SignalProcessor(c.kernel,c.dc,.1),key,frame:0,previous:.1};
  let request=0,last=performance.now(),windowStart=0,frames=0;
  function draw(t:number){
   const s=state.current!;const input=source==='moving'?patternBlock(s.frame,4096,s.previous):diagnosticInput(source);
   if(source!=='moving')s.processor=new SignalProcessor(c.kernel,c.dc,input[0]);
   s.previous=input[input.length-1];const out=s.processor.process(input),index=s.frame++;
   snapshot.current={input,output:out,index,source,gain,mode};
   [a,b].forEach((ref,which)=>{const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;
    const moving=source==='moving';canvas.width=moving?128:input.length;canvas.height=moving?32:1;const im=ctx.createImageData(canvas.width,canvas.height),values=which?out:input;
    for(let i=0;i<values.length;i++){const v=Math.round(255*Math.max(0,Math.min(1,(values[i]+.4)/.7)));im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=v;im.data[i*4+3]=255;}ctx.putImageData(im,0,0);
   });
   const ctx=wave.current?.getContext('2d');if(ctx){ctx.clearRect(0,0,640,180);ctx.strokeStyle='#35424c';ctx.beginPath();ctx.moveTo(0,180*.3/.7);ctx.lineTo(640,180*.3/.7);ctx.stroke();[input,out].forEach((values,i)=>{ctx.strokeStyle=i?'#f3b84b':'#93adbf';ctx.lineWidth=1.5;ctx.beginPath();for(let j=0;j<values.length;j++){const x=j/(values.length-1)*640,y=(.3-values[j])/.7*180;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();});}
   frames++;if(!windowStart)windowStart=t;const elapsed=t-windowStart;
   if(!running||index===0||elapsed>=1000){setStats({fps:elapsed>0?frames*1000/elapsed:0,min:Math.min(...out),max:Math.max(...out),frame:index,clipped:out.filter(v=>v<-.4||v>.3).length/out.length*100});if(elapsed>=1000){frames=0;windowStart=t;}}
  }
  if(changed||!snapshot.current||step!==lastStep.current)draw(performance.now());
  lastStep.current=step;
  function tick(t:number){if(t-last>=1000/30-1){last=t;draw(t);}request=requestAnimationFrame(tick);}
  if(running)request=requestAnimationFrame(tick);return()=>cancelAnimationFrame(request);
 },[gain,mode,source,running,reset,step]);
 function apply(p:Patch){setRunning(false);setSource(p.source);setGain(String(p.gain));setMode(p.mode);setName(p.name);setReset(n=>n+1);setMessage('Patch loaded at its initial state. Press Play or Step.');}
 function save(){try{const p=makePatch(name,source,Number(gain),mode);if(!storageReady)throw Error('Storage unavailable; export a patch file instead');if(patches.length>=50)throw Error('Library holds 50 patches; remove one before saving');if(patches.some(x=>x.name===p.name))throw Error('Choose a new name to preserve the existing patch');const next=[...patches,p];localStorage.setItem(LIBRARY,JSON.stringify(next));setPatches(next);setMessage('Saved on this browser. Export a patch file for backup.');}catch(e){setMessage(e instanceof Error?e.message:'Could not save');}}
 function remove(index:number){try{const next=patches.filter((_,i)=>i!==index);localStorage.setItem(LIBRARY,JSON.stringify(next));setPatches(next);setMessage('Patch removed from this browser.');}catch{setMessage('Could not update saved patches.');}}
 function download(blob:Blob,filename:string){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function exportPatch(){try{const p=makePatch(name,source,Number(gain),mode);download(new Blob([JSON.stringify(p,null,2)],{type:'application/json'}),'phosphlux-patch.json');setMessage('Patch exported. Loading it restarts the source from its initial state.');}catch(e){setMessage(String(e));}}
 async function importPatch(f:File){try{if(f.size>65536)throw Error('Patch file is too large');apply(decodePatch(await f.text()));}catch(e){setMessage(e instanceof Error?e.message:'Invalid patch');}}
 function exportCSV(){const f=snapshot.current;if(!f)return;const rows=[`# ${MODEL_ID}`,`# PROVISIONAL; source=${f.source}; gain_pot=${f.gain}; route=${f.mode}; frame=${f.index}; dt_ns=0.25`,`# offset_pot=0.6; B_V=0; source_ohm=499; load_ohm=100000; ideal_rails_V=+/-12`,'sample,time_within_block_ns,input_V,output_V'];for(let i=0;i<f.input.length;i++)rows.push([i,i*.25,f.input[i],f.output[i]].join(','));download(new Blob([rows.join('\n')+'\n'],{type:'text/csv'}),'phosphlux-frame.csv');setMessage('Current frame exported with settings and provisional model identity.');}
 function exportPNG(){const f=snapshot.current;if(!f||!a.current||!b.current)return;const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=540;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.fillStyle='#101419';ctx.fillRect(0,0,1200,540);ctx.fillStyle='#e8edf1';ctx.font='24px sans-serif';ctx.fillText('PHOSPHLUX · '+name.slice(0,64),30,42);ctx.font='16px sans-serif';ctx.fillText('INPUT',30,85);ctx.fillText('OUTPUT',620,85);ctx.imageSmoothingEnabled=false;ctx.drawImage(a.current,30,100,550,300);ctx.drawImage(b.current,620,100,550,300);ctx.fillText(`Source ${f.source} · gain pot ${f.gain} · ${f.mode} · frame ${f.index}`,30,440);ctx.fillText('Fixed black −0.4 V / white +0.3 V · display clipping only',30,470);ctx.fillText('PROVISIONAL ANALOG MODEL · hardware fidelity unverified',30,500);canvas.toBlob(blob=>{if(blob)download(blob,'phosphlux-frame.png');else setMessage('Image export failed');},'image/png');}
 return <><div className="sectionhead"><div><p className="eyebrow">PHOSPHLUX / INSTRUMENT</p><h2>Source → Cadet channel → Output</h2></div><span className="tag">PROVISIONAL MODEL</span></div>
 <div className="lab"><section className="view"><div className="screens" style={{gridTemplateColumns:'repeat(2,minmax(0,1fr))'}}><figure><figcaption>Input</figcaption><canvas ref={a} width="128" height="32" style={{aspectRatio:'2',imageRendering:'pixelated'}} aria-label="Selected source image"/></figure><figure><figcaption>Processed output</figcaption><canvas ref={b} width="128" height="32" style={{aspectRatio:'2',imageRendering:'pixelated'}} aria-label="Provisional channel output"/></figure></div>
 <div className="presets"><button onClick={()=>setRunning(!running)}>{running?'Pause':'Play'}</button><button disabled={running} onClick={()=>setStep(n=>n+1)}>Step</button><button onClick={()=>{setRunning(false);setReset(n=>n+1);}}>Restart</button><button onClick={exportPNG}>Save image</button><button onClick={exportCSV}>Export frame data</button></div>
 <canvas ref={wave} width="640" height="180" style={{width:'100%',background:'#101419'}} aria-label="Current input and output waveforms at a fixed minus 0.4 to plus 0.3 volt scale"/><div className="presets"><span style={{color:'#93adbf'}}>━ Input</span><span style={{color:'#f3b84b'}}>━ Output</span><span>Time → · 0.25 ns/sample</span></div>
 <div className="readout"><span>Output range<b>{stats.min.toFixed(3)} to {stats.max.toFixed(3)} V</b></span><span>Display clipping<b>{stats.clipped.toFixed(2)}%</b></span><span>Draw rate<b>{running?(stats.fps?stats.fps.toFixed(1)+' fps':'Measuring…'):'Paused'}</b></span></div><p className="fine">Fixed black −0.4 V / white +0.3 V. Display clipping never changes the exported voltage data.</p></section>
 <aside className="panel"><h2>Patch controls</h2><label className="group-label">Source</label><Tabs value={source} onValueChange={v=>setSource(String(v))}><TabsList className="navtabs" style={{height:'auto',flexWrap:'wrap'}}><TabsTrigger value="moving">Moving pattern</TabsTrigger>{sources.map(s=><TabsTrigger key={s.id} value={s.id}>{s.name}</TabsTrigger>)}</TabsList></Tabs>
 <label className="group-label">Gain position</label><Tabs value={gain} onValueChange={v=>setGain(String(v))}><TabsList className="mode">{['0','0.5','1'].map(v=><TabsTrigger key={v} value={v}>{2*Number(v)-1}×</TabsTrigger>)}</TabsList></Tabs>
 <label className="group-label">Offset route</label><Tabs value={mode} onValueChange={v=>setMode(String(v))}><TabsList className="mode"><TabsTrigger value="offset_input">Input path</TabsTrigger><TabsTrigger value="offset_thru">Thru path</TabsTrigger></TabsList></Tabs>
 <p className="fine">{source==='moving'?'Moving pattern retains filter history between 4,096-sample blocks. Restart resets its phase and history.':'Diagnostics repeat the same 4,001-sample acquisition from DC; Play does not create a continuous electrical signal.'}</p></aside></div>
 <section className="panel"><h2>Your patches</h2><div className="presets"><Input aria-label="Patch name" maxLength={64} value={name} onChange={e=>setName(e.target.value)} style={{maxWidth:280}}/><button onClick={save} disabled={!storageReady}>Save new patch</button><button onClick={exportPatch}>Export patch</button><button onClick={()=>file.current?.click()}>Import patch</button><input ref={file} type="file" accept=".json,application/json" hidden onChange={e=>{const f=e.target.files?.[0];if(f)void importPatch(f);e.target.value='';}}/></div><p role="status">{message||'Patches are stored in this browser. Export them to keep a portable backup.'}</p><div className="presets">{patches.map((p,i)=><span key={p.name}><button onClick={()=>apply(p)}>{p.name}</button> <button aria-label={'Remove '+p.name} onClick={()=>remove(i)}>×</button></span>)}</div>
 <p className="fine">Try a starting patch:</p><div className="presets"><button onClick={()=>apply(makePatch('Moving / invert','moving',0,'offset_input'))}>Moving / invert</button><button onClick={()=>apply(makePatch('Moving / forward','moving',1,'offset_input'))}>Moving / forward</button><button onClick={()=>apply(makePatch('Staircase / forward','staircase',1,'offset_thru'))}>Staircase / forward</button></div></section>
 <div className="limit"><span>WORKING SCOPE</span><p>Fixed offset 0.6, B=0 V, 499 Ω sources, 100 kΩ load, ideal ±12 V supplies/reference. This is a sampled-signal instrument, not standard video timing or a verified hardware emulator. Hardware validation is deferred. Existing diagnostics and evidence remain available; Artifice is the next development direction.</p></div></>;
}
