import { IDENTIFIERS, KINDS, currentExport, snapshotRecords, makeReport, exportFilename, displayValue, displayDate, valueRows, inputRows, statusText, xml } from './export-model.js';
import { createPdf, nomogramSvg, geometrySvg } from './export-pdf.js';

export const exportBody=`
 <p>Soubor se vytvoří v tomto zařízení. Výsledky z historie zachovají podobu při uložení.</p>
 <fieldset id="export-controls" class="export-controls">
 <div class="work-grid"><div><label for="export-scope">Co exportovat</label><select id="export-scope"><option value="current">Aktuální výpočet</option><option value="selected">Vybrané záznamy</option><option value="job">Celá zakázka</option></select></div><div><label for="export-format">Formát souboru</label><select id="export-format"><option value="pdf">PDF dokument</option><option value="xlsx">Excel (.xlsx)</option></select></div></div>
 <div id="export-job-wrap" class="export-field" hidden><label for="export-job">Zakázka k exportu</label><select id="export-job"></select></div>
 <div id="export-pdf-options" class="export-field"><label for="export-detail">Obsah PDF</label><select id="export-detail"><option value="details">Přehled a podrobné výpočtové listy</option><option value="summary">Pouze stručný přehled</option></select><div id="export-figures"><label class="work-check"><input id="export-nomogram" type="checkbox" checked> Přidat nomogram, pokud je dostupný</label><label class="work-check"><input id="export-geometry" type="checkbox"> Přidat schéma geometrie</label></div></div>
 <details class="export-field"><summary>Technik, poznámka a logo</summary><div class="export-field"><label for="export-technician">Jméno technika (nepovinné)</label><input id="export-technician" maxlength="120" autocomplete="name"></div><div class="export-field"><label for="export-note">Poznámka do dokumentu (nepovinná)</label><textarea id="export-note" maxlength="2000" rows="3"></textarea></div><div id="export-logo-wrap" class="export-field"><label for="export-logo">Logo do PDF (PNG nebo JPG, nejvýše 2 MB)</label><input id="export-logo" type="file" accept="image/png,image/jpeg"><button id="export-logo-remove" type="button" class="text-button" hidden>Odebrat logo</button><p id="export-logo-status" role="status"></p></div></details>
 </fieldset>
 <div class="export-preview-heading"><h4>Náhled obsahu</h4><p id="export-count" role="status"></p></div><div id="export-preview"></div>
 <nav class="history-pages" aria-label="Stránky náhledu exportu"><button id="export-prev" type="button" class="secondary-button">Předchozí</button><span id="export-page"></span><button id="export-next" type="button" class="secondary-button">Další</button></nav>
 <div class="export-submit"><p id="export-status" role="status" tabindex="-1"></p><button id="export-download" type="button" class="primary-button">Stáhnout PDF</button><a id="export-ready" class="secondary-button" hidden>Stáhnout soubor znovu</a></div>`;

