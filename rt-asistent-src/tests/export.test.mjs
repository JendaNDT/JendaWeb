import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {initApp} from '../src/controller.js';
import {initWorkflow} from '../src/workflow-ui.js';
import {historyEntry} from '../src/workflow-model.js';
import {currentExport,snapshotRecords,makeReport,statusText,inputRows} from '../src/export-model.js';
import {createPdf,nomogramSvg,geometrySvg} from '../src/export-pdf.js';
import {createXlsx,workbookSheets} from '../src/export-xlsx.js';

const html=await fs.readFile(new URL('../index.html',import.meta.url),'utf8');
const tick=()=>new Promise(resolve=>setTimeout(resolve,10));
async function until(fn){for(let i=0;i<500&&!fn();i++)await tick();assert.ok(fn(),'operation completed');}
function setup(downloadExport){
 const dom=new JSDOM(html,{url:'https://offline.test/',pretendToBeVisual:true}),w=dom.window,d=w.document;
 w.HTMLCanvasElement.prototype.getContext=()=>({});w.indexedDB=new IDBFactory();w.fetch=async()=>assert.fail('Export used network');
 class Chart{destroy(){}resize(){}}
 const app=initApp({document:d,Chart}),workflow=initWorkflow({document:d,app,downloadExport}),el=id=>d.getElementById(id);
 const input=(id,value)=>{const e=el(id);if(e.type==='checkbox')e.checked=!!value;else e.value=String(value);e.dispatchEvent(new w.Event('input',{bubbles:true}));};
 return {dom,w,d,app,workflow,el,input,close(){workflow.destroy();app.destroy();w.close();}};
}
async function examples(){
 const a=setup();await a.workflow.ready;const contexts=[a.app.captureCalculation()];
 a.app.tab('unsharpness');contexts.push(a.app.captureCalculation());a.app.tab('time');a.input('xray_current',2);contexts.push(a.app.captureCalculation());a.input('source_type','gamma');contexts.push(a.app.captureCalculation());
 a.app.tab('digital_radiography');a.input('cr_achieved_snr',110);contexts.push(a.app.captureCalculation());a.input('cr_task','record');
 for(const [id,value]of Object.entries({cr_technique_name:'Reference Žďár 0012',cr_setup:'tube/IP',cr_screens:'Pb',cr_scan:'50 µm',cr_delay:10,cr_srb:.13,cr_current:2,cr_seconds:120,cr_achieved_snr:85}))a.input(id,value);
 contexts.push(a.app.captureCalculation());a.el('cr_save_button').click();await until(()=>!a.el('cr_save_button').disabled);a.el('cr_library_container').querySelector('[data-action=reference]').click();contexts.push(a.app.captureCalculation());
 const records=contexts.map((context,i)=>historyEntry({id:'record-'+i,jobId:'job1',part:'Díl Žďár',weld:'0012',drawingNumber:'00042',batch:'0012',context,createdAt:'2026-09-07T09:10:00.000Z'}));a.close();
 return {contexts,records,jobs:[{id:'job1',kind:'job',name:'Zakázka Žďár 042',createdAt:'2026-09-07T09:00:00.000Z'}]};
}
test('PDF and XLSX preserve all seven saved results, Czech text, identifiers and reference snapshots',async()=>{
 const {records,jobs}=await examples(),original=JSON.stringify(records),snapshots=snapshotRecords(records,jobs),report=makeReport(snapshots,{technician:'Jan Žďárský',note:'Kontrola čísla výkresu a běžného čísla. Příliš žluťoučký kůň.',geometry:true});
 assert.equal(snapshots.length,7);assert.equal(inputRows(snapshots[6]).some(r=>r.key==='measured'||r.key==='seconds'),false);assert.ok(snapshots.every(r=>!r.unverified));
 const sheets=workbookSheets(report);assert.equal(sheets.length,10);assert.ok(sheets.some(s=>s.sheet==='Reference CR'));
 const overview=sheets[0];assert.equal(overview.data[1][3].value,'0012');assert.equal(overview.data[1][3].type,String);assert.equal(overview.data[1][3].format,'@');
 assert.equal(overview.data[1][6].type,Date);assert.ok(sheets[1].data[1].some(c=>c.type===Number&&c.value===219));
 const [pdf,xlsx]=await Promise.all([createPdf(report),createXlsx(report)]);
 assert.equal((await pdf.text()).slice(0,5),'%PDF-');assert.equal(new Uint8Array(await xlsx.arrayBuffer())[0],80);assert.equal(JSON.stringify(records),original);
 const one=makeReport(snapshots.slice(0,1),{technician:'Jan Žďárský'}),singlePdf=await createPdf(one);
 // Optional artifacts for independent PDF rendering and ZIP / Excel inspection.
 if(process.env.RT_EXPORT_QA_DIR){const dir=path.resolve(process.env.RT_EXPORT_QA_DIR);await fs.mkdir(dir,{recursive:true});for(const [name,blob]of [['zakazka.pdf',pdf],['vypocet.pdf',singlePdf],['zakazka.xlsx',xlsx]])await fs.writeFile(path.join(dir,name),new Uint8Array(await blob.arrayBuffer()));await fs.writeFile(path.join(dir,'expected.json'),JSON.stringify(report));}
});
test('unsupported historical model remains visibly unverified without replacing results or inventing a plot',async()=>{
 const {records,jobs}=await examples(),old={...records[0],modelVersion:'old-model',result:{...records[0].result,summary:'123 expozic',values:{...records[0].result.values,count:123}}};
 const [r]=snapshotRecords([old],jobs);assert.equal(r.result.summary,'123 expozic');assert.equal(r.result.values.count,123);assert.match(statusText(r),/nelze ověřit/);assert.equal(nomogramSvg(r),null);assert.equal(geometrySvg(r),null);
 const draft=currentExport(records[0].context,{batch:'0012'});assert.equal(draft.batch,'0012');assert.equal(draft.current,true);
});
test('history export includes every selected page, respects search, and job export excludes other jobs',async()=>{
 let downloaded;const a=setup(data=>{downloaded=data;});await a.workflow.ready;
 const context=a.app.captureCalculation(),job={id:'job1',kind:'job',name:'=1+2 <img src=x>',createdAt:'2026-09-07T09:00:00Z'};
 await a.workflow.store.add(job);await a.workflow.store.add({...job,id:'job2',name:'Jiná zakázka'});
 const records=Array.from({length:53},(_,i)=>historyEntry({id:'r'+i,jobId:i===52?'job2':'job1',part:'Díl',weld:'S-'+i,batch:'0012',drawingNumber:'00042',context,createdAt:new Date(Date.UTC(2026,8,7,9,i)).toISOString()}));
 for(const record of records)await a.workflow.store.add(record);a.input('job-select','job1');a.el('history-open').click();assert.equal(a.el('history-list').querySelectorAll('article').length,50);
 a.el('history-select-all').click();assert.equal(a.el('history-selected-count').textContent,'Vybráno: 52');a.el('history-export').click();assert.equal(a.el('export-count').textContent,'Počet výpočtů: 52');assert.equal(a.el('export-preview').querySelector('img'),null);
 a.input('export-format','xlsx');a.el('export-download').click();await until(()=>!!downloaded||a.el('export-status').dataset.error==='true');assert.ok(downloaded,a.el('export-status').textContent);assert.equal(downloaded.report.records.length,52);assert.ok(downloaded.report.records.every(r=>r.jobId==='job1'));assert.equal(a.el('export-controls').disabled,false);if(process.env.RT_EXPORT_QA_DIR)await fs.writeFile(path.join(process.env.RT_EXPORT_QA_DIR,'selection.xlsx'),new Uint8Array(await downloaded.blob.arrayBuffer()));
 a.input('export-scope','job');a.input('export-job','job2');assert.equal(a.el('export-count').textContent,'Počet výpočtů: 1');
 a.el('history-open').click();a.input('history-search','S-51');a.el('history-select-all').click();assert.equal(a.el('history-selected-count').textContent,'Vybráno: 1');a.input('history-search','missing');assert.equal(a.el('history-selected-count').textContent,'Vybráno: 0');
 a.el('export-current').click();a.input('n_thickness',-1);assert.equal(a.el('export-count').textContent,'Počet výpočtů: 1');a.el('export-current').click();assert.equal(a.el('export-download').disabled,true);assert.match(a.el('export-preview').textContent,/kladné/);a.close();
});
