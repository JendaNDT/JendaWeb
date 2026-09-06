import {test} from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {createWorkspaceStore} from '../src/workspace-store.js';
import {createBackup,parseBackup,planRestore} from '../src/backup.js';
import {createCrMeasurement} from '../src/calculations.js';
import {historyEntry} from '../src/workflow-model.js';
const job={id:'job-local',kind:'job',name:'Terén',createdAt:'2026-09-06T08:00:00Z'};
const calculation=historyEntry({id:'calculation-local',jobId:job.id,part:'Trubka',weld:'S-01',context:{kind:'ug',inputs:{technique:'single',focus:1.5,sourceDistance:500,thickness:10,gap:0,qualityClass:'B'},form:{ug_focus:'1.5',ug_source_distance:'500'}}});
const measurement=createCrMeasurement({id:'cr-1',name:'Reference',setup:'Tube/IP',scan:'50 um',screens:'Pb',current:2,seconds:120,fdd:1000,srb:.13,magnification:1,delay:10,measuredAt:'2026-09-06T08:00:00Z',material:'steel',thickness:40,voltage:400,qualityClass:'B',roi:'weld',flush:false,cp1:false,iqiConfirmed:false,kind:'normalized',measured:110});
const empty={measurements:[],legacy:[]},library={measurements:[measurement],legacy:[{id:1,name:'Starý odhad',thickness:40}]};
const backup=()=>createBackup([job,calculation],library);

test('backup preserves drawing and batch, accepts old records and rejects invalid optional metadata',async()=>{
 const tagged=historyEntry({...calculation,id:'tagged',drawingNumber:' V-0042 ',batch:' D-09 '}),old={...calculation};delete old.drawingNumber;delete old.batch;
 const data=parseBackup(JSON.stringify(createBackup([job,old,tagged],empty)));assert.deepEqual(data.entries,[job,old,tagged]);
 assert.equal(tagged.drawingNumber,'V-0042');assert.equal(tagged.batch,'D-09');assert.equal('drawingNumber' in data.entries[1],false);
 const s=createWorkspaceStore({indexedDB:new IDBFactory()});await s.init();await s.importEntries(data.entries,empty);await s.reload();
 assert.equal(s.entries().find(e=>e.id==='tagged').batch,'D-09');assert.equal(planRestore(data,s.entries(),empty).counts.skipped,3);
 for(const key of ['drawingNumber','batch'])for(const invalid of [null,7,{},'x'.repeat(121)]){
  assert.throws(()=>parseBackup(JSON.stringify({...data,entries:[job,{...tagged,[key]:invalid}]})),/neplatný/);
  assert.throws(()=>historyEntry({...calculation,[key]:invalid}),/text do 120/);
 }
 assert.throws(()=>planRestore({...data,entries:[{...tagged,batch:'Jiná dávka'}]},s.entries(),empty),/odlišný obsah/);s.close();
});