export function initExports({document:d,app,readHistory,readMetadata,open,downloadFile}){
 const w=d.defaultView,by=id=>d.getElementById(id),abort=new w.AbortController(),on=(id,event,fn)=>by(id).addEventListener(event,fn,{signal:abort.signal});
 let current=[],history=[],selected=[],jobs=[],currentError='',page=0,logo=null,url=null,busy=false,logoLoading=false,logoRevision=0;
 const status=(message,error=false)=>{by('export-status').textContent=message;by('export-status').dataset.error=String(error);};
 const invalidate=()=>{if(url){w.URL.revokeObjectURL(url);url=null;}by('export-ready').hidden=true;by('export-ready').removeAttribute('href');status('');};
 const records=()=>by('export-scope').value==='current'?current:by('export-scope').value==='selected'?selected:history.filter(r=>r.jobId===by('export-job').value);
 const options=()=>({details:by('export-detail').value==='details',nomogram:by('export-nomogram').checked,geometry:by('export-geometry').checked,technician:by('export-technician').value,note:by('export-note').value,logo});
 function render(){
  const pdf=by('export-format').value==='pdf',detail=by('export-detail').value==='details',rows=records(),pages=Math.max(1,Math.ceil(rows.length/10));page=Math.min(page,pages-1);
  by('export-job-wrap').hidden=by('export-scope').value!=='job';by('export-pdf-options').hidden=!pdf;by('export-logo-wrap').hidden=!pdf;by('export-figures').hidden=!detail;
  by('export-count').textContent=`Počet výpočtů: ${rows.length}`;by('export-download').disabled=!rows.length||busy||logoLoading;by('export-download').textContent=busy?'Vytvářím soubor…':pdf?'Stáhnout PDF':'Stáhnout Excel';
  by('export-prev').disabled=page===0;by('export-next').disabled=page===pages-1;by('export-page').textContent=`${page+1} / ${pages}`;
  by('export-preview').innerHTML=rows.length?rows.slice(page*10,page*10+10).map(r=>{
   const graph=pdf&&detail&&by('export-nomogram').checked?nomogramSvg(r):null,geometry=pdf&&detail&&by('export-geometry').checked?geometrySvg(r):null;
   const fields=[...inputRows(r),...valueRows(r.result.values,r.context.kind,{result:true})];
   return `<article class="export-preview-card"><h4>${xml(KINDS[r.context.kind])}</h4><dl class="export-identifiers">${IDENTIFIERS.map(([key,label])=>`<dt>${label}</dt><dd>${xml(displayValue(r[key]))}</dd>`).join('')}</dl><strong class="export-result">${xml(r.result.summary)}</strong><p>${xml(statusText(r))}</p><p class="export-meta">${r.current?'Aktuální zadání, neuloženo':'Uložená historie'} · ${xml(displayDate(r.createdAt))} · model ${xml(r.modelVersion)}</p>${!pdf||detail?`<details><summary>Vstupy a podrobnosti výsledku</summary><dl class="export-identifiers">${fields.map(f=>`<dt>${xml(f.label)}${f.unit?' ('+xml(f.unit)+')':''}</dt><dd>${xml(displayValue(f.value))}</dd>`).join('')}</dl></details>`:''}${graph?`<div class="export-chart" role="img" aria-label="Nomogram exportovaného výpočtu">${graph}</div>`:''}${geometry?`<div class="export-chart" role="img" aria-label="Schéma exportovaného výpočtu">${geometry}</div><p>Schéma není v měřítku.</p>`:''}</article>`;
  }).join(''):`<p class="export-empty">${xml(by('export-scope').value==='current'?currentError||'Doplňte platný výpočet.':by('export-scope').value==='job'?'Tato zakázka zatím nemá uložené výpočty.':'Vyberte záznamy v historii.')}</p>`;
 }
 function show({scope='current',selection=[],button}={}){
  invalidate();page=0;const all=readHistory();jobs=all.filter(e=>e.kind==='job');history=snapshotRecords(all.filter(e=>e.kind==='calculation'),jobs);selected=snapshotRecords(selection,jobs);
  try{const meta=readMetadata();current=[currentExport(app.captureCalculation(),meta)];currentError='';}catch(error){current=[];currentError=error.message;}
  by('export-job').replaceChildren(...jobs.map(j=>{const option=d.createElement('option');option.value=j.id;option.textContent=j.name;return option;}));
  const meta=readMetadata();if(jobs.some(j=>j.id===meta.jobId))by('export-job').value=meta.jobId;
  by('export-scope').querySelector('[value=selected]').disabled=!selected.length;by('export-scope').querySelector('[value=job]').disabled=!jobs.length;by('export-scope').value=scope;
  open(button);render();
 }
 for(const id of ['export-scope','export-format','export-job','export-detail','export-nomogram','export-geometry','export-technician','export-note'])on(id,'input',()=>{invalidate();page=0;render();});
 on('export-prev','click',()=>{page--;render();});on('export-next','click',()=>{page++;render();});
 on('export-logo-remove','click',()=>{logoRevision++;logo=null;by('export-logo').value='';by('export-logo-remove').hidden=true;by('export-logo-status').textContent='';invalidate();});
 on('export-logo','change',async()=>{
  const revision=++logoRevision,file=by('export-logo').files?.[0];logo=null;invalidate();by('export-logo-remove').hidden=true;by('export-logo-status').textContent='';logoLoading=false;if(!file){render();return;}logoLoading=true;render();
  try{
   if(!['image/png','image/jpeg'].includes(file.type)||file.size>2*1024*1024)throw new Error('Vyberte PNG nebo JPG do 2 MB.');
   const data=await new Promise((resolve,reject)=>{const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Obrázek nelze přečíst.'));reader.readAsDataURL(file);});
   const img=new w.Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Soubor není platný obrázek.'));img.src=data;});
   if(img.naturalWidth*img.naturalHeight>16000000)throw new Error('Logo je příliš velké. Použijte obrázek do 16 megapixelů.');
   const scale=Math.min(1,600/Math.max(img.naturalWidth,img.naturalHeight)),canvas=d.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
   if(revision!==logoRevision)return;logo=canvas.toDataURL('image/png');by('export-logo-remove').hidden=false;by('export-logo-status').textContent='Logo připraveno: '+file.name;
  }catch(error){if(revision!==logoRevision)return;by('export-logo').value='';by('export-logo-status').textContent=error.message;}
  finally{if(revision===logoRevision){logoLoading=false;render();}}
 });
 on('export-download','click',async()=>{
  if(busy||logoLoading)return;let report;
  try{report=makeReport(records(),options());}catch(error){status(error.message,true);return;}
  const format=by('export-format').value;invalidate();busy=true;by('export-status').focus();by('export-controls').disabled=true;by('export-panel').setAttribute('aria-busy','true');render();status('Vytvářím soubor v zařízení…');
  try{
   const {createXlsx}=format==='xlsx'?await import('./export-xlsx.js'):{};
   const blob=await (format==='pdf'?createPdf(report):createXlsx(report)),filename=exportFilename(report,format);
   if(downloadFile)await downloadFile({blob,filename,report});
   else {url=w.URL.createObjectURL(blob);const link=by('export-ready');link.href=url;link.download=filename;link.hidden=false;link.click();}
   status(`Soubor ${filename} je připravený ke stažení. Počet výpočtů: ${report.records.length}.`);
  }catch(error){status('Export se nepodařil: '+error.message,true);}
  finally{busy=false;by('export-controls').disabled=false;by('export-panel').removeAttribute('aria-busy');render();}
 });
 return {show,destroy(){abort.abort();logoRevision++;if(url)w.URL.revokeObjectURL(url);}};
}
