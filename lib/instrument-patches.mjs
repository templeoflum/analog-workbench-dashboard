export const MODEL_ID = "cadet-vii-partial-08ab31fb41ce5d99467151807ffb54b5fbccdecbf239b7a77a39f142dac1278b";
export const SOURCE_IDS=['moving','flat','staircase','ramp','pulse','sine1','sine5'];
export function validatePatch(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Expected a patch object');
 const keys=['format','model','name','source','gain','mode'];
 if(Object.keys(value).length!==keys.length||Object.keys(value).some(k=>!keys.includes(k)))throw Error('Unexpected patch fields');
 if(value.format!=='phosphlux-patch-v1'||value.model!==MODEL_ID)throw Error('Patch belongs to a different format or model');
 if(typeof value.name!=='string'||!value.name.trim()||value.name.length>64)throw Error('Use a patch name of 1–64 characters');
 if(!SOURCE_IDS.includes(value.source)||![0,.5,1].includes(value.gain)||!['offset_input','offset_thru'].includes(value.mode))throw Error('Patch contains unsupported controls');
 return {...value,name:value.name.trim()};
}
export function makePatch(name,source,gain,mode){return validatePatch({format:'phosphlux-patch-v1',model:MODEL_ID,name,source,gain,mode});}
export function decodePatch(text){if(typeof text!=='string'||text.length>65536)throw Error('Patch file is too large');return validatePatch(JSON.parse(text));}
export function decodeLibrary(text){const list=JSON.parse(text);if(!Array.isArray(list)||list.length>50)throw Error('Saved patch library is invalid');return list.map(validatePatch);}
