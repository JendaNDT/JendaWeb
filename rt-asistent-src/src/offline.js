export function initOffline({window:w=globalThis.window}={}){
 const d=w.document,by=id=>d.getElementById(id),sw=w.navigator.serviceWorker,build=d.querySelector('meta[name="rt-build"]')?.content,base=d.querySelector('meta[name="rt-base"]')?.content||'/';
 const abort=new w.AbortController(),on=(el,event,fn)=>el?.addEventListener(event,fn,{signal:abort.signal});
 let ready=false,version='',waiting=false,installEvent=null,installed=w.matchMedia?.('(display-mode: standalone)').matches||w.navigator.standalone===true;
 const render=()=>{const text=(w.navigator.onLine===false?'Bez připojení · ':'')+(ready?'Aplikace připravena offline':build==='development'?'Offline režim bude dostupný v nasazené aplikaci':'Offline kopie zatím není připravená')+(ready&&version!==build?' · k dispozici je předchozí verze':'')+(waiting?' · aktualizace se použije po zavření všech karet aplikace':'');by('offline-status').textContent=text;if(by('offline-detail'))by('offline-detail').textContent=text;};
 const installState=()=>{if(by('install-app')){by('install-app').textContent=installed?'Aplikace je nainstalovaná':'Instalovat aplikaci';by('install-app').disabled=installed;}};
 const failure=text=>{if(ready)return;by('offline-status').textContent=text;if(by('offline-detail'))by('offline-detail').textContent=text;};
 function check(){const worker=sw?.controller;if(!worker)return Promise.resolve(false);return new Promise(resolve=>{const channel=new w.MessageChannel(),timer=w.setTimeout(()=>{channel.port1.close();resolve(false);},4000);channel.port1.onmessage=e=>{if(e.data?.type==='OFFLINE_READY'){ready=e.data.ready===true;version=e.data.version;render();}w.clearTimeout(timer);channel.port1.close();resolve(ready);};worker.postMessage({type:'STATUS'},[channel.port2]);});}
 function persistentLabel(persistent){if(by('storage-persist-status'))by('storage-persist-status').textContent=persistent?'Prohlížeč chrání data před automatickým uvolněním místa. Ruční smazání dat webu je stále odstraní.':'Pravidelně stahujte zálohu. Ochranu před automatickým uvolněním místa posuzuje prohlížeč.';}
 on(by('storage-persist'),'click',async()=>{try{persistentLabel(await w.navigator.storage?.persist?.());}catch{persistentLabel(false);}});
 w.navigator.storage?.persisted?.().then(persistentLabel).catch(()=>persistentLabel(false));
 on(w,'beforeinstallprompt',event=>{event.preventDefault();installEvent=event;installState();});
 on(w,'appinstalled',()=>{installed=true;installEvent=null;installState();});
 on(by('install-app'),'click',async()=>{if(!installEvent){by('install-help').textContent='V nabídce Chrome nebo Edge zvolte „Instalovat aplikaci“. Na iPhonu či iPadu použijte Sdílet → Přidat na plochu. Pokud volbu nevidíte, otevřete adresu v běžném prohlížeči. Instalace vyžaduje první otevření online.';return;}const prompt=installEvent;installEvent=null;try{await prompt.prompt();await prompt.userChoice;}catch{by('install-help').textContent='Instalaci můžete spustit z nabídky prohlížeče.';}});
 on(w,'online',render);on(w,'offline',render);render();installState();
 on(by('offline-check'),'click',async()=>{const ok=await check();if(!ok){ready=false;render();}});
 if(!sw||!build||build==='development'){if(!sw)failure('Tento prohlížeč nepodporuje otevření aplikace offline.');return {destroy:()=>abort.abort()};}
 const updateStatus=(text)=>{if(by('offline-update-status'))by('offline-update-status').textContent=text;};
 function observe(reg){waiting=!!reg.waiting;render();check();const watch=worker=>{if(!worker)return;on(worker,'statechange',()=>{waiting=!!reg.waiting;if(worker.state==='redundant')updateStatus('Stažení se nezdařilo. Původní verze zůstává dostupná.');else if(waiting)updateStatus('Aktualizace je stažená. Zavřete všechna okna aplikace a znovu ji spusťte.');render();});};watch(reg.installing);on(reg,'updatefound',()=>watch(reg.installing));}
 const register=version=>sw.register(base+'offline-worker/'+version+'.js',{scope:base,updateViaCache:'none'}).then(reg=>{observe(reg);return reg;});
 on(by('offline-update'),'click',async()=>{
  const button=by('offline-update');button.disabled=true;updateStatus('Hledám aktualizaci…');
  try{
   if(w.navigator.onLine===false)throw new Error('Pro stažení aktualizace se připojte k internetu. Dosavadní aplikace dál funguje offline.');
   if(!sw.controller){await register(build);updateStatus('Připravuji offline kopii…');return;}
   const release=await new Promise((resolve,reject)=>{const channel=new w.MessageChannel(),timer=w.setTimeout(()=>{channel.port1.close();reject(new Error('Server neodpovídá. Zkuste aktualizaci později.'));},20000);channel.port1.onmessage=e=>{w.clearTimeout(timer);channel.port1.close();e.data?.type==='UPDATE_AVAILABLE'?resolve(e.data):reject(new Error(e.data?.error||'Aktualizace není dostupná.'));};sw.controller.postMessage({type:'CHECK_UPDATE'},[channel.port2]);});
   if(release.version===version&&await check()){updateStatus('Používáte aktuální verzi.');return;}
   updateStatus('Stahuji aplikaci…');const reg=await register(release.version);
   // Explicit retry can repair missing cache entries even at the same version.
   if(!reg.installing&&!reg.waiting&&release.version===version) {await new Promise((resolve,reject)=>{const channel=new w.MessageChannel(),timer=w.setTimeout(()=>{channel.port1.close();reject(new Error('Oprava kopie nedokončena. Opakujte stažení.'));},60000);channel.port1.onmessage=e=>{w.clearTimeout(timer);channel.port1.close();e.data?.ok?resolve():reject(new Error('Kopii se nepodařilo stáhnout.'));};sw.controller.postMessage({type:'REPAIR'},[channel.port2]);});await check();updateStatus('Offline kopie byla doplněna.');}
  }catch(error){updateStatus(error.message);}finally{button.disabled=false;}
 });
 check();on(sw,'controllerchange',()=>{check();});
 // getRegistration reads browser state; an installed version makes no update request.
 sw.getRegistration(base).then(async reg=>{
  if(!reg||reg.scope!==new URL(base,w.location.origin).href||!reg.active?.scriptURL?.includes(base+'offline-worker/'))reg=await register(build);
  else observe(reg);
 }).catch(()=>{check().then(ok=>{if(!ok)failure('Offline kopii nelze připravit. Otevřete aplikaci online v prohlížeči s povolenými daty webu.');});});
 return {check,destroy:()=>abort.abort()};
}
