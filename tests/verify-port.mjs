import {evaluate} from '../lib/cadet.mjs';
import fs from 'node:fs';
const rows=JSON.parse(fs.readFileSync(new URL('./circuit-reference.json',import.meta.url)));let max=0;
for(const {args,expected} of rows){if(args[6]===null)args[6]=Infinity;max=Math.max(max,Math.abs(evaluate(...args)-expected));}
if(max>1e-10)throw Error(`Port mismatch: ${max}`);
console.log(JSON.stringify({cases:rows.length,maxErrorVolts:max,reference:'Independent Python nodal circuit solver',scope:'Ideal DC only'},null,2));
