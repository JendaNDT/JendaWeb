import { IDENTIFIERS, KINDS, displayValue, displayDate, valueRows, inputRows, statusText, recordSources } from './export-model.js';
import { NOMOGRAMS } from './nomograms.js';
import { geometryDiagram } from './geometry.js';

export function nomogramSvg(record){
 if(record.unverified||record.context.kind!=='n')return null;
 const r=record.result.values,lines=NOMOGRAMS[(r.outside?'outside':'inside')+record.context.inputs.qualityClass];
 if(!lines||![r.x,r.y,r.yMax].every(Number.isFinite))return null;
 const px=x=>48+x/.25*430,py=y=>215-y/r.yMax*195;
 let body='';
 for(let i=0;i<=5;i++){const x=i*.05;body+=`<path d="M${px(x)} 20V215" stroke="#dce2eb"/><text x="${px(x)}" y="233" text-anchor="middle">${displayValue(x)}</text>`;}
 for(let i=0;i<=8;i++){const y=r.yMax*i/8;body+=`<path d="M48 ${py(y)}H478" stroke="#dce2eb"/><text x="40" y="${py(y)+4}" text-anchor="end">${displayValue(y)}</text>`;}
 for(const line of lines){
  body+=`<polyline points="${line.dataPoints.map(p=>`${px(p.x)},${py(p.y)}`).join(' ')}" stroke="#7d8fa9" stroke-width="1" fill="none" clip-path="url(#plot)"/>`;
  const p=line.dataPoints.find(p=>p.x>=0&&p.x<=.25&&p.y>0&&p.y<r.yMax);
  if(p)body+=`<text x="${px(p.x)+4}" y="${py(p.y)-3}" font-size="9">${line.N}</text>`;
 }
 body+=`<circle cx="${px(r.x)}" cy="${py(r.y)}" r="5" fill="#2557cf" stroke="white" stroke-width="1.5"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="510" height="260" viewBox="0 0 510 260"><defs><clipPath id="plot"><rect x="48" y="20" width="430" height="195"/></clipPath></defs><g font-family="Roboto" font-size="11" fill="#35465e">${body}<text x="260" y="255" text-anchor="middle">t/De</text><text x="8" y="12">${r.outside?'De/f':'De/SFD'}</text></g></svg>`;
}
export function geometrySvg(record){
 if(record.unverified||!['n','ug'].includes(record.context.kind))return null;
 const i=record.context.inputs,technique=i.technique==='double'?'dwsi':i.technique;
 let svg=geometryDiagram(technique,{module:record.context.kind,gap:i.gap??0}).split('</svg>')[0]+'</svg>';
 const styles={'object-wall':'fill="#dbe3ee" stroke="#738198" stroke-width="1.5"','object-void':'fill="white" stroke="#738198"','radiation-ray':'fill="none" stroke="#879abc" stroke-width="1.5"','source-point':'fill="#172437"','film-line':'stroke="#2557cf" stroke-width="5"','evaluated-wall':'stroke="#28765b" stroke-width="7"','dimension':'fill="none" stroke="#738198" stroke-width="1"','diagram-label':'fill="#4f6076" font-size="13"'};
 svg=svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="356" height="250" font-family="Roboto" ');
 for(const [name,style]of Object.entries(styles))svg=svg.replaceAll(`class="${name}"`,style);
 return svg.replace(/<text ([^>]+)>/g,(_,attributes)=>`<text ${attributes}${attributes.includes('fill=')?'':' fill="#4f6076"'} stroke="none"${attributes.includes('font-size=')?'':' font-size="13"'}>`);
}
const text=value=>displayValue(value).replace(/[\u2011\u2013\u2014]/g,'-');
const cell=(value,style={})=>({text:text(value),...style});
const layout={hLineWidth:()=>.5,vLineWidth:()=>0,hLineColor:()=>'#dce2eb',paddingLeft:()=>7,paddingRight:()=>7,paddingTop:()=>2.5,paddingBottom:()=>2.5};
const table=(body,widths,headerRows=0)=>({table:{headerRows,widths,body},layout,margin:[0,0,0,12]});
const section=label=>({text:label,fontSize:12,bold:true,color:'#203651',margin:[0,12,0,7]});
function rowTable(rows){return table(rows.map(r=>[cell(r.label,{color:'#526176'}),cell(r.value),{text:r.unit,color:'#526176'}]),[210,'*',55]);}
export function pdfDefinition(report){
 const content=[];
 const heading={stack:[{text:report.title,fontSize:24,bold:true,color:'#173352'}, {text:`Vytvořeno ${displayDate(report.exportedAt)} (Europe/Prague) · Počet výpočtů: ${report.records.length}`,fontSize:9,color:'#526176',margin:[0,7,0,0]}]};
 content.push(report.logo?{columns:[heading,{image:report.logo,fit:[85,48],width:85}],columnGap:15}:heading);
 if(report.technician)content.push({text:'Technik: '+report.technician,margin:[0,10,0,0]});
 if(report.note)content.push({text:'Poznámka: '+report.note,margin:[0,8,0,0]});
 if(report.records.length>1||!report.details){
  content.push(section('Přehled'));
  const headers=['Identifikace','Výpočet / datum','Výsledek'].map(v=>cell(v,{bold:true,fillColor:'#eaf0fa'}));
  content.push(table([headers,...report.records.map(r=>[
   {stack:IDENTIFIERS.map(([key,label])=>({text:`${label}: ${text(r[key])}`,margin:[0,0,0,3]}))},
   {stack:[cell(KINDS[r.context.kind],{bold:true}),cell(displayDate(r.createdAt),{margin:[0,5,0,0]}),cell('Model '+r.modelVersion,{fontSize:8,margin:[0,5,0,0]})]},
   {stack:[cell(r.result.summary,{bold:true,fontSize:12}),cell(statusText(r),{margin:[0,5,0,0]}),...(r.current?[cell('Aktuální zadání – neuloženo v historii',{fontSize:8})]:[])]}
  ])],[175,145,'*'],1));
 }
 if(report.details)for(const [index,r]of report.records.entries()){
  if(report.records.length>1)content.push({text:`${index+1}. ${KINDS[r.context.kind]}`,pageBreak:'before',fontSize:20,bold:true,color:'#173352',margin:[0,0,0,12]});
  else content.push(section(KINDS[r.context.kind]));
  content.push(table(IDENTIFIERS.map(([key,label])=>[cell(label,{color:'#526176'}),cell(r[key],{bold:true})]),[125,'*']));
  content.push({text:`${r.current?'Zachyceno z aktuálního zadání':'Uloženo'}: ${displayDate(r.createdAt)} (Europe/Prague) · Model: ${r.modelVersion} · ID: ${r.id}`,fontSize:9,color:'#526176',margin:[0,0,0,10]});
  const sources=recordSources(r);
  if(sources.length)content.push({stack:sources.map(([label,url])=>({text:'Podklad: '+label+(url&&!url.startsWith('https://')?': '+url:''),...(url.startsWith('https://')?{link:url}:{}),fontSize:8,color:'#35557c'})),margin:[0,0,0,8],unbreakable:true});
  content.push({stack:[{text:text(r.result.summary),fontSize:25,bold:true,color:'#173352'},{text:statusText(r),margin:[0,5,0,0],color:r.unverified||r.result.status==='fail'?'#a92c37':'#526176'}],margin:[0,0,0,8]});
  if(r.current)content.push({text:'Aktuální zadání – neuloženo v historii.',fontSize:9,color:'#526176'});
  content.push(section('Vstupy'),rowTable(inputRows(r)));
  if(r.result.values.nearBoundary)content.push({text:'Bod leží u hranice oblastí; výsledek zahrnuje nejistotu odečtu.',fontSize:9,color:'#526176'});
  const mainKeys=['ug','f','b','minF','minInputDistance','minutes','exposure','currentActivity','actual','target'];
  const details=valueRows(r.result.values,r.context.kind,{result:true}).filter(row=>mainKeys.includes(row.key));
  if(details.length)content.push(section('Podrobnosti výsledku'),rowTable(details));
  if(report.nomogram){const svg=nomogramSvg(r);if(svg)content.push({stack:[section('Nomogram '+r.result.values.figure),{svg,width:480},{text:`t/De = ${displayValue(r.result.values.x)} · ${r.result.values.outside?'De/f':'De/SFD'} = ${displayValue(r.result.values.y)}. Čísla křivek označují počty expozic.`,fontSize:9,color:'#526176',margin:[0,5,0,0]}],unbreakable:true});}
  if(report.geometry){const svg=geometrySvg(r);if(svg)content.push({stack:[section('Schéma geometrie'),{svg,width:250},{text:'Schéma není v měřítku.',fontSize:9,color:'#526176'}],unbreakable:true});}
  if(r.context.reference){content.push({text:'Použitá reference CR',pageBreak:'before',fontSize:18,bold:true,color:'#173352',margin:[0,0,0,12]},{text:'Výpočet '+r.id+' · Zakázka '+text(r.jobName)+' · Svar '+text(r.weld),fontSize:9,margin:[0,0,0,12]},rowTable(valueRows(r.context.reference,'reference')));}
 }
 return {info:{title:report.title,author:report.technician||'RT Asistent',subject:'Radiografické výpočty',creator:'RT Asistent'},pageSize:'A4',pageMargins:[40,40,40,45],defaultStyle:{font:'Roboto',fontSize:10,color:'#172437'},content,footer:(page,pages)=>({columns:[{text:'RT Asistent · Výpočtový podklad',width:'*'},{text:`${page} / ${pages}`,alignment:'right',width:70}],margin:[40,15,40,0],fontSize:8,color:'#526176'})};
}
export async function createPdf(report){
 const [{default:pdfMake},{default:fonts}]=await Promise.all([import('pdfmake/build/pdfmake.js'),import('pdfmake/build/vfs_fonts.js')]);
 pdfMake.addVirtualFileSystem(fonts);
 pdfMake.setUrlAccessPolicy(()=>false);
 const buffer=await pdfMake.createPdf(pdfDefinition(report)).getBuffer();
 return new Blob([buffer],{type:'application/pdf'});
}
