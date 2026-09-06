import { exposureCount, unsharpness, gammaTime, xrayChartExposure, xrayTime, snrTarget, normalizedSnr, predictCrExposure, createCrMeasurement, positive, formatDuration, MATERIALS, CALCULATION_VERSION } from './calculations.js';
import { assertContext, canonicalForm } from './context-schema.js';

export const KINDS={n:'Počet expozic',ug:'Neostrost',xray:'Čas filmu · RTG',gamma:'Čas filmu · Ir-192',cr_check:'Kontrola SNR_N',cr_record:'CR měření',cr_estimate:'Odhad času CR'};
export const num=x=>typeof x==='number'?x:/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(String(x).trim().replace(',','.'))?Number(String(x).trim().replace(',','.')):NaN;
export const fmt=x=>Number.isFinite(x)?x.toLocaleString('cs-CZ',{maximumSignificantDigits:4}):'—';
export const clone=x=>JSON.parse(JSON.stringify(x));
export function evaluate(context,{modelVersion=CALCULATION_VERSION}={}) {
 const {kind,inputs:i}=context;
 let values,summary,status='info';
 if(kind==='n') {const {lines,...r}=exposureCount(i);values=r;summary=r.count===null?`Více než ${r.maxCount} expozic`:`${r.count} expozic`;status=r.count===null?'limit':'estimate';}
 else if(kind==='ug'){values=unsharpness(i);summary=`Ug ${fmt(values.ug)} mm`;status=values.passes?'pass':'fail';}
 else if(kind==='xray'){
  let exposure;
  if(i.mode==='chart'){if(i.material!=='steel')throw new Error('Výrobní diagram je pouze pro ocel.');exposure=xrayChartExposure(i.film,i.thickness,i.voltage);}
  else if(i.mode==='manual') {if(!context.manualConfirmed)throw new Error('Potvrďte vlastní referenční E v kalkulátoru.');exposure=i.exposure;}
  else throw new Error('Zvolte zdroj referenční expozice.');
  const minutes=xrayTime({...i,exposure});values={minutes,exposure:minutes*i.current};summary=(i.mode==='chart'?'≈ ':'')+formatDuration(minutes);status=i.mode==='chart'?'estimate':'info';
 }
 else if(kind==='gamma'){values=gammaTime(i,{historical:modelVersion==='2026-09-05.2'});summary='≈ '+formatDuration(values.minutes);status='estimate';}
 else if(kind?.startsWith('cr_')){
  const target=snrTarget(i).target;
  if(kind==='cr_estimate'){const exposure=predictCrExposure(context.reference,i,target),minutes=exposure/positive(i.current,'Plánovaný proud');positive(minutes);values={exposure,minutes,target};summary='≈ '+formatDuration(minutes);status='estimate';}
  else {if(kind==='cr_record')createCrMeasurement(i);const actual=normalizedSnr(i);values={actual,target,passes:actual>=target};summary=`SNR_N ${fmt(actual)} / cíl ${fmt(target)}`;status=values.passes?'pass':'fail';}
 }else throw new Error('Nepodporovaný výpočet.');
 for(const value of Object.values(values))if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Výsledek je mimo číselný rozsah.');
 return {values,summary,status};
}

