import { isMeasurement, createCrMeasurement } from './calculations.js';
import { validEntry, entryShape } from './entry-validation.js';

export const BACKUP_LIMIT=20*1024*1024;
export const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const copy=value=>JSON.parse(JSON.stringify(value));
const fail=message=>{throw new Error(message);};
const cleanEntry=({pending,...entry})=>copy(entry);
const legacyValid=r=>r&&typeof r.name==='string'&&r.name.length<=1000&&Number.isFinite(r.id)&&Number.isFinite(r.thickness);
function unique(rows,label){const ids=new Set();for(const row of rows){const id=String(row.id);if(ids.has(id))fail(`Záloha obsahuje opakované ID: ${label}.`);ids.add(id);}}
export function parseBackup(raw,{exportOnly=false}={}){
 if(typeof raw!=='string'||new TextEncoder().encode(raw).length>BACKUP_LIMIT)fail('Záloha může mít nejvýše 20 MB.');
 let data;try{data=JSON.parse(raw,(key,value)=>{if(['__proto__','constructor','prototype'].includes(key))throw new Error();return value;});}catch{fail('Soubor není platná záloha JSON.');}
 if(data?.app!=='rt-asistent'||data.version!==1)fail('Nepodporovaný formát nebo verze zálohy RT Asistenta.');
 if(!Array.isArray(data.entries)||!Array.isArray(data.library?.measurements)||!Array.isArray(data.library?.legacy))fail('V záloze chybí historie nebo CR knihovna.');
 const {entries,library}=data;
 if(entries.length+library.measurements.length+library.legacy.length>20000)fail('Záloha obsahuje příliš mnoho záznamů.');
 if(entries.some(e=>!(exportOnly?entryShape(e):validEntry(e))||JSON.stringify(e).length>50000||e.context?.reference&&!isMeasurement(e.context.reference)))fail('Záloha obsahuje neplatný, rozporný nebo nepodporovaný záznam historie. Původní data zůstala zachovaná.');
 if(library.measurements.some(r=>!isMeasurement(r))||library.legacy.some(r=>!legacyValid(r)||JSON.stringify(r).length>50000))fail('Záloha obsahuje neplatné CR měření nebo starý odhad.');
 unique(entries,'historie');unique(library.measurements,'CR měření');unique(library.legacy,'staré odhady');
 const jobs=new Set(entries.filter(e=>e.kind==='job').map(e=>e.id));
 if(entries.some(e=>e.kind==='calculation'&&!jobs.has(e.jobId)))fail('Některý výpočet odkazuje na chybějící zakázku.');
 return {app:'rt-asistent',version:1,exportedAt:data.exportedAt,entries:entries.map(cleanEntry),library:{measurements:library.measurements.map(r=>({...createCrMeasurement(r),id:r.id})),legacy:copy(library.legacy)}};
}
export function createBackup(entries,library){
 const data={app:'rt-asistent',version:1,exportedAt:new Date().toISOString(),entries:entries.map(cleanEntry),library:copy(library)};
 // Export preserves readable older/unknown history for recovery, while import
 // and replay must pass the stricter version-aware semantic validation.
 return parseBackup(JSON.stringify(data),{exportOnly:true});
}
function merge(existing,incoming,label){
 const byId=new Map(existing.map(row=>[String(row.id),row])),added=[];let skipped=0;
 for(const row of incoming){const old=byId.get(String(row.id));if(old){if(canonical(old)!==canonical(row))fail(`Stejné ID má odlišný obsah (${label}). Obnova byla zastavena; původní data zůstávají beze změny.`);skipped++;}else added.push(row);}
 return {added,skipped,all:[...existing,...added]};
}
export function planRestore(data,entries,library){
 const history=merge(entries.map(cleanEntry),data.entries,'historie'),modern=merge(library.measurements,data.library.measurements,'CR měření'),legacy=merge(library.legacy,data.library.legacy,'staré odhady');
 return {entries:history.added,library:{measurements:modern.all,legacy:legacy.all},counts:{jobs:history.added.filter(e=>e.kind==='job').length,calculations:history.added.filter(e=>e.kind==='calculation').length,measurements:modern.added.length,legacy:legacy.added.length,skipped:history.skipped+modern.skipped+legacy.skipped}};
}
