import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {initApp} from '../src/controller.js';
import {initWorkflow} from '../src/workflow-ui.js';
import {evaluate,sharedGeometry,compareVariant,historyEntry,clone} from '../src/workflow-model.js';
import {createWorkspaceStore} from '../src/workspace-store.js';
import {workspaceApi} from '../server/worker.js';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
async function setup({indexedDB=new IDBFactory(),savedContext=null}={}){const dom=new JSDOM(html,{url:'https://prototype.test/',pretendToBeVisual:true}),w=dom.window,d=w.document;w.HTMLCanvasElement.prototype.getContext=()=>({});class Chart{destroy(){}resize(){}}w.indexedDB=indexedDB;if(savedContext)w.localStorage.setItem('rt_job_context_v1',savedContext);w.fetch=async()=>{throw new Error("Unexpected network");};const app=initApp({document:d,Chart}),workflow=initWorkflow({document:d,app}),el=id=>d.getElementById(id);await workflow.ready;const input=(id,value)=>{const e=el(id);if(e.type==='checkbox')e.checked=!!value;else e.value=String(value);e.dispatchEvent(new w.Event('input',{bubbles:true}));};return {dom,w,d,app,workflow,el,input,close(){workflow.destroy();app.destroy();w.close();}};}
const tick=()=>new Promise(r=>setTimeout(r,10));
const g={material:'steel',technique:'dwsi',qualityClass:'B',thickness:'10',diameter:'219',sfd:'1000',gap:'0',pathMode:'auto'};
test('shared geometry maps t, w and distance correctly without applying unsupported nomograms',()=>{
 const r=sharedGeometry(g);assert.equal(r.w,20);assert.equal(r.maps.n.n_thickness,10);assert.equal(r.maps.n.n_distance,1000);assert.equal(r.maps.ug.ug_source_distance,781);assert.equal(r.maps.film.t_thickness_xray,20);assert.equal(r.maps.cr.cr_thickness,20);
 const single=sharedGeometry({...g,technique:'outside'});assert.equal(single.w,10);assert.equal(single.f,990);assert.equal(single.maps.n.n_distance,990);
 assert.equal(sharedGeometry({...g,technique:'dwdi'}).maps.n,undefined);assert.equal(sharedGeometry({...g,gap:5}).maps.n,undefined);
 assert.equal(sharedGeometry({...g,pathMode:'manual',penetrated:'24,5'}).w,24.5);assert.throws(()=>sharedGeometry({...g,pathMode:'manual',penetrated:10}),/součet/);
 assert.equal(sharedGeometry({...g,material:'aluminum'}).maps.film.t_thickness_gamma,undefined);
 assert.throws(()=>sharedGeometry({...g,sfd:200}),/kladné/);assert.equal(sharedGeometry({...g,technique:'inside',sfd:109.5}).maps.ug.ug_source_distance,99.5);
});
test('all seven calculation contexts preserve original results, exact inputs and independent copies',async()=>{
 const a=await setup(),snapshots=[];snapshots.push(a.app.captureCalculation());a.app.tab('unsharpness');snapshots.push(a.app.captureCalculation());a.app.tab('time');a.input('xray_current',2);snapshots.push(a.app.captureCalculation());a.input('source_type','gamma');snapshots.push(a.app.captureCalculation());a.app.tab('digital_radiography');a.input('cr_achieved_snr',110);snapshots.push(a.app.captureCalculation());
 a.input('cr_task','record');for(const [id,value]of Object.entries({cr_technique_name:'Ref A',cr_setup:'tube/IP',cr_screens:'Pb',cr_scan:'50 um',cr_delay:10,cr_srb:.13,cr_current:2,cr_seconds:120,cr_achieved_snr:85}))a.input(id,value);snapshots.push(a.app.captureCalculation());a.el('cr_save_button').click();for(let i=0;i<100&&a.el('cr_save_button').disabled;i++)await tick();assert.equal(a.el('cr_save_button').disabled,false);a.el('cr_library_container').querySelector('[data-action=reference]').click();snapshots.push(a.app.captureCalculation());
 assert.deepEqual(snapshots.map(s=>s.kind),['n','ug','xray','gamma','cr_check','cr_record','cr_estimate']);
 for(const context of snapshots){const entry=historyEntry({id:'id-'+context.kind,jobId:'job',part:'P',weld:'S1',context});const original=JSON.stringify(entry);a.app.restoreCalculation(context);assert.deepEqual(evaluate(a.app.captureCalculation()),entry.result,context.kind);assert.equal(JSON.stringify(entry),original);assert.notEqual(entry.context,context);}
 const cr=snapshots.at(-1),changed=compareVariant(cr,{fdd:2000,current:2});assert.equal(changed.context.form.cr_fdd,'2000');assert.ok(Math.abs(changed.result.values.minutes/evaluate(cr).values.minutes-4)<1e-10);a.close();
});
test('shared apply invalidates measured CR and manual calibration while preserving unrelated current',async()=>{
 const a=await setup();a.input('cr_achieved_snr',110);a.input('cr_seconds',120);a.input('xray_current',3);a.input('xray_mode','manual');a.input('xray_factor',10);a.input('xray_reference_name','Ref');a.el('xray_confirm_reference').click();a.el('geometry-open').click();a.input('shared-technique','dwsi');a.input('shared-thickness',12);a.el('geometry-apply').click();assert.equal(a.el('ug_thickness').value,'12');assert.equal(a.el('cr_thickness').value,'24');assert.equal(a.el('cr_achieved_snr').value,'');assert.equal(a.el('cr_seconds').value,'');assert.equal(a.el('xray_current').value,'3');assert.equal(a.el('t_result_display_xray').textContent,'—');assert.match(a.el('xray_error').textContent,/Potvrďte/);a.close();
});
test('comparison reports domain errors, exact inverse-square/current differences and applies correct form',async()=>{
 const a=await setup();a.app.tab('time');a.input('xray_current',2);a.el('compare-open').click();assert.match(a.el('variant-detail-1').textContent,/44/);a.input('variant-1-distance',2000);assert.match(a.el('variant-detail-1').textContent,/300/);a.input('variant-1-current',4);assert.match(a.el('variant-detail-1').textContent,/100/);a.input('variant-2-current',0);assert.equal(a.el('variant-2').dataset.valid,'false');assert.equal(a.el('variant-2').querySelector('button').disabled,true);
 a.el('variant-1').querySelector('button').click();assert.equal(a.el('t_distance_xray').value,'2000');assert.equal(a.el('xray_current').value,'4');assert.equal(a.el('compare-panel').hidden,true);
 a.app.tab('unsharpness');a.el('compare-open').click();a.input('variant-1-sourceDistance',1);assert.match(a.el('variant-detail-1').textContent,/NESPLNĚNA/);a.close();
});
test('job UI creates, saves, filters and restores history without executing stored HTML',async()=>{
 const a=await setup();a.el('job-new').click();a.input('job-name','Job <img src=x>');a.el('job-create').click();await tick();const job=a.el('job-select').value;assert.ok(job);a.input('job-part','Díl A');a.input('job-weld','S-012');a.el('history-save').click();await tick();assert.equal(a.workflow.store.entries().filter(e=>e.kind==='calculation').length,1);
 a.el('history-open').click();assert.match(a.el('history-list').textContent,/10 expozic/);assert.equal(a.el('history-list').querySelector('img'),null);a.input('history-search','no-match');assert.equal(a.el('history-list').querySelector('article'),null);a.input('history-search','s-012');a.input('n_thickness',12);a.el('history-list').querySelector('[data-restore]').click();assert.equal(a.el('n_thickness').value,'10');assert.equal(a.el('job-weld').value,'S-012');assert.match(a.el('workflow-message').textContent,/Původní výsledek/);
 const ids=[...a.d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);for(const e of a.d.querySelectorAll('#workflow input,#workflow select'))assert.ok(a.d.querySelector(`[for="${e.id}"]`)||e.closest('label'),e.id);a.close();
});
test('manual film variants retain the confirmed calibration; history reopening asks for confirmation',async()=>{
 const a=await setup();a.app.tab('time');for(const [id,value]of Object.entries({xray_mode:'manual',xray_factor:10,xray_reference_name:'Reference A',xray_current:2}))a.input(id,value);a.el('xray_confirm_reference').click();const original=a.app.captureCalculation();a.el('compare-open').click();assert.equal(a.el('variant-1-film'),null);a.input('variant-1-distance',2000);a.el('variant-1').querySelector('button').click();assert.equal(a.el('t_result_display_xray').textContent,'20 min 0 s');a.app.restoreCalculation(original);assert.equal(a.el('t_result_display_xray').textContent,'—');assert.match(a.el('xray_error').textContent,/Potvrďte/);a.close();
});