async function seed(indexedDB){const r=indexedDB.open('rt-workspace-v1',1);r.onupgradeneeded=()=>{r.result.createObjectStore('entries',{keyPath:'key'});r.result.createObjectStore('meta');};await new Promise((resolve,reject)=>{r.onsuccess=resolve;r.onerror=reject;});const db=r.result;await new Promise(resolve=>{const t=db.transaction(['entries','meta'],'readwrite'),e=t.objectStore('entries'),m=t.objectStore('meta');for(const scope of ['@local','user-a','user-b'])e.put({key:scope+'/'+job.id,owner:scope,data:{...job,name:scope},pending:scope!=='@local'});m.put('user-a','owner');m.put('cloud','mode');m.put('55','cursor/user-a');m.put(library,'library-restore');t.oncomplete=resolve;});db.close();}
test('fresh local workspace saves and reopens with no account, queue or network API',async()=>{
 const indexedDB=new IDBFactory();let requests=0;const opts={indexedDB,fetcher:async()=>{requests++;throw new Error('offline');}};let store=createWorkspaceStore(opts);await store.init();await store.add(job);await store.add(calculation);assert.equal(store.sync,undefined);assert.equal(store.setMode,undefined);assert.equal(requests,0);store.close();
 store=createWorkspaceStore(opts);await store.init();assert.equal(store.entries().length,2);assert.equal(store.entries().find(e=>e.kind==='calculation').result.summary,calculation.result.summary);assert.equal(requests,0);store.close();
});
test('legacy account and local archives migrate without merging same IDs, losing journal or leaving a queue',async()=>{
 const indexedDB=new IDBFactory();await seed(indexedDB);let requests=0;let s=createWorkspaceStore({indexedDB,fetcher:()=>requests++});await s.init();assert.equal(s.owner(),'user-a');assert.equal(s.archives().length,3);assert.equal(s.entries()[0].name,'user-a');assert.deepEqual(await s.pendingLibrary(),library);
 for(const scope of ['@local','user-a','user-b']){await s.setArchive(scope);assert.equal(s.entries()[0].name,scope);assert.equal(s.entries()[0].pending,undefined);}
 await assert.rejects(s.importEntries([],empty,'@local'),/archiv/);await s.add({...job,id:'new-local'});s.close();
 s=createWorkspaceStore({indexedDB});await s.init();assert.equal(s.owner(),'user-b');assert.equal(s.entries().length,2);assert.equal(requests,0);s.close();
 const r=indexedDB.open('rt-workspace-v1');await new Promise(resolve=>r.onsuccess=resolve);const t=r.result.transaction(['entries','meta'],'readonly'),rows=t.objectStore('entries').getAll(),keys=t.objectStore('meta').getAllKeys();await new Promise(resolve=>t.oncomplete=resolve);assert.ok(rows.result.every(r=>r.pending===false));assert.ok(keys.result.every(k=>!['mode','owner'].includes(k)&&!k.startsWith('cursor/')));r.result.close();
});
test('backup round trip includes original history, CR measurements and legacy estimates with no owner or queue',()=>{
 const exported=createBackup([{...job,pending:true},calculation],library),restored=parseBackup(JSON.stringify(exported));assert.deepEqual(restored.entries,[job,calculation]);assert.deepEqual(restored.library,library);assert.equal('pending' in restored.entries[0],false);assert.equal('owner' in restored,false);
 const first=planRestore(restored,[],empty);assert.deepEqual(first.counts,{jobs:1,calculations:1,measurements:1,legacy:1,skipped:0});const second=planRestore(restored,first.entries,first.library);assert.equal(second.entries.length,0);assert.equal(second.counts.skipped,4);
});
test('restore rejects corrupt, unsupported, orphaned and conflicting records before modifying data',()=>{
 assert.throws(()=>parseBackup('{'),/JSON/);assert.throws(()=>parseBackup(JSON.stringify({...backup(),version:2})),/verze/);assert.throws(()=>parseBackup('{"__proto__":{}}'),/JSON/);
 assert.throws(()=>parseBackup(JSON.stringify({...backup(),entries:[calculation]})),/chybějící/);assert.throws(()=>parseBackup(JSON.stringify({...backup(),library:{...library,measurements:[{id:'bad'}]}})),/CR/);
 const original=backup();assert.throws(()=>planRestore(original,[{...job,name:'Odlišná zakázka'}],empty),/odlišný obsah/);assert.equal(original.entries[0].name,'Terén');
});
test('restore is idempotent and retains a durable CR journal until library writes succeed',async()=>{
 const indexedDB=new IDBFactory();let store=createWorkspaceStore({indexedDB});await store.init();const plan=planRestore(backup(),store.entries(),empty);await store.importEntries(plan.entries,plan.library);assert.equal(store.entries().length,2);assert.deepEqual(await store.pendingLibrary(),library);store.close();
 store=createWorkspaceStore({indexedDB});await store.init();assert.equal(store.entries().length,2);assert.deepEqual(await store.pendingLibrary(),library);await store.importEntries(plan.entries,plan.library);assert.equal(store.entries().length,2);await store.finishLibraryRestore();assert.equal(await store.pendingLibrary(),undefined);
 await assert.rejects(store.importEntries([{...job,name:'Overwrite'}],library),/změnil/);assert.equal(store.entries().find(e=>e.kind==='job').name,'Terén');assert.equal(await store.pendingLibrary(),undefined);store.close();
});
