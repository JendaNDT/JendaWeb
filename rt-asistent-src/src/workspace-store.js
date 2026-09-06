import { canonical, planRestore } from './backup.js';
const LOCAL='@local';
// Former account scopes survive only as separate local archives; no network API.
export function createWorkspaceStore({indexedDB=globalThis.indexedDB,onChange=()=>{}}={}){
 let db,archive=LOCAL,items=[],all=[],closed=false;
 const owner=()=>archive;
 const open=()=>new Promise((resolve,reject)=>{if(!indexedDB)return reject(new Error('Prohlížeč nepovoluje úložiště pro práci offline.'));const r=indexedDB.open('rt-workspace-v1',1);r.onupgradeneeded=()=>{r.result.createObjectStore('entries',{keyPath:'key'});r.result.createObjectStore('meta');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Zavřete starší otevřenou verzi aplikace.'));});
 const tx=(name,access,action)=>new Promise((resolve,reject)=>{const t=db.transaction(name,access),request=action(t.objectStore(name));t.oncomplete=()=>resolve(request?.result);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('Uložení bylo přerušeno.'));});
 const reload=async()=>{if(closed)return;all=await tx('entries','readonly',s=>s.getAll());items=all.filter(r=>r.owner===owner());if(!closed)onChange();};
 const archives=()=>[...new Set([LOCAL,...all.map(r=>r.owner),archive])].map((id,i)=>({id,label:id===LOCAL?'Místní archiv':'Převedený archiv '+i,count:all.filter(r=>r.owner===id).length}));
 async function init(){
  db=await open();if(closed){db.close();return;}
  // Atomic, idempotent conversion: preserve records, IDs and CR restore journal.
  await new Promise((resolve,reject)=>{const t=db.transaction(['entries','meta'],'readwrite'),s=t.objectStore('entries'),m=t.objectStore('meta'),rows=s.getAll(),meta=m.getAllKeys();
   meta.onsuccess=()=>{const saved=m.get('local-archive'),oldOwner=m.get('owner'),oldMode=m.get('mode');oldMode.onsuccess=()=>{
    const available=new Set(rows.result.map(r=>r.owner));archive=saved.result||(oldMode.result!=='local'&&oldOwner.result?oldOwner.result:LOCAL);
    if(archive!==LOCAL&&!available.has(archive))archive=available.has(LOCAL)?LOCAL:rows.result[0]?.owner||LOCAL;
    for(const row of rows.result)if(row.pending)s.put({...row,pending:false});
    for(const key of meta.result)if(key==='owner'||key==='mode'||String(key).startsWith('cursor/'))m.delete(key);
    m.put(archive,'local-archive');
   };};t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('Převod místních dat byl přerušen.'));
  });await reload();
 }
 async function add(data){if(!db||closed)throw new Error('Úložiště zatím není připravené.');const scope=owner();await tx('entries','readwrite',s=>s.add({key:scope+'/'+data.id,owner:scope,data,pending:false}));await reload();}
 async function setArchive(next){await reload();if(!archives().some(a=>a.id===next))throw new Error('Místní archiv není dostupný.');await tx('meta','readwrite',s=>s.put(next,'local-archive'));archive=next;await reload();}
 async function importEntries(entries,library,expectedOwner=owner()){
  const scope=owner(),pending=false;if(scope!==expectedOwner)throw new Error('Změnil se místní archiv. Znovu načtěte zálohu.');
  // One transaction adds all history and a recoverable CR-library journal.
  await new Promise((resolve,reject)=>{const t=db.transaction(['entries','meta'],'readwrite'),s=t.objectStore('entries'),r=s.getAll(),journal=t.objectStore('meta').get('library-restore');let error;
   journal.onsuccess=()=>{try{const existing=new Map(r.result.filter(e=>e.owner===scope).map(e=>[e.data.id,e.data]));for(const data of entries){const old=existing.get(data.id);if(old&&canonical(old)!==canonical(data))throw new Error('Obsah historie se mezitím změnil. Znovu načtěte zálohu.');if(!old)s.add({key:scope+'/'+data.id,owner:scope,data,pending});}const merged=planRestore({entries:[],library},[],journal.result||{measurements:[],legacy:[]}).library;t.objectStore('meta').put(merged,'library-restore');}catch(e){error=e;t.abort();}};
   t.oncomplete=resolve;t.onerror=()=>reject(error||t.error);t.onabort=()=>reject(error||t.error||new Error('Obnova byla přerušena.'));
  });await reload();
 }
 return {init,add,setArchive,archives,importEntries,reload,entries:()=>items.map(r=>({...r.data})),owner,
  pendingLibrary:()=>tx('meta','readonly',s=>s.get('library-restore')),
  finishLibraryRestore:expected=>new Promise((resolve,reject)=>{const t=db.transaction('meta','readwrite'),s=t.objectStore('meta'),r=s.get('library-restore');let cleared=false;r.onsuccess=()=>{if(expected===undefined||canonical(r.result)===canonical(expected)){s.delete('library-restore');cleared=true;}};t.oncomplete=()=>resolve(cleared);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);}),
  close(){closed=true;db?.close();}};
}
