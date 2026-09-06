import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {IDBFactory} from 'fake-indexeddb';
import {JSDOM} from 'jsdom';
import {createCrLibrary} from '../src/cr-library.js';
import {createWorkspaceStore} from '../src/workspace-store.js';
import {createCrMeasurement,gammaTime,MAX_GAMMA_MINUTES} from '../src/calculations.js';
import {historyEntry,evaluate,clone} from '../src/workflow-model.js';
import {canonicalForm} from '../src/context-schema.js';
import {createBackup,parseBackup} from '../src/backup.js';
import {validEntry} from '../src/entry-validation.js';
import worker,{workspaceApi,createWorker} from '../server/worker.js';
import {initApp} from '../src/controller.js';
import {initWorkflow} from '../src/workflow-ui.js';
const empty=()=>({measurements:[],legacy:[]});
const date='2026-09-06T08:00:00Z';
const job={id:'job',kind:'job',name:'Test',createdAt:date};
const measure=id=>createCrMeasurement({id,name:id,setup:'Tube/IP',scan:'50 um',screens:'Pb',current:2,seconds:120,fdd:1000,srb:.13,magnification:1,delay:10,measuredAt:date,material:'steel',thickness:40,voltage:400,qualityClass:'B',roi:'weld',flush:false,cp1:false,iqiConfirmed:false,kind:'normalized',measured:110});
const ug={kind:'ug',inputs:{technique:'single',focus:1.5,sourceDistance:500,thickness:10,gap:0,qualityClass:'B'},form:{}};
const entry=(context=ug,id='calc')=>historyEntry({id,jobId:job.id,part:'Díl',weld:'S-1',context});
const eventual=async(fn)=>{for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}assert.fail('Operation did not finish');};

test('CR two-tab writes, migration tombstones, conflict rollback and reopen retain every record',async()=>{
 const indexedDB=new IDBFactory(),a=createCrLibrary({indexedDB}),b=createCrLibrary({indexedDB}),old={measurements:[measure('old')],legacy:[{id:1,name:'Legacy',thickness:20},{id:2,name:'Previously deleted',thickness:20}]};
 await Promise.all([a.init(old,{hiddenLegacy:['2']}),b.init(old,{hiddenLegacy:['2']})]);await Promise.all([a.add(measure('a')),b.add(measure('b'))]);
 assert.deepEqual((await a.snapshot()).measurements.map(r=>r.id).sort(),['a','b','old']);
 await a.remove('measurement','old');await b.merge(old,{migration:true});assert.equal((await b.snapshot()).measurements.some(r=>r.id==='old'),false);
 await assert.rejects(b.merge({measurements:[measure('new'),{...measure('a'),name:'Conflicting'}],legacy:[]}),/odlišný obsah/);
 assert.equal((await a.snapshot()).measurements.some(r=>r.id==='new'),false);
 await Promise.all([a.remove('legacy','1'),b.add(measure('c'))]);a.close();b.close();
 const c=createCrLibrary({indexedDB});await c.init(old);assert.deepEqual((await c.snapshot()).measurements.map(r=>r.id).sort(),['a','b','c']);assert.deepEqual((await c.snapshot()).legacy,[]);c.close();
});

test('concurrent restore journals merge atomically and an older completion cannot clear a newer journal',async()=>{
 const indexedDB=new IDBFactory(),a=createWorkspaceStore({indexedDB}),b=createWorkspaceStore({indexedDB});await Promise.all([a.init(),b.init()]);
 const first={measurements:[measure('a')],legacy:[]},second={measurements:[measure('b')],legacy:[]};
 await a.importEntries([job],first);const pending=await a.pendingLibrary();await b.importEntries([{...job,id:'job-b'}],second);
 assert.equal(await a.finishLibraryRestore(pending),false);const all=await a.pendingLibrary();assert.deepEqual(all.measurements.map(r=>r.id),['a','b']);
 assert.equal(await b.finishLibraryRestore(all),true);assert.equal(await a.pendingLibrary(),undefined);await a.reload();assert.equal(a.entries().length,2);a.close();b.close();
});

