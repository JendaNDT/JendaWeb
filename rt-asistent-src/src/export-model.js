import { KINDS, evaluate, clone } from './workflow-model.js';
import { CALCULATION_VERSION, MATERIALS, SOURCES } from './calculations.js';
import { entryShape, validEntry } from './entry-validation.js';

export const IDENTIFIERS = [['jobName','Zakázka'],['part','Díl'],['drawingNumber','Číslo výkresu'],['batch','Běžné číslo'],['weld','Číslo svaru']];
const fields = {
 technique:['Technika',''],qualityClass:['Třída zkoušení',''],thickness:['Tloušťka','mm'],diameter:['Vnější průměr De','mm'],distance:['Vzdálenost zdroj–film SFD','mm'],sourceDistance:['Zdroj–první povrch','mm'],gap:['Mezera předmět–film','mm'],focus:['Velikost zdroje / ohniska','mm'],planar:['Planární vady',''],mode:['Zdroj reference',''],material:['Materiál',''],film:['Film',''],voltage:['Napětí','kV'],current:['Proud','mA'],exposure:['Referenční expozice','mA·min'],referenceDistance:['Referenční SFD','mm'],referenceName:['Vlastní reference',''],activity:['Referenční aktivita','GBq'],referenceTime:['Datum referenční aktivity',''],exposureTime:['Datum expozice',''],fdd:['Vzdálenost zdroj–detektor FDD','mm'],roi:['Místo měření SNR',''],flush:['Zarovnaný svar',''],cp1:['Kompenzace CP I',''],iqiConfirmed:['Potvrzené IQI',''],kind:['Druh SNR',''],measured:['Naměřené SNR',''],srb:['Základní prostorové rozlišení SR_b','mm'],magnification:['Zvětšení',''],seconds:['Skutečný čas','s'],name:['Název měření',''],setup:['Sestava',''],screens:['Fólie / filtrace',''],scan:['Skener',''],delay:['Prodleva','min'],measuredAt:['Datum měření',''],achievedSnr:['Dosažené SNR_N',''],target:['Cílové SNR_N',''],snrPass:['Kritérium SNR_N splněno',''],schema:['Verze dat reference',''],calculationVersion:['Model reference',''],id:['ID reference',''],version:['Verze reference','']
};
const resultFields = {count:['Počet expozic',''],nominal:['Nominální odečet',''],nearBoundary:['Bod u hranice oblastí',''],x:['t/De',''],y:['De / vzdálenost',''],outside:['Zdroj vně, film uvnitř',''],yMax:['Horní mez osy y',''],figure:['Obrázek nomogramu',''],maxCount:['Maximum v nomogramu',''],centered:['Zdroj ve středu',''],ug:['Geometrická neostrost Ug','mm'],f:['Hodnocená vzdálenost f','mm'],b:['Vzdálenost b','mm'],minF:['Minimální f','mm'],minInputDistance:['Minimální vzdálenost k prvnímu povrchu','mm'],coefficient:['Koeficient minimální vzdálenosti',''],passes:['Posuzované kritérium splněno',''],minutes:['Expoziční čas','min'],exposure:['Expozice','mA·min'],currentActivity:['Aktivita při expozici','GBq'],ciHours:['Referenční součin aktivity a času','Ci·h'],gbqHours:['Referenční součin aktivity a času','GBq·h'],actual:['Dosažené SNR_N',''],target:['Cílové SNR_N','']};
const values={outside:'Jedna stěna, zdroj vně',inside:'Jedna stěna, zdroj uvnitř',single:'Jedna stěna',double:'Dvě stěny, DWSI',dwsi:'DWSI',dwdi:'DWDI',chart:'Výrobní diagram',manual:'Vlastní reference',weld:'Svar',haz:'HAZ / základní materiál',raw:'SNR',normalized:'SNR_N',...MATERIALS};
export const displayValue = value => value === null || value === undefined || value === '' ? '—' : typeof value === 'boolean' ? value ? 'Ano' : 'Ne' : typeof value === 'number' ? value.toLocaleString('cs-CZ',{maximumSignificantDigits:7}) : String(value);
export const displayDate = date => new Date(date).toLocaleString('cs-CZ',{timeZone:'Europe/Prague'});
export const xml = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function fieldLabel(key,kind,inputs={},result=false){
 const [label,unit]=(result?resultFields:fields)[key]||[key,''];
 if(!result&&key==='thickness')return [(kind==='n'||kind==='ug')?'Tloušťka jedné stěny t':'Prozářená tloušťka w',unit];
 if(!result&&key==='distance'&&kind==='n'&&inputs.technique==='outside')return ['Vzdálenost zdroj–předmět f',unit];
 if(!result&&key==='exposure'&&kind==='reference')return ['Naměřená expozice',unit];
 return [label,unit];
}
export function valueRows(object,kind,{result=false,inputs={}}={}){
 return Object.entries(object||{}).filter(([,v])=>v!==undefined&&v!==null&&v!==''&&['number','string','boolean'].includes(typeof v)).map(([key,value])=>{
  const [label,unit]=fieldLabel(key,kind,inputs,result);
  const translated=!result&&['technique','mode','material','roi','kind'].includes(key)?values[value]??value:value;
  return {key,label,unit,value:translated};
 });
}
export function inputRows(record){
 const {kind,inputs}=record.context;
 let rows=valueRows(inputs,kind,{inputs});
 if(record.unverified)return rows;
 if(kind==='cr_estimate')rows=rows.filter(r=>['material','thickness','voltage','qualityClass','roi','flush','cp1','iqiConfirmed','fdd','current','setup','screens','scan','delay','srb','magnification'].includes(r.key));
 if(kind==='cr_check')rows=rows.filter(r=>['material','thickness','voltage','qualityClass','roi','flush','cp1','iqiConfirmed','kind','measured','srb','magnification'].includes(r.key));
 if(kind==='xray'&&inputs.mode==='chart')rows=rows.filter(r=>!['exposure','referenceName'].includes(r.key));
 if(kind==='ug'&&inputs.technique==='single')rows=rows.filter(r=>r.key!=='diameter');
 return rows;
}
export function statusText(record){
 const s=record.result.status,k=record.context.kind;
 if(record.unverified)return 'Historický záznam – soulad s podporovaným modelem nelze ověřit';
 if(k==='ug')return s==='pass'?'Kritérium minimální vzdálenosti splněno':'Kritérium minimální vzdálenosti nesplněno';
 if(k==='cr_check'||k==='cr_record')return s==='pass'?'Kritérium SNR_N splněno':'Kritérium SNR_N nesplněno';
 return {limit:'Mimo rozsah odečtu',estimate:'Odhad / odečet',info:'Výpočet'}[s]||'Uložený výsledek';
}
export function recordSources(record){
 if(record.unverified)return [];
 const kind=record.context.kind;
 if(kind==='n'||kind==='ug')return [['ISO 17636-1 – podklad modelu',SOURCES.iso1]];
 if(kind==='gamma')return [['Výrobní expoziční diagram',SOURCES.film],['Rozpad Ir-192',SOURCES.decay]];
 if(kind==='xray')return record.context.inputs.mode==='chart'?[['Výrobní expoziční diagram',SOURCES.film]]:[['Vlastní reference',record.context.inputs.referenceName||'']];
 return [['ISO 17636-2 – podklad modelu',SOURCES.iso2],['CR metodika',SOURCES.cr]];
}
export function currentExport(context,metadata,{now=new Date().toISOString()}={}){
 const result=evaluate(context);
 return clone({...metadata,id:'current',kind:'calculation',createdAt:now,modelVersion:CALCULATION_VERSION,context,result,current:true});
}
// Historical results and reference snapshots are copied verbatim. Validation
// only supplies a warning; it never substitutes a freshly evaluated result.
export function snapshotRecords(records,jobs=[]){
 const names=new Map(jobs.filter(j=>j.kind==='job').map(j=>[j.id,j.name]));
 return records.map(record=>{
  if(!record.current&&!entryShape(record))throw new Error('Záznam má nečitelný formát. Uchovejte úplnou zálohu JSON.');
  return clone({...record,jobName:record.jobName??names.get(record.jobId)??'',unverified:record.current?false:!validEntry(record)});
 });
}
export function makeReport(records,options={}){
 if(!records.length)throw new Error('Vyberte alespoň jeden výpočet.');
 return {records:clone(records),exportedAt:new Date().toISOString(),title:records.length===1?'Výpočtový list RT':'Přehled výpočtů RT',technician:String(options.technician||'').trim().slice(0,120),note:String(options.note||'').trim().slice(0,2000),details:options.details!==false,nomogram:options.nomogram!==false,geometry:!!options.geometry,logo:options.logo||null};
}
export function exportFilename(report,extension){
 const sameJob=report.records.every(r=>r.jobName===report.records[0].jobName),label=sameJob&&report.records[0].jobName||'vyber';
 const slug=label.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'vypocty';
 return `RT-${slug}-${report.exportedAt.slice(0,10)}.${extension}`;
}
export { KINDS };
