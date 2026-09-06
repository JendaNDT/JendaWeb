export const CR_FIELDS={material:'cr_material',thickness:'cr_thickness',fdd:'cr_fdd',voltage:'cr_voltage',qualityClass:'cr_class',roi:'cr_roi',flush:'cr_flush',cp1:'cr_cp1',iqiConfirmed:'cr_iqi',kind:'cr_snr_kind',measured:'cr_achieved_snr',srb:'cr_srb',magnification:'cr_magnification',current:'cr_current',seconds:'cr_seconds',name:'cr_technique_name',setup:'cr_setup',screens:'cr_screens',scan:'cr_scan',delay:'cr_delay',measuredAt:'cr_measured_at'};
export const CONTEXT_FIELDS={
 n:{technique:'n_technique',qualityClass:'n_testingClass',thickness:'n_thickness',diameter:'n_diameter',distance:'n_distance'},
 ug:{technique:'ug_technique',qualityClass:'ug_class',thickness:'ug_thickness',diameter:'ug_diameter',gap:'ug_gap',sourceDistance:'ug_source_distance',focus:'ug_focus',planar:'ug_planar'},
 xray:{mode:'xray_mode',material:'xray_material',film:'xray_film',voltage:'xray_voltage',thickness:'t_thickness_xray',distance:'t_distance_xray',current:'xray_current',exposure:'xray_factor',referenceDistance:'xray_reference_distance',referenceName:'xray_reference_name'},
 gamma:{activity:'t_activity',referenceTime:'t_activity_date',exposureTime:'t_exposure_date',thickness:'t_thickness_gamma',distance:'t_distance_gamma',film:'t_film'},
 cr_check:CR_FIELDS,cr_record:CR_FIELDS,cr_estimate:CR_FIELDS,
};
const booleans=new Set(['planar','flush','cp1','iqiConfirmed']);
const numbers=new Set(['thickness','diameter','distance','gap','sourceDistance','focus','voltage','current','exposure','referenceDistance','activity','fdd','measured','srb','magnification','seconds','delay']);
const parseNumber=x=>/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(String(x).trim().replace(',','.'))?Number(String(x).trim().replace(',','.')):NaN;
const own=(o,k)=>Object.hasOwn(o,k);
export function assertContext(context,{partialForm=false}={}){
 const {kind,inputs:i,form}=context||{},fields=CONTEXT_FIELDS[kind];
 if(!fields||!i||typeof i!=='object'||Array.isArray(i)||!form||typeof form!=='object'||Array.isArray(form))throw new Error('Neplatný formát uložených vstupů.');
 const core=kind==='n'?['technique','qualityClass','thickness','diameter','distance']:kind==='ug'?['technique','qualityClass','thickness','focus','sourceDistance']:kind==='gamma'?Object.keys(fields):kind==='xray'?['mode','material','film','voltage','thickness','distance','current','referenceDistance',...(i.mode==='manual'?['exposure','referenceDistance','referenceName']:[])]:['material','thickness','voltage','qualityClass','roi',...(kind==='cr_estimate'?['fdd','current','setup','screens','scan','delay','srb','magnification']:['kind','measured',...(i.kind==='raw'?['srb','magnification']:[])]),...(kind==='cr_record'?['name','setup','screens','scan','current','seconds','fdd','srb','magnification','delay','measuredAt']:[])];
 if(kind==='ug'&&i.technique!=='single')core.push('diameter');
 if(core.some(k=>!own(i,k)||i[k]===null||i[k]===''||!partialForm&&!own(form,fields[k])))throw new Error('V historii chybí povinné vstupy výpočtu.');
 for(const [key,value]of Object.entries(i)){
  if(!own(fields,key))throw new Error('Historie obsahuje neznámý vstup.');
  if(value!==null&&(numbers.has(key)?typeof value!=='number'||!Number.isFinite(value):booleans.has(key)?typeof value!=='boolean':typeof value!=='string'||value.length>1000))throw new Error('Neplatný typ uloženého vstupu.');
  const field=fields[key];if(!own(form,field))continue;
  // Old gamma forms store local wall time without an offset. ISO instants in
  // inputs are authoritative; replay always derives local time from them.
  if(kind==='gamma'&&['referenceTime','exposureTime'].includes(key)){if(!Number.isFinite(Date.parse(value))||!/(?:Z|[+-]\d{2}:\d{2})$/.test(value)||typeof form[field]!=='string')throw new Error('Neplatný čas v historii.');continue;}
  const consistent=value===null?typeof form[field]==='string'&&form[field].trim()==='':numbers.has(key)?parseNumber(form[field])===value:booleans.has(key)?form[field]===value:typeof form[field]==='string'&&form[field].trim()===value.trim();
  if(!consistent)throw new Error('Uložené vstupy a formulář si odporují. Obnova byla zastavena.');
 }
 if(kind==='xray'&&i.mode==='chart'&&i.referenceDistance!==1000)throw new Error('Výrobní diagram používá referenční SFD 1000 mm.');
 if(kind==='xray'&&i.mode==='manual'&&(!i.referenceName?.trim()||context.manualConfirmed!==true))throw new Error('Chybí potvrzená vlastní reference.');
 return context;
}
export function canonicalForm(context,{localTime=false}={}){
 const {kind,inputs}=context,fields=CONTEXT_FIELDS[kind];if(!fields)throw new Error('Nepodporovaný výpočet.');
 const result={};for(const [key,id]of Object.entries(fields)){let value=inputs[key];if(kind==='ug'&&key==='gap'&&value===undefined)value=0;if(booleans.has(key))value=!!value;else if(localTime&&kind==='gamma'&&['referenceTime','exposureTime'].includes(key)){const t=new Date(value);value=new Date(t-t.getTimezoneOffset()*60000).toISOString().slice(0,16);}else value=value==null?'':String(value);result[id]=value;}
 if(kind.startsWith('cr_'))result.cr_task=kind.slice(3);
 if(['xray','gamma'].includes(kind))result.source_type=kind;
 return result;
}