test('all seven context schemas reject missing inputs, mismatched forms/results and unsupported versions',()=>{
 const m=measure('ref');
 // A measured record has derived fields; use the exact calculation input subset.
 const crKeys=['name','setup','scan','screens','current','seconds','fdd','srb','magnification','delay','measuredAt','material','thickness','voltage','qualityClass','roi','flush','cp1','iqiConfirmed','kind','measured'];
 const cr=Object.fromEntries(crKeys.map(k=>[k,m[k]]));
 const contexts=[{kind:'n',inputs:{technique:'outside',qualityClass:'B',thickness:10,diameter:219,distance:500}},ug,{kind:'xray',inputs:{mode:'chart',material:'steel',film:'D7',voltage:200,thickness:20,distance:1000,current:2,referenceDistance:1000}},{kind:'gamma',inputs:{activity:1000,referenceTime:date,exposureTime:date,thickness:40,distance:1000,film:'D7'}},{kind:'cr_check',inputs:cr},{kind:'cr_record',inputs:cr},{kind:'cr_estimate',inputs:cr,reference:m}];
 for(const c of contexts){const e=entry({...c,form:c.form||{}},'test-'+c.kind);assert.equal(validEntry(e),true,c.kind);assert.doesNotThrow(()=>parseBackup(JSON.stringify(createBackup([job,e],empty()))));
  const mutations=[e=>e.context.form={},e=>e.context.inputs={},e=>e.result.values={},e=>e.result.summary='Invented result',e=>e.modelVersion='unknown',e=>e.context.form[c.kind==='n'?'n_thickness':c.kind==='ug'?'ug_thickness':c.kind==='xray'?'t_thickness_xray':c.kind==='gamma'?'t_thickness_gamma':'cr_thickness']='999'];
  for(const mutate of mutations){const broken=clone(e);mutate(broken);assert.equal(validEntry(broken),false,c.kind);assert.throws(()=>parseBackup(JSON.stringify({app:'rt-asistent',version:1,entries:[job,broken],library:empty()})),/historie/);}
 }
 const e=entry();e.context.form.ug_thickness='40';assert.equal(validEntry(e),false);e.context.form.ug_thickness='10,0';assert.equal(validEntry(e),true);
});

test('Ir-192 rejects physically misleading long times, preserves old history and bounds short-exposure decay error',()=>{
 const i={activity:1,referenceTime:date,exposureTime:date,thickness:90,distance:1000,film:'D4'};
 assert.throws(()=>gammaTime(i),/24 hodin/);const old=gammaTime(i,{historical:true});assert.ok(old.minutes>1e6);
 const context={kind:'gamma',inputs:i};context.form=canonicalForm(context);
 const historical={...entry(),context,modelVersion:'2026-09-05.2',result:evaluate(context,{modelVersion:'2026-09-05.2'})};
 assert.equal(validEntry(historical),true);assert.doesNotThrow(()=>parseBackup(JSON.stringify(createBackup([job,historical],empty()))));assert.throws(()=>evaluate(context),/24 hodin/);
 const boundary={...i,activity:old.minutes/MAX_GAMMA_MINUTES};assert.ok(gammaTime({...boundary,activity:boundary.activity*(1+1e-12)}).minutes<=MAX_GAMMA_MINUTES);assert.throws(()=>gammaTime({...boundary,activity:boundary.activity*.999}),/24 hodin/);
 const lambda=Math.LN2/(73.827*1440),integrated=-Math.log1p(-lambda*MAX_GAMMA_MINUTES)/lambda;assert.ok((integrated/MAX_GAMMA_MINUTES-1)<.005);
});

test('retired API rejects old clients without reading identity, request body or database',async()=>{
 const env=new Proxy({},{get(){throw new Error('No backend access allowed');}});
 for(const method of ['GET','POST','DELETE']){const r=await workspaceApi(new Request('https://test.invalid/api/workspace',{method}),env);assert.equal(r.status,410);assert.match((await r.json()).error,/pouze v zařízení/);}
});

