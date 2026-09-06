import { assertContext } from './context-schema.js';
import { evaluate } from './workflow-model.js';
import { CALCULATION_VERSION } from './calculations.js';
const identifier=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(x);
const short=x=>typeof x==='string'&&x.trim().length>0&&x.length<=120;
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const scalar=x=>x===null||typeof x==='boolean'||typeof x==='string'&&x.length<=1000||typeof x==='number'&&Number.isFinite(x);
export function entryShape(e){
 if(!e||!identifier(e.id)||typeof e.createdAt!=='string'||!Number.isFinite(Date.parse(e.createdAt)))return false;
 if(e.kind==='job')return short(e.name);
 return e.kind==='calculation'&&identifier(e.jobId)&&short(e.part)&&short(e.weld)&&typeof e.modelVersion==='string'&&e.modelVersion.length>0&&e.modelVersion.length<80&&e.context&&['n','ug','xray','gamma','cr_check','cr_record','cr_estimate'].includes(e.context.kind)&&object(e.context.inputs)&&Object.values(e.context.inputs).every(scalar)&&object(e.context.form)&&Object.values(e.context.form).every(v=>typeof v==='string'&&v.length<=1000||typeof v==='boolean')&&object(e.result)&&typeof e.result.summary==='string'&&e.result.summary.length<300&&object(e.result.values)&&Object.values(e.result.values).every(scalar);
}
export function validEntry(e){
 if(!entryShape(e))return false;if(e.kind==='job')return true;
 try{
  if(![CALCULATION_VERSION,'2026-09-05.2'].includes(e.modelVersion))return false;
  assertContext(e.context);const expected=evaluate(e.context,{modelVersion:e.modelVersion});
  if(expected.status!==e.result.status||expected.summary!==e.result.summary)return false;
  const keys=Object.keys(expected.values);if(keys.length!==Object.keys(e.result.values).length)return false;
  return keys.every(key=>typeof expected.values[key]==='number'?typeof e.result.values[key]==='number'&&Math.abs(expected.values[key]-e.result.values[key])<=1e-10*Math.max(1,Math.abs(expected.values[key])):expected.values[key]===e.result.values[key]);
 }catch{return false;}
}