// The common distance is always source–film. t is one wall; w is the actual
// material path, excluding air. 2t is only the central perpendicular-ray default.
export function sharedGeometry(g) {
 if(!Object.hasOwn(MATERIALS,g.material))throw new Error('Vyberte materiál.');
 if(!['outside','inside','dwsi','dwdi','flat'].includes(g.technique))throw new Error('Vyberte techniku.');
 if(!['A','B'].includes(g.qualityClass))throw new Error('Vyberte třídu.');
 const t=positive(num(g.thickness),'Tloušťka stěny t'),sfd=positive(num(g.sfd),'SFD'),gap=num(g.gap);
 if(!Number.isFinite(gap)||gap<0)throw new Error('Mezera musí být nula nebo kladné číslo.');
 const pipe=g.technique!=='flat',double=['dwsi','dwdi'].includes(g.technique),de=pipe?positive(num(g.diameter),'Průměr De'):null;
 if(pipe&&de<=2*t)throw new Error('Vnější průměr musí být větší než dvě tloušťky stěny.');
 const w=g.pathMode==='manual'?positive(num(g.penetrated),'Skutečná tloušťka w'):t*(double?2:1);
 if(w<t*(double?2:1))throw new Error('Prozářená tloušťka w nesmí být menší než součet stěn v této geometrii.');
 const f=positive(sfd-(double?de:t)-gap,'Vzdálenost zdroj–povrch odvozená ze SFD');
 if(g.technique==='inside'&&(sfd-gap<de/2||sfd-gap>=de-t))throw new Error('Pro zdroj uvnitř musí SFD bez mezery ležet od De/2 do méně než De − t.');
 if(g.technique==='outside'&&gap>=de-2*t)throw new Error('Film má ležet uvnitř dutiny. Zmenšete mezeru.');
 const maps={ug:{ug_technique:double?g.technique:'single',ug_thickness:t,ug_diameter:de??'',ug_gap:gap,ug_source_distance:f,ug_class:g.qualityClass},
 film:{xray_material:g.material,t_thickness_xray:w,t_distance_xray:sfd,...(g.material==='steel'?{t_thickness_gamma:w,t_distance_gamma:sfd}:{})},
 cr:{cr_material:g.material,cr_thickness:w,cr_fdd:sfd,cr_class:g.qualityClass}};
 const skipped=[];
 if(['outside','inside','dwsi'].includes(g.technique)&&gap===0)maps.n={n_technique:g.technique==='dwsi'?'double':g.technique,n_thickness:t,n_diameter:de,n_distance:g.technique==='outside'?f:sfd,n_testingClass:g.qualityClass};
 else skipped.push('Počet expozic: nomogram nepokrývá tuto techniku nebo mezeru u filmu.');
 if(g.material!=='steel')skipped.push('Ir-192: diagram je pouze pro ocel; zadání tohoto kalkulátoru se nepřenáší.');
 return {maps,t,w,sfd,f,skipped,assumption:g.pathMode==='manual'?'w zadáno jako skutečná dráha v materiálu.':`w = ${double?'2t':'t'} pro kolmý centrální paprsek, bez převýšení svaru. Pro šikmý průchod zadejte skutečné w.`};
}

export function variantFields(c){
 if(c.kind==='n')return [{key:'distance',label:c.inputs.technique==='outside'?'Zdroj–povrch f (mm)':'SFD (mm)'}];
 if(c.kind==='ug')return [{key:'sourceDistance',label:'Zdroj–první povrch (mm)'},{key:'focus',label:'Ohnisko (mm)'},{key:'gap',label:'Mezera u filmu (mm)'}];
 if(c.kind==='gamma')return [{key:'distance',label:'SFD (mm)'},{key:'film',label:'Film',options:['D7','D5','D4']}];
 if(c.kind==='xray')return [{key:'distance',label:'SFD (mm)'},{key:'current',label:'Proud (mA)'},...(c.inputs.mode==='chart'?[{key:'film',label:'Film',options:['D7','D5','D4','D3','D2']}]:[])];
 if(c.kind==='cr_estimate')return [{key:'fdd',label:'FDD (mm)'},{key:'current',label:'Proud (mA)'}];
 return [];
}
export function compareVariant(base,changes={}) {
 const c=clone(base),allowed=variantFields(base);
 const formKeys={n:{distance:'n_distance'},ug:{sourceDistance:'ug_source_distance',focus:'ug_focus',gap:'ug_gap'},xray:{distance:'t_distance_xray',current:'xray_current',film:'xray_film'},gamma:{distance:'t_distance_gamma',film:'t_film'},cr_estimate:{fdd:'cr_fdd',current:'cr_current'}};
 for(const [key,value]of Object.entries(changes)) {const f=allowed.find(f=>f.key===key);if(!f)throw new Error('Tuto podmínku nelze v porovnání měnit.');c.inputs[key]=f.options?value:num(value);if(c.form)c.form[formKeys[c.kind][key]]=String(value);}
 const result=evaluate(c),original=evaluate(base),metric=c.kind==='ug'?'ug':c.kind==='n'?'count':'minutes';
 const a=result.values[metric],b=original.values[metric];
 return {context:c,result,delta:Number.isFinite(a)&&Number.isFinite(b)?a-b:null,percent:Number.isFinite(a)&&Number.isFinite(b)&&b>0?(a/b-1)*100:null};
}
export function historyEntry({id,jobId,part,weld,context,createdAt=new Date().toISOString()}) {
 if(!jobId)throw new Error('Vyberte nebo vytvořte zakázku.');
 if(!part?.trim()||!weld?.trim())throw new Error('Doplňte díl a číslo svaru.');
 assertContext(context,{partialForm:true});
 const canonicalContext={...context,form:canonicalForm(context)};
 return clone({id,kind:'calculation',jobId,part:part.trim(),weld:weld.trim(),createdAt,modelVersion:CALCULATION_VERSION,context:canonicalContext,result:evaluate(context)});
}