test('Worker security headers cover HTML, assets and API errors with a fresh matching script nonce',async()=>{
 const dynamic=createWorker('<html><script>window.boot=true</script></html>');
 for(const path of ['/','/offline','/index.html']){const r=await dynamic.fetch(new Request('https://test.invalid'+path),{});assert.equal(r.status,200);assert.match(r.headers.get('content-security-policy'),/nonce-/);assert.match(await r.text(),/<script nonce=/);}
 const bytes=new Uint8Array([0,127,128,255]),embedded=createWorker('<html></html>',{'/font.woff2':{body:Buffer.from(bytes).toString('base64'),type:'font/woff2'}}),font=await embedded.fetch(new Request('https://test.invalid/font.woff2'),{});assert.deepEqual(new Uint8Array(await font.arrayBuffer()),bytes);assert.equal(font.headers.get('content-type'),'font/woff2');assert.equal(font.headers.get('x-content-type-options'),'nosniff');assert.equal((await embedded.fetch(new Request('https://test.invalid/unknown'),{})).status,404);
 const ASSETS={fetch:async req=>new Response(new URL(req.url).pathname==='/'?'<html><script>window.boot=true</script><script src="/app.js"></script></html>':'const ok=true;',{headers:{'Content-Type':new URL(req.url).pathname==='/'?'text/html':'text/javascript'}})};
 let previous;for(const path of ['/','/','/app.js','/api/workspace','/api/missing']){const r=await worker.fetch(new Request('https://test.invalid'+path),{ASSETS});const csp=r.headers.get('content-security-policy');assert.match(csp,/frame-ancestors 'none'/);assert.equal(r.headers.get('x-content-type-options'),'nosniff');assert.equal(r.headers.get('x-frame-options'),'DENY');assert.ok(r.headers.get('permissions-policy'));assert.ok(r.headers.get('referrer-policy'));
  if(path==='/'){const nonce=csp.match(/'nonce-([^']+)'/)[1],body=await r.text();assert.notEqual(nonce,previous);previous=nonce;assert.equal((body.match(new RegExp(`nonce="${nonce.replace(/[+]/g,'\\+')}"`,'g'))||[]).length,2);assert.match(r.headers.get('cache-control'),/no-store/);}
 }
});

test('5,000 history entries render only 50 rows, filtering spans all pages, async failure keeps focus and Escape',async()=>{
 const dom=new JSDOM(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'https://test.invalid',pretendToBeVisual:true}),w=dom.window,d=w.document;w.indexedDB=new IDBFactory();w.HTMLCanvasElement.prototype.getContext=()=>({});
 const app=initApp({document:d}),rows=[job,...Array.from({length:5000},(_,i)=>({...entry(ug,'calc-'+i),weld:'Svar-'+i}))];let rejectMode;
 const store={init:async()=>{},entries:()=>rows,archives:()=>[{id:'@local',label:'Místní',count:1},{id:'old',label:'Převedený',count:1}],owner:()=> '@local',close(){},setArchive:()=>new Promise((_,reject)=>rejectMode=reject)};
 const workflow=initWorkflow({document:d,app,store});await workflow.ready;await app.libraryReady;
 assert.equal(d.querySelectorAll('.history-card').length,0);d.getElementById('history-open').click();d.getElementById('history-scope').value='all';d.getElementById('history-scope').dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.history-card').length,50);assert.match(d.getElementById('history-page-status').textContent,/5000/);
 d.getElementById('history-next').click();assert.match(d.getElementById('history-page-status').textContent,/51–100/);d.getElementById('history-search').value='Svar-4999';d.getElementById('history-search').dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.history-card').length,1);
 d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));d.getElementById('data-open').click();const mode=d.getElementById('local-archive');mode.focus();mode.value='old';mode.dispatchEvent(new w.Event('change'));assert.equal(d.activeElement.id,'backup-status');rejectMode(new Error('Offline'));await eventual(()=>!mode.disabled);assert.equal(d.activeElement,mode);
 // A browser can drop focus to body when an async control disappears.
 d.activeElement.blur();d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(d.getElementById('data-panel').hidden,true);assert.equal(d.activeElement.id,'data-open');workflow.destroy();app.destroy();w.close();
});