test('drawing and batch survive save, search, replay and restart; older records clear both fields',async()=>{
 const indexedDB=new IDBFactory(),a=await setup({indexedDB});
 a.el('job-new').click();a.input('job-name','Dokumentace');a.el('job-create').click();await tick();
 for(const [id,value]of Object.entries({'job-part':'Díl A','job-weld':'S-01','job-drawing':'  V-042 <img src=x>  ','job-batch':'  B-007  '}))a.input(id,value);
 a.el('history-save').click();await tick();const record=a.workflow.store.entries().find(e=>e.kind==='calculation');
 assert.equal(record.drawingNumber,'V-042 <img src=x>');assert.equal(record.batch,'B-007');assert.match(a.el('result-job-context').textContent,/Výkres V-042 <img src=x> · Běžné číslo B-007/);
 a.el('history-open').click();for(const query of ['v-042','b-007']){a.input('history-search',query);assert.equal(a.el('history-list').querySelectorAll('article').length,1);}
 assert.match(a.el('history-list').textContent,/Výkres: V-042 <img src=x> · Běžné číslo: B-007/);assert.equal(a.el('history-list').querySelector('img'),null);
 a.input('job-drawing','Jiný výkres');a.input('job-batch','Jiné běžné číslo');a.el('history-list').querySelector('[data-restore]').click();
 assert.equal(a.el('job-drawing').value,record.drawingNumber);assert.equal(a.el('job-batch').value,record.batch);
 const savedContext=a.w.localStorage.getItem('rt_job_context_v1'),old={...record,id:'legacy-record'};delete old.drawingNumber;delete old.batch;await a.workflow.store.add(old);a.close();
 const b=await setup({indexedDB,savedContext});assert.equal(b.el('job-drawing').value,record.drawingNumber);assert.equal(b.el('job-batch').value,record.batch);
 b.el('history-open').click();b.el('history-list').querySelector('[data-restore="legacy-record"]').click();assert.equal(b.el('job-drawing').value,'');assert.equal(b.el('job-batch').value,'');
 b.el('history-save').click();for(let i=0;i<100&&b.el('history-save').disabled;i++)await tick();assert.equal(b.workflow.store.entries().filter(e=>e.kind==='calculation').length,3);b.close();
});
