import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import {IDBFactory} from 'fake-indexeddb';
import {initApp} from '../src/controller.js';
import {initWorkflow} from '../src/workflow-ui.js';
import {createBackup} from '../src/backup.js';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const pause=()=>new Promise(resolve=>setTimeout(resolve,20));
async function setup(){const dom=new JSDOM(html,{url:'https://example.test/',pretendToBeVisual:true}),w=dom.window,d=w.document;w.indexedDB=new IDBFactory();w.fetch=async()=>{throw new Error('no network');};w.HTMLCanvasElement.prototype.getContext=()=>({});const app=initApp({document:d}),workflow=initWorkflow({document:d,app});await workflow.ready;return {w,d,app,workflow,el:id=>d.getElementById(id),close(){workflow.destroy();app.destroy();w.close();}};}
test('offline data panel previews an additive restore and repeats it without duplicates',async()=>{
 const a=await setup();a.el('data-open').click();assert.equal(a.el('data-panel').hidden,false);assert.equal(a.el('archive-choice').hidden,true);assert.equal(a.el('storage-status').dataset.state,'local');
 const backup=createBackup([{id:'new-job',kind:'job',name:'Imported <img src=x>',createdAt:'2026-09-06T08:00:00Z'}],{measurements:[],legacy:[]});const select=()=>{Object.defineProperty(a.el('backup-file'),'files',{configurable:true,value:[{size:500,text:async()=>JSON.stringify(backup)}]});a.el('backup-file').dispatchEvent(new a.w.Event('change'));};
 select();await pause();assert.equal(a.el('backup-preview').hidden,false);assert.equal(a.workflow.store.entries().length,0);a.el('backup-restore').click();await pause();assert.equal(a.workflow.store.entries().length,1);assert.equal(a.el('job-select').querySelector('img'),null);assert.match(a.el('backup-status').textContent,/dokončena/);
 select();await pause();assert.match(a.el('backup-summary').textContent,/Shodných záznamů: 1/);a.el('backup-restore').click();await pause();assert.equal(a.workflow.store.entries().length,1);
 assert.equal(a.el('storage-mode'),null);assert.equal(a.el('sync-retry'),null);a.close();
});
