import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {IDBFactory} from 'fake-indexeddb';
import {JSDOM} from 'jsdom';
import {initApp} from '../src/controller.js';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
async function setup(saved={},blocked=false,indexedDB=new IDBFactory()){
 const dom=new JSDOM(html,{url:'https://prototype.test/',pretendToBeVisual:true}),w=dom.window,d=w.document;
 w.HTMLCanvasElement.prototype.getContext=()=>({});const charts=[];
 class Chart {constructor(ctx,config){charts.push(config)}destroy(){}resize(){}}
 for(const[k,v]of Object.entries(saved))w.localStorage.setItem(k,v);
 if(blocked)Object.defineProperty(w,'localStorage',{get(){throw new Error('blocked')}});
 if(!blocked)w.indexedDB=indexedDB;
 const app=initApp({document:d,Chart}),el=id=>d.getElementById(id);
 await app.libraryReady;
 const input=(id,value)=>{const e=el(id);if(e.type==='checkbox')e.checked=!!value;else e.value=String(value);e.dispatchEvent(new w.Event('input',{bubbles:true}));};
 const snapshot=()=>Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)]));
 return {w,d,el,input,app,charts,snapshot,indexedDB,close:()=>{app.destroy();dom.window.close()}};
}
const settle=async(predicate)=>{for(let i=0;i<100;i++){if(predicate())return;await new Promise(r=>setTimeout(r,5));}assert.fail('Operation did not finish');};
function fillMeasurement(a,name='Zkouška <img src=x onerror=alert(1)>'){
 a.input('cr_task','record');
 for(const[id,value]of Object.entries({cr_technique_name:name,cr_setup:'Tube / IP / scanner',cr_screens:'Pb 0.1 mm',cr_scan:'50 um / raw',cr_delay:10,cr_srb:.13,cr_current:2,cr_seconds:120,cr_achieved_snr:85}))a.input(id,value);
}
test('default example, four tabs, keyboard navigation and manual focus work',async()=>{
 const a=await setup();assert.equal(a.el('n_result-display').textContent,'10');assert.equal(a.d.querySelectorAll('[role=tab]').length,4);
 assert.ok(a.charts[0].data.datasets.some(x=>x.label==='Vaše geometrie'));
 for(const id of ['exposures','unsharpness','time','digital_radiography']){a.d.querySelector(`[data-tab="${id}"]`).click();assert.equal(a.el(id).hidden,false);assert.equal(a.d.querySelectorAll('.tab-pane:not([hidden])').length,1);}
 const first=a.d.querySelector('[data-tab=exposures]');first.focus();first.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(a.d.activeElement.dataset.tab,'unsharpness');
 a.el('show-manual-button').focus();a.el('show-manual-button').click();assert.equal(a.el('manual-modal-container').getAttribute('aria-hidden'),'false');
 a.d.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(a.d.activeElement.id,'show-manual-button');
 assert.equal(a.d.querySelectorAll('[data-tab=ai_assistant]').length,0);a.close();
});
test('invalid inputs clear prior results and switching nomograms requires the correct distance',async()=>{
 const a=await setup();a.input('n_thickness',0);assert.equal(a.el('n_result-display').textContent,'—');assert.equal(a.el('n_thickness').getAttribute('aria-invalid'),'true');
 a.input('n_thickness',10);a.input('n_technique','double');assert.equal(a.el('n_distance').value,'');assert.equal(a.el('n_result-display').textContent,'—');
 a.input('n_diameter',200);a.input('n_distance',400);assert.equal(a.el('n_result-display').textContent,'6');
 a.input('n_technique','inside');a.input('n_distance',195);assert.match(a.el('n_error').textContent,/dutině/);assert.equal(a.el('n_result-display').textContent,'—');
 a.input('ug_gap',20);assert.equal(a.el('ug_result-display').textContent,'0,09184');a.input('ug_source_distance',0);assert.equal(a.el('ug_result-display').textContent,'—');a.close();
});
test('manufacturer film time needs actual current; gamma uses planned time and source units',async()=>{
 const a=await setup();assert.equal(a.el('xray_current').value,'');assert.equal(a.el('t_result_display_xray').textContent,'—');
 a.input('xray_current',2);assert.equal(a.el('t_result_display_xray').textContent,'≈ 2 min 35 s');
 a.input('xray_film','D4');assert.equal(a.el('t_result_display_xray').textContent,'≈ 6 min 47 s');
 a.input('xray_material','aluminum');assert.equal(a.el('t_result_display_xray').textContent,'—');
 a.input('source_type','gamma');a.input('t_activity_date','2026-09-05T10:00');a.input('t_exposure_date','2026-09-05T10:00');assert.equal(a.el('t_result_display_gamma').textContent,'≈ 20 min 43 s');
 a.input('t_exposure_date','2026-09-04T10:00');assert.equal(a.el('t_result_display_gamma').textContent,'—');a.input('t_exposure_date','2027-01-01T10:00');assert.match(a.el('t_result_display_gamma').textContent,/≈/);a.close();
});
test('manual E confirmation binds calibration conditions and persists across reload',async()=>{
 const a=await setup();for(const[id,value]of Object.entries({xray_mode:'manual',xray_factor:10,xray_reference_distance:800,xray_current:2,xray_reference_name:'Reference 200 kV / D7 / Pb / G135'}))a.input(id,value);
 assert.equal(a.el('t_result_display_xray').textContent,'—');a.el('xray_confirm_reference').click();assert.equal(a.el('t_result_display_xray').textContent,'7 min 49 s');
 a.input('t_distance_xray',800);assert.equal(a.el('t_result_display_xray').textContent,'5 min 0 s');const saved=a.snapshot();a.close();
 const b=await setup(saved,false,a.indexedDB);assert.equal(b.el('t_result_display_xray').textContent,'5 min 0 s');b.input('xray_voltage',220);assert.equal(b.el('t_result_display_xray').textContent,'—');assert.match(b.el('xray_error').textContent,/Potvrďte/);b.close();
});
test('CR has no invented exposure and stores a measured failure as a trial reference',async()=>{
 const a=await setup();assert.equal(a.el('cr_target_snr').textContent,'≥ 100');assert.equal(a.el('cr_suggested_exposure').textContent,'—');
 fillMeasurement(a);assert.equal(a.el('cr_validation_message').dataset.state,'fail');a.el('cr_save_button').click();await settle(()=>!a.el('cr_save_button').disabled);
 assert.equal(a.app.records().length,1);const ref=a.app.records()[0];assert.equal(ref.exposure,4);assert.equal(ref.snrPass,false);
 assert.match(a.el('cr_library_container').textContent,/zkušební měření pod cílem/);assert.equal(a.el('cr_library_container').querySelector('img'),null);
 a.el('cr_library_container').querySelector('[data-action=reference]').click();assert.equal(a.el('cr_suggested_exposure').textContent,'≈ 5,536 mA·min');
 a.input('cr_fdd',2000);assert.equal(a.el('cr_achieved_snr').value,'');assert.equal(a.el('cr_seconds').value,'');assert.equal(a.el('cr_suggested_exposure').textContent,'≈ 22,15 mA·min');
 a.el('cr_save_button').click();await settle(()=>!a.el('cr_save_button').disabled);assert.equal(a.app.records().length,1);
 a.input('cr_voltage',399);assert.equal(a.el('cr_suggested_exposure').textContent,'—');assert.match(a.el('cr_reference_error').textContent,/Reference neodpovídá/);
 const saved=a.snapshot();a.close();const b=await setup(saved,false,a.indexedDB);assert.equal(b.app.records().length,1);assert.equal(b.app.records()[0].snrPass,false);b.close();
});
test('CR current or setup changes cannot reuse measured SNR; class changes re-evaluate the image',async()=>{
 const a=await setup();fillMeasurement(a);a.input('cr_class','A');assert.equal(a.el('cr_validation_message').dataset.state,'pass');
 a.input('cr_current',3);assert.equal(a.el('cr_achieved_snr').value,'');a.input('cr_achieved_snr',85);a.input('cr_scan','new');assert.equal(a.el('cr_achieved_snr').value,'');a.close();
});
test('CR legacy records are preserved without calibration actions and deletion requires confirmation',async()=>{
 const old=JSON.stringify([{id:123,name:'Old <img src=x>',thickness:20}]);const a=await setup({cr_techniques_library:old,rt_inputs_v2:'{broken'});
 assert.match(a.el('cr_library_container').textContent,/Starý neověřený odhad/);assert.equal(a.el('cr_library_container').querySelector('[data-action=reference]'),null);
 assert.equal(a.el('cr_library_container').querySelector('img'),null);a.el('cr_library_container').querySelector('button').click();a.el('modal-cancel-btn').click();assert.match(a.el('cr_library_container').textContent,/Old/);
 a.el('cr_library_container').querySelector('button').click();a.el('modal-confirm-btn').click();await settle(()=>!a.el('cr_library_container').textContent.includes('Old'));assert.doesNotMatch(a.el('cr_library_container').textContent,/Old/);assert.equal(a.w.localStorage.getItem('cr_techniques_library'),old);a.close();
});
test('unavailable storage permits calculations and clearly labels temporary CR records',async()=>{
 const a=await setup({},true);fillMeasurement(a);a.el('cr_save_button').click();await settle(()=>!a.el('cr_save_button').disabled);assert.equal(a.app.records().length,1);assert.match(a.el('cr_save_error').textContent,/pouze dočasně/);assert.match(a.d.querySelector('.save-note').textContent,/do obnovení/);a.close();
});

