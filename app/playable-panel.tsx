"use client";
import {useEffect,useRef,useState} from 'react';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {SignalProcessor,patternBlock} from '@/lib/signal-runtime.mjs';
import model from './playable-model.json';
export default function PlayablePanel(){
 const [gain,setGain]=useState('1'),[mode,setMode]=useState('offset_input'),[running,setRunning]=useState(true);
 const [stats,setStats]=useState({fps:0,ms:0,min:0,max:0});
 const a=useRef<HTMLCanvasElement>(null),b=useRef<HTMLCanvasElement>(null),wave=useRef<HTMLCanvasElement>(null);
 const state=useRef<{processor:SignalProcessor,key:string,frame:number,previous:number}|null>(null);
 useEffect(()=>{
  const c=model.cases.find(c=>c.mode===mode&&c.gain===Number(gain))!;const key=mode+gain;
  if(state.current?.key!==key)state.current={processor:new SignalProcessor(c.kernel,c.dc,.1),key,frame:0,previous:.1};
  let request=0,last=0,windowStart=0,frames=0;
  function draw(t:number){
   if(!running)return;
   if(!last||t-last>=1000/30-1){
    last=t;if(!windowStart)windowStart=t;const start=performance.now(),s=state.current!;
    const input=patternBlock(s.frame++,4096,s.previous);s.previous=input[input.length-1];const out=s.processor.process(input);
    [a,b].forEach((ref,index)=>{const ctx=ref.current?.getContext('2d');if(!ctx)return;const im=ctx.createImageData(128,32),data=index?out:input;
     for(let i=0;i<data.length;i++){const v=Math.round(255*Math.max(0,Math.min(1,(data[i]+.4)/.7)));im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=v;im.data[i*4+3]=255;}ctx.putImageData(im,0,0);});
    const ctx=wave.current?.getContext('2d');if(ctx){ctx.clearRect(0,0,640,180);ctx.strokeStyle='#35424c';ctx.beginPath();ctx.moveTo(0,180*(.3/.7));ctx.lineTo(640,180*(.3/.7));ctx.stroke();[input,out].forEach((data,index)=>{ctx.strokeStyle=index?'#f3b84b':'#93adbf';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<data.length;i+=8){const x=i/4095*640,y=(.3-data[i])/.7*180;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();});}
    frames++;if(t-windowStart>=1000){setStats({fps:frames*1000/(t-windowStart),ms:performance.now()-start,min:Math.min(...out),max:Math.max(...out)});frames=0;windowStart=t;}
   }
   request=requestAnimationFrame(draw);
  }
  request=requestAnimationFrame(draw);return()=>cancelAnimationFrame(request);
 },[gain,mode,running]);
 return <><div className="lab"><section className="view"><div className="sectionhead"><h2>Moving signal</h2><span className="tag">BOUNDED DYNAMIC PROTOTYPE</span></div>
 <div className="screens" style={{gridTemplateColumns:'repeat(2,minmax(0,1fr))'}}><figure><figcaption><b>A</b> Moving input</figcaption><canvas ref={a} width="128" height="32" style={{aspectRatio:'2',imageRendering:'pixelated'}} aria-label="Moving monochrome input, sampled in row order"/></figure><figure><figcaption><b>OUT</b> Circuit-derived response</figcaption><canvas ref={b} width="128" height="32" style={{aspectRatio:'2',imageRendering:'pixelated'}} aria-label="Dynamic processed monochrome output"/></figure></div>
 <p className="fine">Both images use the same fixed scale: black −0.4 V → white +0.3 V. Brightness is never automatically normalized.</p>
 <canvas ref={wave} width="640" height="180" style={{width:'100%',background:'#101419'}} aria-label="Input and output waveforms over 1.024 microseconds, fixed voltage scale from minus 0.4 to plus 0.3 volts"/>
 <div className="presets"><span style={{color:'#93adbf'}}>━ Input</span><span style={{color:'#f3b84b'}}>━ Output</span><span>1.024 µs per displayed block · zero-voltage line</span></div>
 <div className="readout"><span>Browser draw rate<b>{running?(stats.fps?stats.fps.toFixed(1)+' fps':'Measuring…'):'Paused'}</b></span><span>Last draw work<b>{stats.ms.toFixed(2)} ms</b></span><span>Output range<b>{stats.min.toFixed(3)} to {stats.max.toFixed(3)} V</b></span></div>
 </section><aside className="panel"><h2>Signal controls</h2><label className="group-label">Gain position</label><Tabs value={gain} onValueChange={v=>setGain(String(v))}><TabsList className="mode">{['0','0.5','1'].map(v=><TabsTrigger key={v} value={v}>{2*Number(v)-1}×</TabsTrigger>)}</TabsList></Tabs>
 <label className="group-label">Apply offset to</label><Tabs value={mode} onValueChange={v=>setMode(String(v))}><TabsList className="mode"><TabsTrigger value="offset_input">Input path</TabsTrigger><TabsTrigger value="offset_thru">Thru path</TabsTrigger></TabsList></Tabs>
 <div className="presets"><button onClick={()=>setRunning(!running)}>{running?'Pause':'Play'}</button></div><p className="fine">Changing a circuit setting restarts at its DC state. Play resumes the signal history.</p><p>Fixed: offset 0.6; B = 0 V; 499 Ω sources; 100 kΩ load; ideal ±12 V supplies and offset reference.</p><p className="fine">Target: 30 draws/second. The counter measures canvas updates, not physical display refresh.</p></aside></div>
 <div className="limit"><span>WHAT THIS IS</span><p>A filter derived from the four-amplifier circuit response, processing fresh samples and retaining signal history. The animation slows down electrical time; it is not an NTSC/PAL video stream or a full Cadet emulator. Large-signal clipping, real power/reference behavior and hardware matching remain unqualified.</p></div>
 <section className="panel"><h2>Accuracy you can inspect</h2><p>Held-out pulses, ramps and 5 MHz sine waves: 18/18 passed the predeclared 1 mV peak and 0.1 mV RMS limits. Inputs stayed within 0–0.2 V. Six additional checks of one moving-pattern phase also passed. Other phases and transitions are not exhaustively checked. The tested runtime also agrees with the independent direct convolution calculation across different block sizes.</p><a href="/evidence/playable/report.md" target="_blank">Scope, measured results and reproduction steps ↗</a> · <a href="/evidence/playable/runtime-validation.json" target="_blank">Runtime checks ↗</a> · <a href="/evidence/playable/proof.tar.gz" download>Download reproduction bundle ↓</a></section></>;
}
