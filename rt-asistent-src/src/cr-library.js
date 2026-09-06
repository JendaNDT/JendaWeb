import { canonical, planRestore } from './backup.js';
import { createCrMeasurement } from './calculations.js';

// Per-record transactions prevent a stale tab from replacing the whole library.
// The original localStorage snapshot is retained for recovery. Remembering every
// migrated ID also prevents deleted records reappearing from an older tab.
export function createCrLibrary({indexedDB,channel=null,onChange=()=>{}}){
 let db,closed=false;
 const transaction=(stores,action)=>new Promise((resolve,reject)=>{
  if(!db||closed)return reject(new Error('CR úložiště není dostupné.'));
  const t=db.transaction(stores,'readwrite');let error;
  const fail=e=>{error=e;t.abort();};
  try{action(t,fail);}catch(e){fail(e);}
  t.oncomplete=resolve;t.onerror=()=>reject(error||t.error);t.onabort=()=>reject(error||t.error||new Error('Uložení CR bylo přerušeno.'));
 });
 const unpack=rows=>({measurements:rows.filter(r=>r.kind==='measurement').map(r=>({...createCrMeasurement(r.data),id:r.data.id})),legacy:rows.filter(r=>r.kind==='legacy').map(r=>r.data)});
 async function snapshot(){
  if(!db||closed)throw new Error('CR úložiště není dostupné.');
  const rows=await new Promise((resolve,reject)=>{const t=db.transaction('records'),r=t.objectStore('records').getAll();t.oncomplete=()=>resolve(r.result);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('Čtení CR bylo přerušeno.'));});
  return unpack(rows.sort((a,b)=>b.savedAt-a.savedAt||a.key.localeCompare(b.key)));
 }
 const notify=()=>{if(!closed){channel?.postMessage('changed');onChange();}};
 async function merge(incoming,{migration=false}={}){
  await transaction(['records','migrated'],(t,fail)=>{
   const records=t.objectStore('records'),seen=t.objectStore('migrated'),request=records.getAll(),marked=seen.getAllKeys();
   marked.onsuccess=()=>{try{
    const existing=unpack(request.result),known=new Set(marked.result);
    const filtered={measurements:incoming.measurements.filter(r=>!migration||!known.has('measurement/'+r.id)),legacy:incoming.legacy.filter(r=>!migration||!known.has('legacy/'+r.id))};
    // Validate the entire merge before queuing any write.
    const plan=planRestore({entries:[],library:filtered},[],existing),present=new Map(request.result.map(r=>[r.key,r]));
    for(const [kind,rows]of [['measurement',plan.library.measurements],['legacy',plan.library.legacy]])for(const data of rows){const key=kind+'/'+data.id;if(!present.has(key))records.add({key,kind,data,savedAt:Date.now()});}
    if(migration)for(const [kind,rows]of [['measurement',incoming.measurements],['legacy',incoming.legacy]])for(const r of rows)seen.put(true,kind+'/'+r.id);
   }catch(e){fail(e);}};
  });notify();
 }
 async function init(legacy,{hiddenLegacy=[]}={}){
  db=await new Promise((resolve,reject)=>{const r=indexedDB.open('rt-cr-library-v1',1);r.onupgradeneeded=()=>{r.result.createObjectStore('records',{keyPath:'key'});r.result.createObjectStore('migrated');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Zavřete starší karty aplikace.'));});
  if(closed){db.close();return;}db.onversionchange=()=>{db.close();closed=true;};
  if(channel)channel.onmessage=()=>{if(!closed)onChange();};
  if(hiddenLegacy.length)await transaction(['migrated'],t=>{for(const id of hiddenLegacy)t.objectStore('migrated').put(true,'legacy/'+id);});
  await merge(legacy,{migration:true});
 }
 async function add(record){
  await transaction(['records'],(t,fail)=>{const s=t.objectStore('records'),key='measurement/'+record.id,r=s.get(key);r.onsuccess=()=>{try{if(r.result){if(canonical(r.result.data)!==canonical(record))throw new Error('Stejné ID CR měření má odlišný obsah.');}else s.add({key,kind:'measurement',data:record,savedAt:Date.now()});}catch(e){fail(e);}};});notify();
 }
 async function remove(kind,id){await transaction(['records','migrated'],t=>{t.objectStore('records').delete(kind+'/'+id);t.objectStore('migrated').put(true,kind+'/'+id);});notify();}
 return {init,snapshot,add,remove,merge,close(){closed=true;channel?.close();db?.close();}};
}
