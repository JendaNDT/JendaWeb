import { BACKUP_LIMIT, createBackup, parseBackup, planRestore } from './backup.js';

export const dataToolsBody=`
 <section class="data-section"><h4>Data v tomto zařízení</h4><p>Zakázky, historie i CR knihovna se ukládají pouze v tomto profilu prohlížeče. Aplikace je nikam neodesílá a nepotřebuje účet.</p><div id="archive-choice" hidden><label for="local-archive">Místní archiv</label><select id="local-archive" disabled></select><p>Oddělené archivy zachovávají data uložená dřívější verzí v tomto zařízení. Každý zálohujte samostatně. CR knihovna je společná.</p></div></section>
 <section class="data-section"><h4>Aplikace pro práci offline</h4><p id="offline-detail" role="status">Kontroluji offline kopii…</p><div class="work-panel-actions"><button id="install-app" type="button" class="primary-button">Instalovat aplikaci</button><button id="offline-update" type="button" class="secondary-button">Vyhledat a stáhnout aktualizaci</button><button id="offline-check" type="button" class="secondary-button">Ověřit připravenost</button></div><p id="offline-update-status" role="status"></p><p>Aktualizace se stahuje pouze na váš pokyn a použije se po zavření všech oken aplikace.</p><p id="install-help">V nabídce prohlížeče zvolte instalaci aplikace. Na iPhonu či iPadu použijte Sdílet → Přidat na plochu. Pokud volbu nevidíte, otevřete adresu aplikace v běžném prohlížeči.</p><p>První stažení vyžaduje připojení. Vestavěný manuál a výpočty jsou součástí offline kopie; odkazované PDF dokumenty vyžadují internet.</p><button id="storage-persist" type="button" class="secondary-button">Chránit místní data</button><p id="storage-persist-status" role="status"></p></section>
 <section class="data-section"><h4>Záloha a obnova</h4><p>Záloha obsahuje zakázky a historii z právě zvoleného místního archivu a celou místní CR knihovnu. Rozepsané formuláře ani nastavení vzhledu se nepřenášejí.</p><button id="backup-export" type="button" class="primary-button" disabled>Stáhnout zálohu</button><p id="backup-last"></p><label for="backup-file">Obnovit ze zálohy JSON</label><input id="backup-file" type="file" accept=".json,application/json" disabled><div id="backup-preview" hidden><p id="backup-summary"></p><p>Existující záznamy zůstanou zachované. Shodné záznamy se přeskočí.</p><button id="backup-restore" type="button" class="primary-button">Přidat záznamy ze zálohy</button></div><p id="backup-status" role="status"></p><p>Zálohu ukládejte mimo data tohoto webu. Smazání dat prohlížeče odstraní místní záznamy i offline kopii.</p></section>`;

export function initDataTools({document:d,app,store,open,onArchiveChanged,onRestored}){
 const w=d.defaultView,by=id=>d.getElementById(id),abort=new w.AbortController(),on=(id,event,fn)=>by(id).addEventListener(event,fn,{signal:abort.signal});
 let candidate=null,target=null,ready=false,working=false;
 const status=(text,error=false)=>{by('backup-status').textContent=text;by('backup-status').dataset.error=String(error);};
 let busyFocus=null;
 function controls(){
  const panel=by('data-panel');
  if(working&&!busyFocus&&!panel.hidden&&panel.contains(d.activeElement)){busyFocus=d.activeElement;by('backup-status').tabIndex=-1;by('backup-status').focus();}
  for(const id of ['backup-export','backup-file','local-archive'])by(id).disabled=!ready||working;by('backup-restore').disabled=!ready||working;
  panel.setAttribute('aria-busy',String(working));
  if(!working&&busyFocus&&!panel.hidden){(busyFocus.isConnected&&!busyFocus.disabled&&!busyFocus.closest('[hidden]')?busyFocus:by('backup-status')).focus();busyFocus=null;}
 }
 function reset(){candidate=null;target=null;by('backup-preview').hidden=true;by('backup-file').value='';}
 function render(){const select=by('local-archive'),archives=store.archives?.()||[];select.replaceChildren(...archives.map(a=>{const o=d.createElement('option');o.value=a.id;o.textContent=a.label+' ('+a.count+' záznamů)';return o;}));select.value=store.owner?.()||'';by('archive-choice').hidden=archives.length<2;}
 async function recover(){let pending;while((pending=await store.pendingLibrary?.())){await app.restoreLibrary(pending);if(await store.finishLibraryRestore(pending)!==false)break;}}
 on('data-open','click',()=>{render();open();});
 on('local-archive','change',async()=>{const next=by('local-archive').value;working=true;controls();reset();try{await store.setArchive(next);await onArchiveChanged();status('Místní archiv byl změněn.');}catch(error){status(error.message,true);}finally{working=false;render();controls();}});
 on('backup-export','click',async()=>{working=true;controls();try{
  await store.reload?.();const pending=await store.pendingLibrary?.(),snapshot=await app.exportLibrary(),library=pending?planRestore({entries:[],library:pending},[],snapshot).library:snapshot;
  const data=createBackup(store.entries(),library),blob=new w.Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=w.URL.createObjectURL(blob),link=d.createElement('a');link.href=url;link.download=`RT-Asistent-zaloha-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;d.body.append(link);link.click();link.remove();w.setTimeout(()=>w.URL.revokeObjectURL(url),30000);status('Záloha je připravená ke stažení. Zkontrolujte soubor ve stažených souborech.');by('backup-last').textContent='Poslední vytvoření zálohy: '+new Date().toLocaleString('cs-CZ');
 }catch(error){status('Zálohu se nepodařilo vytvořit: '+error.message,true);}finally{working=false;controls();}});
 on('backup-file','change',async()=>{const file=by('backup-file').files?.[0];reset();if(!file)return;working=true;controls();try{
  if(file.size>BACKUP_LIMIT)throw new Error('Záloha může mít nejvýše 20 MB.');await recover();await store.reload?.();
  const data=parseBackup(await file.text()),plan=planRestore(data,store.entries(),await app.exportLibrary()),c=plan.counts;candidate=data;target=store.owner?.();by('backup-summary').textContent=`Přidá se ${c.jobs} zakázek, ${c.calculations} výpočtů, ${c.measurements} CR měření a ${c.legacy} starých odhadů. Shodných záznamů: ${c.skipped}.`;by('backup-preview').hidden=false;status('Formát, vstupy a výsledky zálohy jsou konzistentní. Zkontrolujte souhrn a potvrďte přidání.');
 }catch(error){status(error.message,true);}finally{working=false;controls();}});
 on('backup-restore','click',async()=>{if(!candidate)return;working=true;controls();let committed=false;try{
  await store.reload?.();if(target!==store.owner?.())throw new Error('Změnil se místní archiv. Vyberte zálohu znovu.');
  const plan=planRestore(candidate,store.entries(),await app.exportLibrary());await store.importEntries(plan.entries,candidate.library,target);committed=true;await recover();reset();await onRestored();status('Obnova dokončena. Původní data zůstala zachovaná.');
 }catch(error){status(committed?'Historie je uložená, dokončení CR knihovny čeká v zařízení. Povolte místní úložiště a otevřete aplikaci znovu; obnovu lze bezpečně zopakovat.':error.message,true);}finally{working=false;controls();}});
 render();
 return {async ready(){ready=true;try{await recover();}catch{status('Dokončení obnovy CR knihovny čeká na povolení místního úložiště. Záloha dosud obnovených dat je dostupná.',true);}render();controls();},destroy(){abort.abort();}};
}