test('CR task switch shows only relevant fields, works with keyboard, and restores its choice',async()=>{
 const a=await setup();assert.equal(a.el('cr_task').value,'check');assert.equal(a.el('cr_record_fields').hidden,true);assert.equal(a.el('cr_exposure_fields').hidden,true);assert.equal(a.el('cr_library_section').hidden,true);
 const first=a.d.querySelector('[data-choice-for=cr_task][data-value=check]');first.focus();first.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
 assert.equal(a.el('cr_task').value,'record');assert.equal(a.el('cr_record_fields').hidden,false);assert.equal(a.el('cr_setup_details').open,true);assert.equal(a.d.activeElement.dataset.value,'record');
 a.input('cr_task','estimate');assert.equal(a.el('cr_quality_fields').hidden,true);assert.equal(a.el('cr_seconds_wrap').hidden,true);assert.equal(a.el('cr_reference_picker').hidden,false);assert.equal(a.el('cr_setup_details').open,false);assert.equal(a.el('cr_estimate_output').hidden,false);
 const saved=a.snapshot();a.close();const b=await setup(saved,false,a.indexedDB);assert.equal(b.el('cr_task').value,'estimate');assert.equal(b.d.querySelector('[data-choice-for=cr_task][data-value=estimate]').getAttribute('aria-checked'),'true');b.close();
});
test('decimal comma and precise inline geometry errors are supported without losing errors on blur',async()=>{
 const a=await setup();a.input('ug_focus','1,5');assert.equal(a.el('ug_result-display').textContent,'0,03061');a.input('ug_focus','0x10');assert.equal(a.el('ug_result-display').textContent,'—');assert.match(a.el('ug_focus-error').textContent,/Zadejte číslo/);
 a.input('n_technique','inside');a.input('n_diameter',200);a.input('n_distance',195);assert.equal(a.el('n_distance').getAttribute('aria-invalid'),'true');assert.match(a.el('n_distance-error').textContent,/dutině/);
 a.el('n_distance').dispatchEvent(new a.w.FocusEvent('focusout',{bubbles:true}));assert.match(a.el('n_distance-error').textContent,/dutině/);a.input('n_distance',100);assert.equal(a.el('n_distance-error').textContent,'');assert.equal(a.el('n_result-display').textContent,'1');a.close();
});
test('geometry cards update the selected technique and focus highlights the actual dimension',async()=>{
 const a=await setup();a.d.querySelector('[data-choice-for=n_technique][data-value=inside]').click();assert.equal(a.el('n_technique').value,'inside');assert.equal(a.el('n_geometry_diagram').querySelector('svg').dataset.technique,'inside');assert.equal(a.el('n_distance').value,'');
 a.el('n_diameter').focus();assert.equal(a.el('n_geometry_diagram').querySelector('svg').dataset.highlight,'diameter');
 a.d.querySelector('[data-choice-for=ug_technique][data-value=dwsi]').click();assert.equal(a.el('ug_geometry_diagram').querySelector('svg').dataset.technique,'dwsi');assert.match(a.el('ug_geometry_diagram').textContent,/f′/);assert.equal(a.el('ug_diameter_wrap').hidden,false);a.close();
});
test('missing current gives a neutral next step; mobile summary follows the active calculator',async()=>{
 const a=await setup();a.app.tab('time');assert.equal(a.el('xray_error').textContent,'');assert.match(a.el('xray_next_step').textContent,/proud/);assert.equal(a.el('xray_current').getAttribute('aria-invalid'),'false');
 a.input('xray_current','2,0');assert.equal(a.el('mobile-result-value').textContent,'≈ 2 min 35 s');assert.equal(a.el('mobile-result').dataset.state,'estimate');
 a.app.tab('unsharpness');assert.equal(a.el('mobile-result-value').textContent,'0,03061 mm');a.el('mobile-result').click();assert.equal(a.d.activeElement.id,'ug_result_panel');a.close();
});
test('record validation opens the relevant group and focuses the missing field',async()=>{
 const a=await setup();a.input('cr_task','record');a.el('cr_setup_details').open=false;a.el('cr_save_button').click();await settle(()=>!a.el('cr_save_button').disabled);assert.equal(a.app.records().length,0);assert.equal(a.d.activeElement.id,'cr_current');assert.match(a.el('cr_current-error').textContent,/Doplňte/);
 fillMeasurement(a);a.input('cr_setup','');a.input('cr_achieved_snr',85);a.el('cr_setup_details').open=false;a.el('cr_save_button').click();await settle(()=>!a.el('cr_save_button').disabled);assert.equal(a.d.activeElement.id,'cr_setup');assert.equal(a.el('cr_setup_details').open,true);assert.match(a.el('cr_setup-error').textContent,/Doplňte/);a.close();
});
test('stale SNR explains the changed condition, persists, and clears after a new measurement',async()=>{
 const a=await setup();fillMeasurement(a);a.input('cr_voltage',390);assert.equal(a.el('cr_achieved_snr').value,'');assert.equal(a.el('cr_stale_message').hidden,false);assert.match(a.el('cr_stale_message').textContent,/napětí/);
 const saved=a.snapshot();a.close();const b=await setup(saved,false,a.indexedDB);assert.equal(b.el('cr_stale_message').hidden,false);b.input('cr_achieved_snr',110);assert.equal(b.el('cr_stale_message').hidden,true);assert.equal(b.el('cr_result_focus').dataset.state,'pass');b.close();
});
test('active reference survives reload and reports exact mismatched values',async()=>{
 const a=await setup();fillMeasurement(a,'Reference A');a.el('cr_save_button').click();await settle(()=>!a.el('cr_save_button').disabled);a.el('cr_library_container').querySelector('[data-action=reference]').click();
 assert.equal(a.el('cr_task').value,'estimate');assert.equal(a.el('cr_selected_reference').textContent,'Reference A');assert.ok(a.el('cr_library_container').querySelector('[data-active=true]'));
 a.el('cr_library_container').querySelector('details').open=true;a.input('cr_voltage',300);assert.match(a.el('cr_reference_error').textContent,/reference 400 kV, zadání 300 kV/);assert.equal(a.el('cr_suggested_exposure').textContent,'—');
 const saved=a.snapshot();a.close();const b=await setup(saved,false,a.indexedDB);assert.equal(b.el('cr_selected_reference').textContent,'Reference A');assert.match(b.el('cr_reference_error').textContent,/reference 400 kV, zadání 300 kV/);b.el('cr_clear_reference').click();assert.equal(b.el('cr_library_container').querySelector('[data-active=true]'),null);assert.equal(b.el('cr_selected_reference').textContent,'Žádná reference');b.close();
});
test('all visible form controls have labels and all described-by references resolve',async()=>{
 const a=await setup();const ids=[...a.d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
 for(const el of a.d.querySelectorAll('#tab-content input,#tab-content select')){
  assert.ok(el.getAttribute('aria-label')||a.d.querySelector(`[for="${el.id}"]`)||el.closest('label'),el.id);
  for(const id of (el.getAttribute('aria-describedby')||'').split(' ').filter(Boolean))assert.ok(a.el(id),id);
 }
 a.close();
});
