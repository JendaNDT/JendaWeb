import { IDENTIFIERS, KINDS, fieldLabel, valueRows, inputRows, statusText, recordSources } from './export-model.js';

const mime='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const cell=value=>({value:value??'',type:value instanceof Date?Date:typeof value==='number'?Number:typeof value==='boolean'?Boolean:String,format:typeof value==='boolean'?undefined:value instanceof Date?'yyyy-mm-dd hh:mm:ss':typeof value==='number'?Math.abs(value)>0&&Math.abs(value)<.000001?'0.000000E+00':'0.########':'@'});
function sheet(name,headers,rows,widths){
 const data=[headers.map(value=>({...cell(value),fontWeight:'bold',textColor:'#ffffff',backgroundColor:'#203651',wrap:true,alignVertical:'center',height:48})),...rows.map((row,i)=>{
  const lines=Math.max(2,...row.map((v,j)=>String(v??'').split('\n').reduce((n,s)=>n+Math.max(1,Math.ceil(s.length/Math.max(8,(widths[j]||22)-3))),0)));
  return row.map(value=>({...cell(value),backgroundColor:i%2?'#f0f4fa':'#ffffff',textColor:'#172437',wrap:true,alignVertical:'top',height:Math.min(409,lines*15+10)}));
 })];
 return {sheet:name,data,columns:headers.map((_,i)=>({width:widths[i]||22})),stickyRowsCount:1,stickyColumnsCount:name==='Informace'?0:2,showGridLines:false,orientation:'landscape',filter:rows.length>0,filterRows:data.length,filterColumns:headers.length};
}
export function workbookSheets(report){
 const headers=[...IDENTIFIERS.map(([,label])=>label),'Druh výpočtu','Datum záznamu (UTC)','Výsledek','Posouzení','Verze modelu','ID záznamu','Původ'];
 const row=r=>[...IDENTIFIERS.map(([key])=>r[key]||''),KINDS[r.context.kind],new Date(r.createdAt),r.result.summary,statusText(r),r.modelVersion,r.id,r.current?'Aktuální zadání – neuloženo':'Uložená historie'];
 const widths=[24,22,24,20,20,26,24,32,46,22,40,30];
 const sheets=[sheet('Přehled',headers,report.records.map(row),widths)];
 const sheetNames={n:'Počet expozic',ug:'Neostrost',xray:'Čas filmu RTG',gamma:'Čas filmu Ir-192',cr_check:'Kontrola SNR',cr_record:'CR měření',cr_estimate:'Odhad času CR'};
 for(const kind of Object.keys(KINDS)){
  const records=report.records.filter(r=>r.context.kind===kind);if(!records.length)continue;
  const columns=[];
  for(const result of [false,true]){
   const keys=new Set(records.flatMap(r=>result?Object.keys(r.result.values):inputRows(r).map(v=>v.key)));
   for(const key of keys){
    const [label,unit]=fieldLabel(key,kind,records[0].context.inputs,result);
    // A mixed-technique sheet must not call every distance f or every distance SFD.
    const heading=kind==='n'&&key==='distance'&&!result?'Vzdálenost f / SFD podle techniky':label;
    columns.push({key,result,label:`${result?'Výsledek':'Vstup'}: ${heading}${unit?' ('+unit+')':''}`});
   }
  }
  const rows=records.map(r=>[...row(r),...columns.map(c=>{
   const object=c.result?r.result.values:r.context.inputs;
   return (c.result?valueRows(object,kind,{result:true}):inputRows(r)).find(v=>v.key===c.key)?.value??'';
  })]);
  sheets.push(sheet(sheetNames[kind],[...headers,...columns.map(c=>c.label)],rows,[...widths,...columns.map(c=>c.label.length>32?30:23)]));
 }
 const references=report.records.flatMap(r=>r.context.reference?valueRows(r.context.reference,'reference').map(v=>[r.id,r.jobName,r.weld,v.label,v.value,v.unit]):[]);
 if(references.length)sheets.push(sheet('Reference CR',['ID výpočtu','Zakázka','Číslo svaru','Údaj reference','Hodnota','Jednotka'],references,[40,24,20,38,60,16]));
 const sources=report.records.flatMap(r=>recordSources(r).map(([label,url])=>[r.id,label,url]));
 const info=[['Dokument',report.title],['Vytvořeno (UTC)',new Date(report.exportedAt)],['Technik',report.technician],['Poznámka',report.note],['Počet výpočtů',report.records.length],['Výsledky','Hodnoty historie jsou původní uložené výsledky. Číselné hodnoty jsou exportované bez přepočtu.'],['Čas','Datum záznamu a vytvoření sešitu jsou v UTC. Data ve vstupech zachovávají původní zápis.'],['Identifikace','Zakázka, díl, číslo výkresu, běžné číslo i číslo svaru jsou text.'],...sources.map(([id,label,url])=>['Podklad pro '+id,label+(url?'\n'+url:'')])];
 sheets.push(sheet('Informace',['Údaj','Hodnota'],info,[45,100]));
 return sheets;
}
export async function createXlsx(report){
 const [{default:writeExcelFile},utility]=await Promise.all([import('write-excel-file/universal'),import('write-excel-file/utility')]);
 const {getCellAddress,findElement,replaceElement,getOrderOfSiblings,insertElementMarkupAccordingToOrderOfSiblings}=utility;
 const filters={files:{transform:{'xl/worksheets/sheet{id}.xml':{transform(xml,options){
  if(!options.filter)return xml;
  const markup=`<autoFilter ref="A1:${getCellAddress(options.filterRows-1,options.filterColumns-1)}"/>`,existing=findElement(xml,'autoFilter');
  return existing?replaceElement(xml,existing,markup):insertElementMarkupAccordingToOrderOfSiblings(xml,markup,getOrderOfSiblings('xl/worksheets/sheet{id}.xml','worksheet'),'worksheet');
 }}}}};
 const blob=await writeExcelFile(workbookSheets(report),{fontFamily:'Calibri',fontSize:11,features:[filters]}).toBlob();
 return new Blob([blob],{type:mime});
}
