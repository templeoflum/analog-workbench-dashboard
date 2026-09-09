// AC-derived FIR runtime. No SPICE execution or parameter fitting here.
export class SignalProcessor {
 constructor(kernel, dc, initialInput=0){
  if(!kernel.length || kernel.length>2048) throw new Error('Unsupported kernel');
  this.n=8192;this.dc=dc;this.h=Float64Array.from(kernel);this.history=new Float64Array(kernel.length-1).fill(initialInput);
  this.re=new Float64Array(this.n);this.im=new Float64Array(this.n);this.hr=new Float64Array(this.n);this.hi=new Float64Array(this.n);
  this.cos=new Float64Array(this.n/2);this.sin=new Float64Array(this.n/2);this.rev=new Uint16Array(this.n);
  for(let i=0;i<this.n/2;i++){this.cos[i]=Math.cos(2*Math.PI*i/this.n);this.sin[i]=Math.sin(2*Math.PI*i/this.n);}
  for(let i=0;i<this.n;i++){let x=i,r=0;for(let j=0;j<13;j++){r=(r<<1)|(x&1);x>>=1;}this.rev[i]=r;}
  this.hr.set(this.h);this.fft(this.hr,this.hi,false);
 }
 fft(re,im,inverse){
  const n=this.n;
  for(let i=0;i<n;i++){const j=this.rev[i];if(j>i){let t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t;}}
  for(let len=2;len<=n;len*=2){const half=len/2,step=n/len;
   for(let start=0;start<n;start+=len)for(let j=0;j<half;j++){
    const a=start+j,b=a+half,k=j*step,c=this.cos[k],s=inverse?this.sin[k]:-this.sin[k];
    const tr=re[b]*c-im[b]*s,ti=re[b]*s+im[b]*c;re[b]=re[a]-tr;im[b]=im[a]-ti;re[a]+=tr;im[a]+=ti;
   }
  }
  if(inverse)for(let i=0;i<n;i++){re[i]/=n;im[i]/=n;}
 }
 process(input){
  if(!input.length||input.length>4096)throw new Error('Block must contain 1..4096 samples');
  for(const v of input)if(!Number.isFinite(v)||v<0||v>.2)throw new Error('Input outside 0..0.2 V');
  const len=this.history.length;this.re.fill(0);this.im.fill(0);this.re.set(this.history);this.re.set(input,len);
  if(input.length>=len)this.history.set(input.subarray(input.length-len));else{this.history.copyWithin(0,input.length);this.history.set(input,len-input.length);}
  this.fft(this.re,this.im,false);
  for(let i=0;i<this.n;i++){const r=this.re[i]*this.hr[i]-this.im[i]*this.hi[i];this.im[i]=this.re[i]*this.hi[i]+this.im[i]*this.hr[i];this.re[i]=r;}
  this.fft(this.re,this.im,true);
  const output=new Float64Array(input.length);for(let i=0;i<output.length;i++)output[i]=this.dc+this.re[len+i];return output;
 }
}
// Moving, smooth monochrome pattern; limited to the agreed amplitude and slew.
export function patternBlock(frame, count=4096, previous=.1){
 const out=new Float64Array(count);const phase=frame*.04;
 for(let i=0;i<count;i++){
  const t=i*.25e-9;
  const target=.1+.06*Math.sin(2*Math.PI*2e6*t+phase)+.03*Math.sin(2*Math.PI*3.5e6*t-phase*.6);
  previous+=Math.max(-.005,Math.min(.005,target-previous));out[i]=previous;
 }
 return out;
}
