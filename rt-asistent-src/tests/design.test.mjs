import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {initApp} from '../src/controller.js';
import {initWorkflow} from '../src/workflow-ui.js';
import {initAppearance} from '../src/appearance.js';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
function setup({savedTheme=null,dark=false,blocked=false}={}){
 const dom=new JSDOM(html,{url:'https://prototype.test/',pretendToBeVisual:true}),w=dom.window,d=w.document,queries=new Map(),charts=[];
 w.matchMedia=query=>{if(!queries.has(query))queries.set(query,{matches:query.includes('color-scheme')?dark:true,listeners:new Set(),addEventListener(_,fn){this.listeners.add(fn);},removeEventListener(_,fn){this.listeners.delete(fn);},set(value){this.matches=value;for(const fn of this.listeners)fn({matches:value});}});return queries.get(query);};
 if(savedTheme)w.localStorage.setItem('rt_theme_v1',savedTheme);
 if(blocked)Object.defineProperty(w,'localStorage',{get(){throw new Error('blocked');}});
 w.HTMLCanvasElement.prototype.getContext=()=>({});class Chart {constructor(ctx,config){charts.push(config);}destroy(){}resize(){}}
 const appearance=initAppearance({document:d}),app=initApp({document:d,Chart});
 const rows=[{id:'job-a',kind:'job',name:'Zakázka A',createdAt:'2026-09-06T08:00:00Z'}];
 const store={init:async()=>{},sync:async()=>0,entries:()=>rows,pending:()=>0,close(){},async add(record){rows.push(record);}};
 const workflow=initWorkflow({document:d,app,store}),el=id=>d.getElementById(id);
 const input=(id,value)=>{const e=el(id);if(e.type==='checkbox')e.checked=!!value;else e.value=String(value);e.dispatchEvent(new w.Event('input',{bubbles:true}));};
 return {dom,w,d,queries,charts,app,appearance,workflow,el,input,close(){workflow.destroy();appearance.destroy();app.destroy();w.close();}};
}
test('appearance follows system, persists explicit choice and updates chart without changing calculation',()=>{
 const a=setup({dark:true});assert.equal(a.d.documentElement.dataset.theme,'dark');assert.equal(a.el('theme-select').value,'auto');assert.equal(a.el('tabs').getAttribute('aria-orientation'),'vertical');
 const original=a.app.captureCalculation(),darkColor=a.charts.at(-1).options.scales.x.ticks.color;
 a.el('theme-select').value='light';a.el('theme-select').dispatchEvent(new a.w.Event('change'));assert.equal(a.d.documentElement.dataset.theme,'light');assert.equal(a.w.localStorage.getItem('rt_theme_v1'),'light');assert.notEqual(a.charts.at(-1).options.scales.x.ticks.color,darkColor);assert.deepEqual(a.app.captureCalculation(),original);
 a.queries.get('(prefers-color-scheme: dark)').set(false);a.queries.get('(prefers-color-scheme: dark)').set(true);assert.equal(a.d.documentElement.dataset.theme,'light');
 a.el('theme-select').value='auto';a.el('theme-select').dispatchEvent(new a.w.Event('change'));assert.equal(a.d.documentElement.dataset.theme,'dark');a.queries.get('(prefers-color-scheme: dark)').set(false);assert.equal(a.d.documentElement.dataset.theme,'light');
 a.queries.get('(min-width: 851px)').set(false);assert.equal(a.el('tabs').getAttribute('aria-orientation'),'horizontal');a.close();
});
test('appearance restores preference and remains usable when browser storage is blocked',()=>{
 const a=setup({savedTheme:'dark'});assert.equal(a.d.documentElement.dataset.theme,'dark');a.close();const b=setup({blocked:true});b.el('theme-select').value='dark';b.el('theme-select').dispatchEvent(new b.w.Event('change'));assert.equal(b.d.documentElement.dataset.theme,'dark');b.close();
});
test('one save action follows every visible result and keeps the chosen job context',async()=>{
 const a=setup();await a.workflow.ready;a.input('job-select','job-a');a.input('job-part','Větev B');a.input('job-weld','S-021');assert.equal(a.el('result-job-context').textContent,'Zakázka A · Větev B · S-021');
 for(const [tab,prefix]of [['exposures','n'],['unsharpness','ug'],['time','xray'],['digital_radiography','cr']]){a.app.tab(tab);assert.equal(a.el('history-save').closest('.result-focus').id,prefix+'_result_focus');}
 a.app.tab('time');a.input('source_type','gamma');assert.equal(a.el('history-save').closest('.result-focus').id,'gamma_result_focus');assert.equal(a.d.querySelectorAll('#history-save').length,1);assert.match(a.el('result-job-context').textContent,/S-021/);a.close();
});
test('drawers trap keyboard focus, close with Escape/backdrop and restore their opener',async()=>{
 const a=setup();await a.workflow.ready;a.el('geometry-open').focus();a.el('geometry-open').click();const panel=a.el('geometry-panel');assert.equal(a.el('workflow-panels').hidden,false);assert.equal(a.el('app-surface').inert,true);assert.equal(panel.getAttribute('role'),'dialog');assert.equal(a.el('geometry-open').getAttribute('aria-expanded'),'true');
 a.el('geometry-apply').focus();a.d.activeElement.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));assert.equal(a.d.activeElement,panel.querySelector('[data-close-panel]'));
 a.d.activeElement.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(a.el('workflow-panels').hidden,true);assert.equal(a.el('app-surface').inert,false);assert.equal(a.d.activeElement.id,'geometry-open');
 a.el('history-open').click();a.el('workflow-panels').click();assert.equal(a.el('workflow-panels').hidden,true);assert.equal(a.d.activeElement.id,'history-open');a.close();
});
test('drawer errors stay inside the visible panel, and applying geometry returns to the calculator',async()=>{
 const a=setup();await a.workflow.ready;a.el('job-new').click();a.el('job-create').click();await Promise.resolve();assert.match(a.el('job-panel').querySelector('.panel-message').textContent,/Zadejte název/);a.el('job-panel').querySelector('[data-close-panel]').click();a.el('geometry-open').click();a.input('shared-technique','dwsi');a.el('geometry-apply').click();assert.equal(a.el('workflow-panels').hidden,true);assert.equal(a.el('cr_thickness').value,'20');assert.match(a.el('workflow-message').textContent,/Geometrie přenesena/);a.close();
});
test('connection summary shows actual save state and manual also locks background focus',async()=>{
 const a=setup();await a.workflow.ready;await Promise.resolve();assert.equal(a.el('connection-summary').textContent,'Pouze v zařízení');a.el('storage-status').dataset.state='error';a.el('storage-status').textContent='Server není dostupný.';await Promise.resolve();assert.equal(a.el('connection-summary').textContent,'Zkontrolovat uložení');
 a.el('connection-popover').open=true;a.el('show-manual-button').focus();a.el('show-manual-button').click();assert.equal(a.el('connection-popover').open,false);assert.equal(a.el('app-surface').inert,true);assert.ok(a.d.body.classList.contains('modal-open'));a.el('manual-modal-close-btn').click();assert.equal(a.el('app-surface').inert,false);assert.equal(a.d.activeElement.id,'show-manual-button');a.close();
});
test('both palettes meet text contrast and share all functional status and diagram tokens',()=>{
 const css=fs.readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');const palettes=[...css.matchAll(/:root(?:\[data-theme=dark\])?\s*\{([^}]+)\}/g)].map(m=>Object.fromEntries([...m[1].matchAll(/(--[\w-]+):\s*(#[\da-f]{6})(?:;|\s)/g)].map(x=>[x[1],x[2]])));
 const lum=hex=>{const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 for(const p of palettes){for(const [fg,bg]of [['--ink','--panel'],['--muted','--panel'],['--subtle','--canvas'],['--on-primary','--primary'],['--primary','--active'],['--good','--good-bg'],['--warning','--warning-bg'],['--danger','--danger-bg']]){const a=lum(p[fg]),b=lum(p[bg]);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,fg+' / '+bg);}for(const key of ['--wall','--wall-edge','--ray','--chart-line','--chart-grid','--chart-warning'])assert.ok(p[key],key);}
 assert.equal(palettes.length,2);
});
