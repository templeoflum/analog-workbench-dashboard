'use client';
import {useEffect,useState} from 'react';
import current from './revision.json';
export default function LiveUpdates(){
 const [message,setMessage]=useState('Updates automatically');
 useEffect(()=>{
  let disposed=false,busy=false,reloading=false;
  const abort=new AbortController();
  async function check(){
   if(disposed||busy||reloading||document.visibilityState==='hidden')return;
   busy=true;
   try{
    const response=await fetch(`/api/revision?t=${Date.now()}`,{cache:'no-store',signal:abort.signal});
    if(!response.ok)throw Error('Unavailable');
    const data=await response.json();
    if(!data||typeof data!=='object'||!('revision' in data)||typeof data.revision!=='string'||!/^[a-f0-9]{64}$/.test(data.revision))throw Error('Invalid revision');
    if(disposed)return;
    if(data.revision!==current.revision){
     reloading=true;setMessage('Updating…');
     window.dispatchEvent(new Event('workbench:before-update'));
     window.location.reload();
    }else setMessage('Updates automatically');
   }catch{if(!disposed)setMessage('Update check paused · retrying');}
   finally{busy=false;}
  }
  const interval=window.setInterval(check,15000);
  document.addEventListener('visibilitychange',check);void check();
  return()=>{disposed=true;abort.abort();window.clearInterval(interval);document.removeEventListener('visibilitychange',check);};
 },[]);
 return <span className="snapshot" role="status" title="Checks for published updates every 15 seconds">{message}</span>;
}
