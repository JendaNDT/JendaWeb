import { forms, manual } from './views.js';
import { geometryDiagram } from './geometry.js';
import { XRAY_CHARTS } from './manufacturer-data.js';
import { evaluate, clone } from './workflow-model.js';
import { trapFocus } from './dialog-focus.js';
import { assertContext, canonicalForm } from './context-schema.js';
import { createCrLibrary } from './cr-library.js';
import { exposureCount,unsharpness,maximumVoltage,gammaTime,xrayChartExposure,xrayTime,snrTarget,normalizedSnr,predictCrExposure,createCrMeasurement,isMeasurement,formatDuration,MATERIALS,CALCULATION_VERSION,REFERENCE_KEYS } from './calculations.js';

export function initApp({document:d=globalThis.document,Chart}={}) {
 const w=d.defaultView,byId=id=>d.getElementById(id),abort=new w.AbortController();
 byId('tab-content').innerHTML=forms();byId('manual-body').innerHTML=manual();
 const scrollBehavior=()=>w.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 const on=(el,type,handler,options={})=>el.addEventListener(type,handler,{...options,signal:abort.signal});
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const number=value=>Number.isFinite(value)?value.toLocaleString('cs-CZ',{maximumSignificantDigits:4}):'—';
 const text=(id,value)=>{byId(id).textContent=value;};
 const val=id=>byId(id).value;
 const n=id=>{const value=val(id).trim().replace(',','.');return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(value)?Number(value):NaN;};
 const checked=id=>byId(id).checked;
 const show=(id,visible)=>{byId(id).hidden=!visible;};
 const memory=new Map();let storageFailed=false,chart=null,reference=null,destroyed=false;
 const read=key=>{try{return w.localStorage.getItem(key)??memory.get(key)??null;}catch{return memory.get(key)??null;}};
 const write=(key,value)=>{memory.set(key,value);try{w.localStorage.setItem(key,value);}catch{storageFailed=true;const note=d.querySelector('.save-note');if(note){note.textContent='Ukládání není dostupné; data zůstanou do obnovení stránky.';note.dataset.state='error';}}};
 const parse=(key,fallback)=>{try{return JSON.parse(read(key))??fallback;}catch{return fallback;}};
 const list=value=>Array.isArray(value)?value:[];
 let records=list(parse('rt_measurements_v2',[])).filter(isMeasurement).map(r=>({...createCrMeasurement(r),id:r.id}));
 const deletedLegacy=new Set(list(parse('rt_legacy_hidden_v2',[])).map(String));
 let legacy=list(parse('cr_techniques_library',[])).filter(r=>r&&typeof r.name==='string'&&Number.isFinite(r.id)&&Number.isFinite(r.thickness));
 const inputElements=[...byId('tab-content').querySelectorAll('input,select')];
 const localDate=()=>{const date=new Date();return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);};
 ['t_activity_date','t_exposure_date','cr_measured_at'].forEach(id=>{byId(id).value=localDate();});
 const saved=parse('rt_inputs_v2',{});
 for(const el of inputElements) {
  if(!saved||!Object.hasOwn(saved,el.id))continue;
  const value=saved[el.id];
  if(el.type==='checkbox'&&typeof value==='boolean')el.checked=value;
  else if(typeof value==='string'&&(el.tagName!=='SELECT'||[...el.options].some(o=>o.value===value)))el.value=value;
 }
 let manualSignature=typeof saved?.manualSignature==='string'?saved.manualSignature:null;
 let staleMeasurement=typeof saved?.staleMeasurement==='string'?saved.staleMeasurement:'',activeTab='exposures';
 reference=isMeasurement(saved?.reference)?clone(saved.reference):records.find(r=>r.id===saved?.referenceId)||null;
 const touched=new Set(),zeroAllowed=new Set(['ug_gap','cr_delay']);
 const label=id=>d.querySelector(`[for="${id}"]`)?.textContent.trim()||id;
 function fieldError(id,message,missing=false){const el=byId(id),error=byId(id+'-error');if(error)error.textContent=missing&&!touched.has(id)?'':message;if(el)el.setAttribute('aria-invalid',String(!!message&&(!missing||touched.has(id))));}
 function failField(id,message,missing=false){fieldError(id,message,missing);throw Object.assign(new Error(message),{field:id,missing});}
 function clearFields(ids){ids.forEach(id=>fieldError(id,''));}
 function requireNumbers(ids){
  const issues=[];
  for(const id of ids){const value=n(id),empty=!val(id).trim();let message='';if(empty)message=`Doplňte ${label(id).toLocaleLowerCase('cs-CZ')}.`;else if(!Number.isFinite(value))message='Zadejte číslo, například 10 nebo 0,5.';else if(zeroAllowed.has(id)?value<0:value<=0)message=zeroAllowed.has(id)?'Zadejte nulu nebo kladné číslo.':'Zadejte číslo větší než 0.';else if(id==='cr_magnification'&&value<1)message='Zvětšení musí být alespoň 1.';fieldError(id,message,empty);if(message)issues.push({id,message,empty});}
  if(issues.length){const first=issues[0];throw Object.assign(new Error(first.message),{field:first.id,missing:first.empty});}
 }
 function requireText(ids){for(const id of ids){if(!val(id).trim())failField(id,`Doplňte ${label(id).toLocaleLowerCase('cs-CZ')}.`,true);fieldError(id,'');}}
 function focusField(id){const el=byId(id);if(!el)return;for(let parent=el.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;el.focus();el.scrollIntoView?.({block:'center',behavior:scrollBehavior()});}
 function resultState(prefix,state,kind,context='',next=''){byId(prefix+'_result_focus').dataset.state=state;const badge=byId(prefix+'_result_kind');if(badge)badge.textContent=kind;const summary=byId(prefix+'_result_context');if(summary)summary.textContent=context;text(prefix+'_next_step',next);}
 function updateMobile(){const prefix=activeTab==='exposures'?'n':activeTab==='unsharpness'?'ug':activeTab==='digital_radiography'?'cr':val('source_type')==='gamma'?'gamma':'xray';const output=byId({n:'n_result-display',ug:'ug_result-display',xray:'t_result_display_xray',gamma:'t_result_display_gamma',cr:val('cr_task')==='estimate'?'cr_suggested_time':'cr_target_snr'}[prefix]);const value=output.textContent==='—'?'Doplňte údaje':output.textContent+(prefix==='ug'?' mm':prefix==='n'?' expozic':'');text('mobile-result-value',value);text('mobile-result-kind',byId(prefix+'_result_kind')?.textContent||(prefix==='gamma'?'Odhad z diagramu':'Výsledek'));text('mobile-result-context',byId(prefix+'_next_step').textContent||byId(prefix+'_result_context')?.textContent||'');byId('mobile-result').dataset.state=byId(prefix+'_result_focus').dataset.state||'neutral';byId('mobile-result').dataset.panel=prefix+'_result_panel';const actions=byId('result-actions'),target=byId(prefix+'_result_focus');if(actions&&actions.parentElement!==target)target.append(actions);}
 const saveInputs=()=>{
  const state=Object.fromEntries(inputElements.map(el=>[el.id,el.type==='checkbox'?el.checked:el.value]));
  state.manualSignature=manualSignature;state.staleMeasurement=staleMeasurement;state.referenceId=reference?.id??null;state.reference=reference?clone(reference):null;write('rt_inputs_v2',JSON.stringify(state));
 };
 const setStatus=(id,message,state='neutral')=>{text(id,message);byId(id).dataset.state=state;};
 const markError=(id,error)=>text(id,error instanceof Error?error.message:String(error));
 const clear=(...ids)=>ids.forEach(id=>text(id,'—'));
 function tab(id,focus=false) {
  activeTab=id;
  const buttons=[...d.querySelectorAll('#tabs button[data-tab]')];
  buttons.forEach(btn=>{
   const active=btn.dataset.tab===id;btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1;
   btn.classList.toggle('tab-active',active);btn.classList.toggle('tab-inactive',!active);
   const panel=byId(btn.dataset.tab);panel.hidden=!active;panel.classList.toggle('hidden',!active);
   if(active){const titles={exposures:['Počet expozic','Počet snímků podle geometrie a třídy zkoušení.'],unsharpness:['Geometrická neostrost','Geometrie snímku a minimální vzdálenost zdroje.'],time:['Expoziční čas na film','Čas podle výrobního diagramu nebo vlastní reference.'],digital_radiography:['CR měření','Kontrola SNR, zápis měření a odhad expozice.']};text('workspace-title',titles[id][0]);if(byId('workspace-description'))text('workspace-description',titles[id][1]);if(focus)btn.focus();}
  });
  if(id==='exposures')chart?.resize?.();
  updateMobile();
 }
 const tabs=[...d.querySelectorAll('#tabs button[data-tab]')];
 byId('tabs').setAttribute('role','tablist');byId('tabs').setAttribute('aria-label','Výpočetní nástroje');
 tabs.forEach((btn,index)=>{
  btn.id='tab-'+btn.dataset.tab;btn.setAttribute('role','tab');btn.setAttribute('aria-controls',btn.dataset.tab);
  on(btn,'click',()=>tab(btn.dataset.tab));
  on(btn,'keydown',event=>{
   let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%tabs.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();tab(tabs[next].dataset.tab,true);}
  });
 });
 tab('exposures');
 on(byId('mobile-result'),'click',()=>{const panel=byId(byId('mobile-result').dataset.panel);panel.tabIndex=-1;panel.focus({preventScroll:true});panel.scrollIntoView?.({block:'start',behavior:scrollBehavior()});});

 let returnFocus=null,confirmAction=null;
 function closeDialog(id){byId(id).classList.remove('visible');byId(id).setAttribute('aria-hidden','true');if(byId('app-surface'))byId('app-surface').inert=false;d.body.classList.remove('modal-open');returnFocus?.focus?.();confirmAction=null;}
 function openDialog(id){returnFocus=d.activeElement;byId(id).classList.add('visible');byId(id).setAttribute('aria-hidden','false');if(byId('app-surface'))byId('app-surface').inert=true;d.body.classList.add('modal-open');byId('connection-popover')?.removeAttribute('open');byId(id).querySelector('button')?.focus();}
 on(byId('show-manual-button'),'click',()=>openDialog('manual-modal-container'));
 on(byId('manual-modal-close-btn'),'click',()=>closeDialog('manual-modal-container'));
 on(byId('modal-cancel-btn'),'click',()=>closeDialog('modal-container'));
 on(byId('modal-confirm-btn'),'click',()=>{const action=confirmAction;closeDialog('modal-container');action?.();});
 for(const el of d.querySelectorAll('.modal-overlay'))on(el,'click',e=>{if(e.target===el)closeDialog(el.id);});
 on(d,'keydown',e=>{
  const overlay=d.querySelector('.modal-overlay.visible');if(!overlay)return;
  if(e.key==='Escape'){closeDialog(overlay.id);return;}
  trapFocus(e,overlay);
 });

 function renderN() {
  const technique=val('n_technique'),outside=technique==='outside';
  d.querySelector('[for="n_distance"]').textContent=outside?'Vzdálenost zdroj–předmět f':'Vzdálenost zdroj–film SFD';
  byId('n_geometry_diagram').innerHTML=geometryDiagram(technique);syncChoices('n_technique');
  text('n_technique_help',outside?'Film uvnitř, zdroj vně. f se měří k přivrácenému povrchu.':technique==='double'?'Zdroj a film vně, hodnocení stěny u filmu (DWSI). Zadejte celou SFD.':'Zdroj v dutině, film na vnějším povrchu. SFD se měří k filmu v hlavním směru expozice.');
  text('n_error','');text('n_boundary_note','');
  clearFields(['n_thickness','n_diameter','n_distance']);
  const lower=technique==='inside'?n('n_diameter')/2:technique==='outside'?n('n_diameter')/4:n('n_diameter');
  text('n_distance-hint',Number.isFinite(lower)?technique==='inside'?`Povolená SFD: od ${number(lower)} do méně než ${number(n('n_diameter')-n('n_thickness'))} mm.`:outside?`Rozsah nomogramu: f ≥ ${number(lower)} mm.`:`SFD musí být větší než ${number(lower)} mm.`:'Vzdálenost v mm podle schématu.');
  try {
   requireNumbers(['n_thickness','n_diameter','n_distance']);
   if(n('n_thickness')/n('n_diameter')>.25)failField('n_thickness',`Pro tento průměr zadejte nejvýše ${number(n('n_diameter')/4)} mm.`);
   if(technique==='inside'&&(n('n_distance')<lower||n('n_distance')>=n('n_diameter')-n('n_thickness')))failField('n_distance','Zdroj musí být v dutině. '+byId('n_distance-hint').textContent);
   if((outside&&n('n_distance')<lower)||(technique==='double'&&n('n_distance')<=lower))failField('n_distance',byId('n_distance-hint').textContent);
   const result=exposureCount({technique,qualityClass:val('n_testingClass'),thickness:n('n_thickness'),diameter:n('n_diameter'),distance:n('n_distance')});
   text('n_result-display',result.count??`> ${result.maxCount}`);
   text('n_result_context',`Stěna ${number(n('n_thickness'))} mm · De ${number(n('n_diameter'))} mm · třída ${val('n_testingClass')}`);text('n_next_step','');
   byId('n_result_focus').dataset.state='neutral';text('n_result_kind','Odečet nomogramu');
   text('n_result-ratios',`${result.figure} · t/De = ${number(result.x)} · De/${outside?'f':'SFD'} = ${number(result.y)}`);
   text('n_boundary_note',result.centered?'Zdroj v ose: panoramatická expozice.':result.nearBoundary?'Bod je blízko hranice digitalizace. Zvolen vyšší počet.':result.count===null?'Potřebný počet přesahuje dostupné křivky.':'');
   chart?.destroy();chart=null;
   if(Chart){
    const style=w.getComputedStyle(d.documentElement),dark=d.documentElement.dataset.theme==='dark';
    const color=(key,light,night)=>style.getPropertyValue(key).trim()||(dark?night:light);
    const ink=color('--muted','#596778','#b0bdcc'),grid=color('--chart-grid','#e0e5ec','#3c4858'),primary=color('--primary','#255bce','#99baff');
    const datasets=result.lines.map(l=>({label:`N = ${l.N}`,data:l.dataPoints,showLine:true,borderColor:color('--chart-line','#8091a5','#91a3ba'),borderWidth:1,pointRadius:0}));
    if(!outside)datasets.push({label:'Hranice stěny – nepřípustná oblast',data:Array.from({length:51},(_,i)=>({x:i/200,y:1/(1-i/200)})),showLine:true,borderDash:[5,4],borderColor:color('--chart-warning','#a56b20','#e6bd78'),pointRadius:0});
    datasets.push({label:'Vaše geometrie',data:[{x:result.x,y:result.y}],pointBackgroundColor:primary,pointBorderColor:primary,pointRadius:6});
    const axis={ticks:{color:ink,font:{family:'Inter Variable, sans-serif'}},grid:{color:grid,borderColor:grid}};
    chart=new Chart(byId('nomogramChart').getContext('2d'),{type:'scatter',data:{datasets},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{backgroundColor:color('--panel','#ffffff','#1c222a'),titleColor:ink,bodyColor:ink,borderColor:grid,borderWidth:1}},scales:{x:{...axis,type:'linear',min:0,max:.25,title:{display:true,text:'t/De',color:ink}},y:{...axis,min:0,max:result.yMax,title:{display:true,text:outside?'De/f':'De/SFD',color:ink}}}}});
   }
  }catch(error){clear('n_result-display');text('n_result-ratios','');resultState('n',error.missing?'neutral':'fail',error.missing?'Chybí zadání':'Zkontrolujte geometrii','',error.message);if(!error.missing)markError('n_error',error);chart?.destroy();chart=null;}
  updateMobile();
 }
 function syncChoices(id){d.querySelectorAll(`[data-choice-for="${id}"]`).forEach(button=>{const active=button.dataset.value===val(id);button.setAttribute('aria-checked',String(active));button.tabIndex=active?0:-1;});}
 on(byId('tab-content'),'click',event=>{const button=event.target.closest('[data-choice-for]');if(!button)return;const el=byId(button.dataset.choiceFor);if(el.value!==button.dataset.value){el.value=button.dataset.value;el.dispatchEvent(new w.Event('input',{bubbles:true}));}});
 on(byId('tab-content'),'keydown',event=>{const button=event.target.closest('[data-choice-for]');if(!button)return;const options=[...d.querySelectorAll(`[data-choice-for="${button.dataset.choiceFor}"]`)];const i=options.indexOf(button);let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(i+1)%options.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(i+options.length-1)%options.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=options.length-1;if(next!==undefined){event.preventDefault();options[next].click();options[next].focus();}});
 on(d,'rt-theme-change',()=>renderN());
 function renderUg() {
  show('ug_diameter_wrap',val('ug_technique')!=='single');text('ug_error','');
  syncChoices('ug_technique');byId('ug_geometry_diagram').innerHTML=geometryDiagram(val('ug_technique'),{module:'ug',gap:n('ug_gap')});
  text('ug_technique_help',val('ug_technique')==='single'?'b zahrnuje tloušťku předmětu a mezeru k filmu.':val('ug_technique')==='dwsi'?'Zeleně je označena hodnocená stěna u filmu. f′ a b′ se vztahují k této stěně.':'Zeleně jsou označeny obě hodnocené stěny. Ug se počítá pro přivrácenou stěnu.');
  clearFields(['ug_focus','ug_source_distance','ug_thickness','ug_gap','ug_diameter']);
  try{
   requireNumbers(['ug_focus','ug_source_distance','ug_thickness','ug_gap',...(val('ug_technique')!=='single'?['ug_diameter']:[])]);
   if(val('ug_technique')!=='single'&&n('ug_diameter')<=2*n('ug_thickness'))failField('ug_diameter',`Průměr musí být větší než ${number(2*n('ug_thickness'))} mm.`);
   const r=unsharpness({focus:n('ug_focus'),sourceDistance:n('ug_source_distance'),thickness:n('ug_thickness'),gap:n('ug_gap'),diameter:n('ug_diameter'),technique:val('ug_technique'),qualityClass:val('ug_class'),planar:checked('ug_planar')});
   text('ug_result-display',number(r.ug));text('ug_geometry',`Hodnocená geometrie: f = ${number(r.f)} mm · b = ${number(r.b)} mm`);
   setStatus('ug_minimum',`Minimální f pro tuto kontrolu: ${number(r.minF)} mm. ${r.passes?'Zadaná vzdálenost vyhovuje tomuto kritériu.':'Zadaná vzdálenost je nedostatečná.'}`,r.passes?'pass':'fail');
   resultState('ug',r.passes?'pass':'fail',r.passes?'Minimální vzdálenost splněna':'Nedostatečná vzdálenost');
  }catch(error){clear('ug_result-display');text('ug_geometry','');setStatus('ug_minimum','');resultState('ug',error.missing?'neutral':'fail','Doplňte geometrii','',error.message);if(!error.missing)markError('ug_error',error);}
  updateMobile();
 }
 const voltageLabel=(material,thickness)=>{try{const r=maximumVoltage(material,thickness);return r===null?'Mimo rozsah do 1 000 kV':`${number(r)} kV`;}catch{return '—';}};
 const xraySignature=()=>JSON.stringify(['xray_material','xray_film','t_thickness_xray','xray_voltage','xray_factor','xray_reference_distance','xray_reference_name'].map(val));
 function renderXray() {
  const automatic=val('xray_mode')==='chart';show('xray_manual_fields',!automatic);show('xray_chart_conditions',automatic);
  const curves=XRAY_CHARTS[val('xray_film')];text('xray_voltage-hint',automatic?`Diagram ${val('xray_film')}: ${curves[0].kv}–${curves.at(-1).kv} kV, podle tloušťky.`:'Napětí, pro které platí vlastní referenční E.');byId('xray_voltage-hint').classList.remove('sr-only');byId('xray_voltage-hint').classList.add('input-hint');
  byId('xray_factor').readOnly=automatic;byId('xray_reference_distance').readOnly=automatic;
  text('xray_voltage_recommendation',voltageLabel(val('xray_material'),n('t_thickness_xray')));text('xray_error','');clear('t_result_display_xray');text('xray_actual_exposure','');
  clearFields(['t_thickness_xray','xray_voltage','xray_current','t_distance_xray','xray_factor','xray_reference_distance','xray_reference_name','xray_material']);
  try {
   requireNumbers(['t_thickness_xray','xray_voltage']);
   let exposure;
   if(automatic){
    byId('xray_reference_distance').value='1000';byId('xray_factor').value='';
    if(val('xray_material')!=='steel')failField('xray_material','Výrobní diagram je pro ocel. Pro tento materiál zvolte vlastní referenční E.');
    try{exposure=xrayChartExposure(val('xray_film'),n('t_thickness_xray'),n('xray_voltage'));}catch(error){fieldError('xray_voltage',error.message);failField('t_thickness_xray',error.message);}
    byId('xray_factor').value=exposure.toLocaleString('cs-CZ',{useGrouping:false,maximumSignificantDigits:5});
   }else{
    requireText(['xray_reference_name']);requireNumbers(['xray_factor','xray_reference_distance']);
    if(manualSignature!==xraySignature())failField('xray_factor','Potvrďte platnost E pro aktuální materiál, film, tloušťku, napětí a referenční vzdálenost.');
    exposure=n('xray_factor');
   }
   requireNumbers(['xray_current','t_distance_xray']);
   const minutes=xrayTime({exposure,distance:n('t_distance_xray'),referenceDistance:n('xray_reference_distance'),current:n('xray_current')});
   text('t_result_display_xray',(automatic?'≈ ':'')+formatDuration(minutes));text('xray_actual_exposure',`Při zadané SFD: ${number(minutes*n('xray_current'))} mA·min`);
   resultState('xray',automatic?'estimate':'neutral',automatic?'Odhad z výrobního diagramu':'Přepočet vlastní reference',`${MATERIALS[val('xray_material')]} ${number(n('t_thickness_xray'))} mm · ${val('xray_film')} · ${number(n('xray_voltage'))} kV · ${number(n('xray_current'))} mA · SFD ${number(n('t_distance_xray'))} mm`);
  }catch(error){resultState('xray',error.missing?'neutral':'fail',error.missing?'Chybí zadání':'Zkontrolujte zadání','',error.message);if(!error.missing)markError('xray_error',error);}
  text('xray_manual_status',manualSignature===xraySignature()?'Referenční E je přiřazeno k aktuálně zadaným podmínkám.':'Po změně materiálu, filmu, tloušťky nebo napětí znovu potvrďte platnost E.');
  updateMobile();
 }
 on(byId('xray_confirm_reference'),'click',()=>{const ids=['t_thickness_xray','xray_voltage','xray_factor','xray_reference_distance'];[...ids,'xray_reference_name'].forEach(id=>touched.add(id));try{requireNumbers(ids);requireText(['xray_reference_name']);manualSignature=xraySignature();renderXray();saveInputs();}catch(error){text('xray_next_step',error.message);markError('xray_error',error);focusField(error.field);updateMobile();}});
 function renderGamma() {
  text('gamma_error','');
  clearFields(['t_activity','t_activity_date','t_exposure_date','t_thickness_gamma','t_distance_gamma']);
  try{
   requireNumbers(['t_activity','t_thickness_gamma','t_distance_gamma']);requireText(['t_activity_date','t_exposure_date']);
   if(n('t_thickness_gamma')<10||n('t_thickness_gamma')>90)failField('t_thickness_gamma','Zadejte tloušťku od 10 do 90 mm.');
   if(new Date(val('t_exposure_date'))<new Date(val('t_activity_date')))failField('t_exposure_date','Expozice nesmí předcházet referenční aktivitě.');
   const r=gammaTime({activity:n('t_activity'),referenceTime:val('t_activity_date'),exposureTime:val('t_exposure_date'),thickness:n('t_thickness_gamma'),distance:n('t_distance_gamma'),film:val('t_film')});
   text('t_result_display_gamma','≈ '+formatDuration(r.minutes));text('t_current_activity',`Aktivita k času expozice: ${number(r.currentActivity)} GBq`);
   text('gamma_reference_exposure',`Odečet při 1 m: ${number(r.ciHours)} Ci·h = ${number(r.gbqHours)} GBq·h`);
   resultState('gamma','estimate','Odhad z výrobního diagramu',`Ocel ${number(n('t_thickness_gamma'))} mm · ${val('t_film')} · SFD ${number(n('t_distance_gamma'))} mm`);
  }catch(error){clear('t_result_display_gamma');text('t_current_activity','');text('gamma_reference_exposure','');resultState('gamma',error.missing?'neutral':'fail','Zkontrolujte zadání','',error.message);if(!error.missing)markError('gamma_error',error);}
  updateMobile();
 }
 function renderTime(){const gamma=val('source_type')==='gamma';show('gamma_calculator',gamma);show('xray_calculator',!gamma);if(gamma)renderGamma();else renderXray();}
 function crInput(){return{
  material:val('cr_material'),thickness:n('cr_thickness'),fdd:n('cr_fdd'),voltage:n('cr_voltage'),qualityClass:val('cr_class'),roi:val('cr_roi'),flush:checked('cr_flush'),cp1:checked('cr_cp1'),iqiConfirmed:checked('cr_iqi'),
  kind:val('cr_snr_kind'),measured:n('cr_achieved_snr'),srb:n('cr_srb'),magnification:n('cr_magnification'),current:n('cr_current'),seconds:n('cr_seconds'),
  name:val('cr_technique_name'),setup:val('cr_setup').trim(),screens:val('cr_screens').trim(),scan:val('cr_scan').trim(),delay:n('cr_delay'),measuredAt:val('cr_measured_at')};}

 const referenceLabels={material:['Materiál',''],thickness:['Tloušťka','mm'],voltage:['Napětí','kV'],setup:['Sestava',''],screens:['Filtrace / fólie',''],scan:['Skener',''],delay:['Prodleva','min'],srb:['SR_b','mm'],magnification:['Zvětšení','×'],roi:['Místo měření',''],flush:['Zarovnání svaru','']};
 const displayCondition=(key,value)=>key==='material'?MATERIALS[value]:key==='roi'?(value==='weld'?'Svar':'HAZ / základní materiál'):typeof value==='boolean'?(value?'Ano':'Ne'):typeof value==='number'?`${number(value)} ${referenceLabels[key]?.[1]||''}`.trim():String(value||'Chybí');
 function referenceDifferences(input){return reference?REFERENCE_KEYS.filter(key=>typeof reference[key]==='number'?!Number.isFinite(input[key])||Math.abs(reference[key]-input[key])>1e-9:reference[key]!==input[key]):[];}
 function changeCrTask(mode){byId('cr_task').value=mode;byId('cr_setup_details').open=mode==='record';renderCR();saveInputs();}
 function renderCR() {
  const input=crInput(),mode=val('cr_task'),estimate=mode==='estimate',record=mode==='record';syncChoices('cr_task');
  show('cr_setup_details',mode!=='check');show('cr_exposure_fields',mode!=='check');show('cr_seconds_wrap',record);show('cr_quality_fields',!estimate);show('cr_resolution_fields',record||input.kind==='raw');show('cr_record_fields',record);show('cr_library_section',mode!=='check');show('cr_reference_picker',estimate);show('cr_reference_status',estimate);show('cr_quality_output',!estimate);show('cr_estimate_output',estimate);
  text('cr_task_hint',estimate?'Vyberte skutečné referenční měření a nastavte požadovanou vzdálenost a proud.':record?'Nejprve vyplňte sestavu a skutečnou expozici, potom zadejte naměřené SNR.':'Zadejte podmínky zkoušky a hodnotu SNR ze softwaru.');
  text('cr_exposure_heading',estimate?'Plánovaná expozice':'Skutečná expozice');d.querySelector('[for="cr_current"]').textContent=estimate?'Plánovaný proud':'Skutečný proud';
  text('cr_selected_reference',reference?reference.name:'Žádná reference');text('cr_choose_reference',reference?'Změnit referenci':'Vybrat z knihovny');
  text('cr_scope_note',estimate?'Odhad platí při shodných ostatních podmínkách a převaze kvantového šumu. Nový snímek znovu změřte.':'Posuzuje se pouze SNR_N. IQI, prostorové rozlišení a ostatní požadavky se ověřují samostatně.');
  text('cr_voltage_recommendation',voltageLabel(input.material,input.thickness));text('cr_error','');text('cr_cp1_error','');
  clearFields(['cr_thickness','cr_voltage','cr_achieved_snr','cr_srb','cr_magnification','cr_fdd','cr_current']);
  clear('cr_target_snr','cr_suggested_exposure','cr_suggested_time');text('cr_target_explanation','');text('cr_estimate_target','');setStatus('cr_validation_message','Zadejte naměřené SNR pro kontrolu.');
  show('cr_clear_reference',!!reference);text('cr_reference_name',reference?`${reference.name} · ${number(reference.exposure)} mA·min · SNR_N ${number(reference.achievedSnr)}`:'');text('cr_reference_error','');
  show('cr_stale_message',!!staleMeasurement);text('cr_stale_message',staleMeasurement);
  resultState('cr','neutral',estimate?'Odhad z referenčního měření':'Kontrola SNR_N','',estimate?'Vyberte referenční měření z knihovny.':'Doplňte naměřenou hodnotu SNR.');
  try{
   requireNumbers(['cr_thickness','cr_voltage']);
   const maxU=['aluminum','titanium'].includes(input.material)?500:1000;
   text('cr_voltage-hint',`Podporovaná tabulka: více než 0 až ${number(maxU)} kV.`);
   byId('cr_voltage-hint').classList.remove('sr-only');byId('cr_voltage-hint').classList.add('input-hint');
   if(input.voltage>maxU)failField('cr_voltage',`Pro tento materiál zadejte nejvýše ${number(maxU)} kV.`);
   let r;try{r=snrTarget(input);}catch(error){if(input.cp1)text('cr_cp1_error',error.message);throw error;}
   text('cr_target_snr','≥ '+number(r.target));text('cr_estimate_target',`Cíl SNR_N ≥ ${number(r.target)}`);
   text('cr_target_explanation',`Tabulka ${r.table} · základ ${r.base} × místo měření ${number(r.roiFactor)}${input.cp1?' × CP I 0,8':''}`);
   text('cr_result_context',`${MATERIALS[input.material]} ${number(input.thickness)} mm · ${number(input.voltage)} kV · třída ${input.qualityClass}`);
   if(!estimate&&val('cr_achieved_snr').trim()){
    try{requireNumbers(['cr_achieved_snr',...(input.kind==='raw'?['cr_srb','cr_magnification']:[])]);
     const actual=normalizedSnr(input),passes=actual>=r.target;
     setStatus('cr_validation_message',`SNR_N ${number(actual)} ${passes?'splňuje':'nesplňuje'} požadavek ${number(r.target)}.`,passes?'pass':'fail');
     byId('cr_result_focus').dataset.state=passes?'pass':'fail';text('cr_result_kind',passes?'Kritérium SNR_N splněno':'SNR_N pod požadavkem');text('cr_next_step','');
    }catch(error){setStatus('cr_validation_message',error.message);text('cr_next_step',error.message);}
   }else if(!estimate&&staleMeasurement){text('cr_next_step',staleMeasurement);text('cr_result_kind','Je potřeba nové měření');}
   if(estimate&&reference){
    try{
     const differences=referenceDifferences(input);
     if(differences.length){byId('cr_reference_error').innerHTML='<strong>Reference neodpovídá zadání</strong><ul>'+differences.map(key=>`<li><strong>${esc(referenceLabels[key][0])}:</strong> reference ${esc(displayCondition(key,reference[key]))}, zadání ${esc(displayCondition(key,input[key]))}.</li>`).join('')+'</ul><p>Zvolte odpovídající referenci nebo proveďte nové měření.</p>';text('cr_next_step','Podmínky se liší od reference. Podrobnosti jsou uvedeny níže.');byId('cr_result_focus').dataset.state='fail';text('cr_result_kind','Reference neodpovídá');}
     else{requireNumbers(['cr_fdd']);const exposure=predictCrExposure(reference,input,r.target);text('cr_suggested_exposure','≈ '+number(exposure)+' mA·min');byId('cr_result_focus').dataset.state='estimate';text('cr_next_step','');requireNumbers(['cr_current']);text('cr_suggested_time','≈ '+formatDuration(exposure/input.current));}
    }catch(error){markError('cr_reference_error',error);text('cr_next_step',error.message);}
   }
  }catch(error){if(!error.missing)markError('cr_error',error);setStatus('cr_validation_message','Kritérium nelze vyhodnotit.');resultState('cr',error.missing?'neutral':'fail','Doplňte podmínky','',error.message);}
  updateMobile();
 }
 const temporaryRecords=new Map();let libraryAvailable=false,libraryRevision=0;
 const library=w.indexedDB?createCrLibrary({indexedDB:w.indexedDB,channel:w.BroadcastChannel?new w.BroadcastChannel('rt-cr-library-v1'):null,onChange:()=>{if(libraryAvailable)refreshLibrary().catch(libraryFailure);}}):null;
 function libraryFailure(){const note=d.querySelector('.save-note');if(note){note.textContent='CR knihovnu se nepodařilo trvale uložit. Stáhněte zálohu; dočasná měření zůstanou jen do obnovení stránky.';note.dataset.state='error';}}
 async function refreshLibrary(){const revision=++libraryRevision,snapshot=await library.snapshot();if(destroyed||revision!==libraryRevision)return;records=[...temporaryRecords.values(),...snapshot.measurements.filter(r=>!temporaryRecords.has(r.id))];legacy=snapshot.legacy;deletedLegacy.clear();renderLibrary();renderCR();}
 const libraryReady=library?library.init({measurements:records,legacy:legacy.filter(r=>!deletedLegacy.has(String(r.id)))},{hiddenLegacy:[...deletedLegacy]}).then(async()=>{if(destroyed)return;libraryAvailable=true;await refreshLibrary();if(!reference&&saved?.referenceId){reference=records.find(r=>r.id===saved.referenceId)||null;renderCR();renderLibrary();}}).catch(libraryFailure):Promise.resolve();
 on(w,'focus',()=>{if(libraryAvailable)refreshLibrary().catch(libraryFailure);});
 on(w,'storage',event=>{if(libraryAvailable&&['rt_measurements_v2','cr_techniques_library'].includes(event.key)){const incoming={measurements:list(parse('rt_measurements_v2',[])).filter(isMeasurement).map(r=>({...createCrMeasurement(r),id:r.id})),legacy:list(parse('cr_techniques_library',[])).filter(r=>r&&typeof r.name==='string'&&Number.isFinite(r.id)&&Number.isFinite(r.thickness))};library.merge(incoming,{migration:true}).catch(libraryFailure);}});
 function renderLibrary(){
  const container=byId('cr_library_container');const opened=new Set([...container.querySelectorAll('details[open]')].map(el=>el.closest('[data-record]')?.dataset.record));
  const modern=records.map(r=>`<article class="record-row" data-record="${esc(r.id)}" data-active="${reference?.id===r.id}"><div class="record-overview"><div><h4>${esc(r.name)}</h4><p>${esc(MATERIALS[r.material])} ${number(r.thickness)} mm · ${number(r.voltage)} kV · ${esc(new Date(r.measuredAt).toLocaleDateString('cs-CZ'))}</p></div>${reference?.id===r.id?'<span class="active-reference">Aktivní reference</span>':''}</div><div class="record-metrics"><span>${number(r.exposure)} mA·min</span><span class="measurement-status" data-state="${r.snrPass?'pass':'fail'}">SNR_N ${number(r.achievedSnr)} / ${number(r.target)} · ${r.snrPass?'kritérium splněno':'zkušební měření pod cílem'}</span></div><details ${opened.has(r.id)?'open':''}><summary>Podrobnosti měření</summary><dl>${[['Sestava',r.setup],['Filtrace / fólie',r.screens],['Skener',r.scan],['FDD',number(r.fdd)+' mm'],['Proud a čas',number(r.current)+' mA · '+number(r.seconds)+' s'],['SR_b / zvětšení',number(r.srb)+' mm · '+number(r.magnification)+'×'],['Prodleva',number(r.delay)+' min'],['Místo SNR',displayCondition('roi',r.roi)],['Zarovnání svaru',r.flush?'Ano':'Ne'],['Třída / kompenzace',r.qualityClass+(r.cp1?' · CP I':' · bez CP I')]].map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></details><div class="record-actions"><button type="button" class="secondary-button" data-action="reference" data-id="${esc(r.id)}">${reference?.id===r.id?'Použít aktivní referenci':'Použít jako referenci'}</button><button type="button" class="text-button" data-action="load" data-id="${esc(r.id)}">Načíst měření</button><button type="button" class="text-button delete-button" data-action="delete" data-id="${esc(r.id)}">Smazat</button></div></article>`);
  const old=legacy.filter(r=>!deletedLegacy.has(String(r.id))).map(r=>`<article class="record-row legacy-record"><div class="record-overview"><h4>${esc(r.name.slice(0,160))}</h4><span class="legacy-badge">Starý neověřený odhad</span></div><p>${number(r.thickness)} mm · Původní záznam nedokládá skutečné parametry měření. Nelze jej použít jako referenci.</p><button type="button" class="text-button delete-button" data-action="delete-legacy" data-id="${esc(r.id)}">Smazat starý záznam</button></article>`);
  text('cr_library_count',`${records.length} měření${old.length?' · '+old.length+' starých odhadů':''}`);
  container.innerHTML=[...modern,...old].join('')||'<div class="empty-library"><strong>Zatím nemáte uložené měření</strong><p>Reference vyžaduje skutečnou expozici a naměřené SNR.</p><button type="button" class="secondary-button" data-action="new">Zapsat první měření</button></div>';
 }
 const crMap={material:'cr_material',thickness:'cr_thickness',fdd:'cr_fdd',voltage:'cr_voltage',qualityClass:'cr_class',roi:'cr_roi',flush:'cr_flush',cp1:'cr_cp1',iqiConfirmed:'cr_iqi',kind:'cr_snr_kind',measured:'cr_achieved_snr',srb:'cr_srb',magnification:'cr_magnification',current:'cr_current',seconds:'cr_seconds',name:'cr_technique_name',setup:'cr_setup',screens:'cr_screens',scan:'cr_scan',delay:'cr_delay',measuredAt:'cr_measured_at'};
 function loadRecord(record,mode){for(const [key,id]of Object.entries(crMap)){const el=byId(id);if(el.type==='checkbox')el.checked=!!record[key];else el.value=record[key]??'';}staleMeasurement='';changeCrTask(mode);renderLibrary();focusField(mode==='estimate'?'cr_fdd':'cr_setup');}
 on(byId('cr_save_button'),'click',async()=>{
  if(val('cr_task')!=='record')return;
  text('cr_save_error','');
  try{
   const numeric=['cr_thickness','cr_voltage','cr_fdd','cr_current','cr_seconds','cr_srb','cr_magnification','cr_delay','cr_achieved_snr'];const strings=['cr_setup','cr_screens','cr_scan','cr_technique_name','cr_measured_at'];[...numeric,...strings].forEach(id=>touched.add(id));requireNumbers(numeric);requireText(strings);
   if(val('cr_technique_name').trim().length>120)failField('cr_technique_name','Použijte název do 120 znaků.');
   const record=createCrMeasurement(crInput());record.id=w.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(16).slice(2)}`;
   temporaryRecords.set(record.id,record);records.unshift(record);renderLibrary();renderCR();byId('cr_save_button').disabled=true;
   await libraryReady;let durable=false;
   try{if(!libraryAvailable)throw new Error();await library.add(record);temporaryRecords.delete(record.id);await refreshLibrary();durable=true;}catch{libraryFailure();}
   if(destroyed)return;byId('cr_save_error').dataset.state=durable?'info':'fail';text('cr_save_error',!durable?'Měření je uložené pouze dočasně v této otevřené stránce. Stáhněte zálohu.':`Měření uloženo. ${record.snrPass?'Kritérium SNR_N splněno.':'SNR_N je pod cílem; záznam slouží jako zkušební reference.'}`);saveInputs();
  }catch(error){if(destroyed)return;byId('cr_save_error').dataset.state='fail';markError('cr_save_error',error);focusField(error.field||'cr_cp1');}
  finally{if(!destroyed)byId('cr_save_button').disabled=false;}
 });
 on(byId('cr_library_container'),'click',event=>{
  const button=event.target.closest('button[data-action]');if(!button)return;
  const {action,id}=button.dataset,record=records.find(r=>r.id===id);
  if(action==='new'){changeCrTask('record');focusField('cr_setup');}
  else if(action==='load'&&record){reference=null;loadRecord(record,'record');}
  else if(action==='reference'&&record){reference=record;loadRecord(record,'estimate');}
  else if(action==='delete'||action==='delete-legacy'){
   text('modal-title','Smazat záznam měření?');text('modal-message','Záznam bude odstraněn z knihovny tohoto prohlížeče.');
   openDialog('modal-container');confirmAction=async()=>{
    try{await libraryReady;if(!libraryAvailable)throw new Error('Smazání nelze trvale uložit. Povolte úložiště a zkuste to znovu.');await library.remove(action==='delete'?'measurement':'legacy',id);temporaryRecords.delete(id);if(reference?.id===id)reference=null;await refreshLibrary();saveInputs();}
    catch(error){byId('cr_save_error').dataset.state='fail';text('cr_save_error',error.message);}
    byId('cr_library_title').focus();
   };
  }
 });
 on(byId('cr_clear_reference'),'click',()=>{reference=null;renderCR();renderLibrary();saveInputs();byId('cr_choose_reference').focus();});
 on(byId('cr_choose_reference'),'click',()=>{byId('cr_library_title').focus();byId('cr_library_section').scrollIntoView?.({block:'start',behavior:scrollBehavior()});});
 const physicalCR=new Set(['cr_material','cr_thickness','cr_fdd','cr_voltage']);
 const measurementCR=new Set(['cr_snr_kind','cr_srb','cr_magnification','cr_roi','cr_flush','cr_current','cr_seconds','cr_setup','cr_screens','cr_scan','cr_delay']);
 function highlightGeometry(id){const module=id.startsWith('n_')?'n':id.startsWith('ug_')?'ug':null;if(!module)return;const svg=byId(module+'_geometry_diagram').querySelector('svg');if(svg)svg.dataset.highlight=id.includes('thickness')?'thickness':id.includes('diameter')?'diameter':id.includes('gap')?'gap':id==='ug_focus'?'focus':'distance';}
 on(byId('tab-content'),'focusin',event=>{if(event.target.matches('input,select')){d.body.classList.add('field-focused');highlightGeometry(event.target.id);}});
 on(byId('tab-content'),'focusout',event=>{const el=event.target;if(!el.matches('input,select'))return;touched.add(el.id);if(el.id.startsWith('n_'))renderN();else if(el.id.startsWith('ug_'))renderUg();else if(el.id.startsWith('cr_'))renderCR();else renderTime();if(el.matches('[data-number]')&&!byId(el.id+'-error')?.textContent){try{requireNumbers([el.id]);}catch{}}w.setTimeout(()=>{d.body.classList.toggle('field-focused',!!d.activeElement?.matches('#tab-content input,#tab-content select'));},0);});
 on(byId('tab-content'),'input',event=>{
  const el=event.target;if(!el.matches('input,select'))return;
  fieldError(el.id,'');
  if(el.id==='n_technique')byId('n_distance').value='';
  if(el.id.startsWith('n_'))renderN();
  else if(el.id.startsWith('ug_'))renderUg();
  else if(el.id.startsWith('cr_')){
   if((physicalCR.has(el.id)||measurementCR.has(el.id))&&val('cr_achieved_snr').trim())staleMeasurement=`Změněno: ${label(el.id)}. Předchozí SNR už neplatí; zadejte nové měření.`;
   if(physicalCR.has(el.id)){byId('cr_achieved_snr').value='';byId('cr_seconds').value='';byId('cr_iqi').checked=false;}
   else if(measurementCR.has(el.id)){byId('cr_achieved_snr').value='';byId('cr_iqi').checked=false;}
   if(el.id==='cr_achieved_snr'&&val(el.id).trim())staleMeasurement='';
   if(el.id==='cr_task')byId('cr_setup_details').open=val('cr_task')==='record';
   text('cr_save_error','');renderCR();
  }else{if(el.id==='xray_mode')byId('xray_reference_fields').open=val('xray_mode')==='manual';renderTime();}
  highlightGeometry(el.id);
  saveInputs();
 });
 // Native selects also emit change; keeping it idempotent supports keyboard and
 // programmatic change without invalidating a measurement twice.
 on(byId('source_type'),'change',()=>{renderTime();saveInputs();});
 byId('cr_setup_details').open=val('cr_task')==='record';byId('xray_reference_fields').open=val('xray_mode')==='manual';
 byId('cr_cp1').setAttribute('aria-describedby','cr_cp1_error');byId('cr_iqi').setAttribute('aria-describedby','cr_cp1_error');
 renderN();renderUg();renderTime();renderCR();renderLibrary();updateMobile();
 text('calculation-version',`Výpočty aktualizovány 6. 9. 2026 · ${CALCULATION_VERSION}`);
 function captureCalculation(){
  const kind=activeTab==='exposures'?'n':activeTab==='unsharpness'?'ug':activeTab==='time'?val('source_type')==='gamma'?'gamma':'xray':'cr_'+val('cr_task');
  let inputs;
  if(kind==='n')inputs={technique:val('n_technique'),qualityClass:val('n_testingClass'),thickness:n('n_thickness'),diameter:n('n_diameter'),distance:n('n_distance')};
  else if(kind==='ug')inputs={technique:val('ug_technique'),qualityClass:val('ug_class'),thickness:n('ug_thickness'),diameter:n('ug_diameter'),gap:n('ug_gap'),sourceDistance:n('ug_source_distance'),focus:n('ug_focus'),planar:checked('ug_planar')};
  else if(kind==='xray')inputs={mode:val('xray_mode'),material:val('xray_material'),film:val('xray_film'),voltage:n('xray_voltage'),thickness:n('t_thickness_xray'),distance:n('t_distance_xray'),current:n('xray_current'),exposure:n('xray_factor'),referenceDistance:n('xray_reference_distance'),referenceName:val('xray_reference_name')};
  else if(kind==='gamma')inputs={activity:n('t_activity'),referenceTime:val('t_activity_date')?new Date(val('t_activity_date')).toISOString():'',exposureTime:val('t_exposure_date')?new Date(val('t_exposure_date')).toISOString():'',thickness:n('t_thickness_gamma'),distance:n('t_distance_gamma'),film:val('t_film')};
  else inputs=crInput();
  const root=byId(kind==='n'?'exposures':kind==='ug'?'unsharpness':kind==='xray'?'xray_calculator':kind==='gamma'?'gamma_calculator':'digital_radiography');
  const form=Object.fromEntries([...root.querySelectorAll('input,select')].map(el=>[el.id,el.type==='checkbox'?el.checked:el.value]));
  const context={kind,inputs,form,...(kind==='xray'?{manualConfirmed:manualSignature===xraySignature()}:{ }),...(kind==='cr_estimate'?{reference:reference?clone(reference):null}:{})};
  evaluate(context);return clone(context);
 }
 function applyForm(values,{restore=false}={}){
  const changed=[];
  for(const [id,value]of Object.entries(values)) {const el=inputElements.find(el=>el.id===id);if(!el)continue;if(el.tagName==='SELECT'&&![...el.options].some(o=>o.value===String(value)))continue;const old=el.type==='checkbox'?el.checked:el.value;if(old!==(el.type==='checkbox'?!!value:String(value)))changed.push(id);if(el.type==='checkbox')el.checked=!!value;else el.value=value??'';fieldError(id,'');}
  if(!restore&&changed.some(id=>physicalCR.has(id)||measurementCR.has(id))){if(val('cr_achieved_snr').trim())staleMeasurement='Změněna společná geometrie. Předchozí SNR už neplatí; zadejte nové měření.';byId('cr_achieved_snr').value='';byId('cr_seconds').value='';byId('cr_iqi').checked=false;}
  renderN();renderUg();renderTime();renderCR();saveInputs();
 }
 function restoreCalculation(context,{preserveCalibration=false}={}){
  assertContext(context);evaluate(context);
  const values=canonicalForm(context,{localTime:true});
  if(['xray','gamma'].includes(context.kind))values.source_type=context.kind==='gamma'?'gamma':'xray';
  if(context.kind.startsWith('cr_')){values.cr_task=context.kind.slice(3);reference=context.reference&&isMeasurement(context.reference)?clone(context.reference):null;staleMeasurement='';}
  // Reopened manual calibration must be explicitly re-confirmed for a new use.
  if(context.kind==='xray')manualSignature=null;
  applyForm(values,{restore:true});
  if(preserveCalibration&&context.kind==='xray'&&context.manualConfirmed){manualSignature=xraySignature();renderTime();}
  renderLibrary();
  tab(context.kind==='n'?'exposures':context.kind==='ug'?'unsharpness':context.kind.startsWith('cr_')?'digital_radiography':'time');
  saveInputs();
 }
 async function exportLibrary(){await libraryReady;if(libraryAvailable){const snapshot=await library.snapshot();return clone({measurements:[...temporaryRecords.values(),...snapshot.measurements.filter(r=>!temporaryRecords.has(r.id))],legacy:snapshot.legacy});}return clone({measurements:records,legacy:legacy.filter(r=>!deletedLegacy.has(String(r.id)))});}
 async function restoreLibrary(incoming){
  await libraryReady;if(!libraryAvailable)throw new Error('CR úložiště není dostupné.');
  await library.merge(incoming);for(const record of incoming.measurements)temporaryRecords.delete(record.id);await refreshLibrary();
 }
 const destroy=()=>{destroyed=true;chart?.destroy();library?.close();abort.abort();};on(w,'pagehide',event=>{if(!event.persisted)destroy();});
 return {libraryReady,exportLibrary,restoreLibrary,destroy,renderN,renderUg,renderTime,renderCR,records:()=>records,tab,captureCalculation,restoreCalculation,applyForm};
}
