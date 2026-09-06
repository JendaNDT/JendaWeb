/* Exact downloaded application assets. Runtime never falls through to a network. */
const MANIFEST={"version":"01ab745f9c78082f","base":"/rt-asistent/","shell":"/rt-asistent/index.html","assets":["/rt-asistent/index.html","/rt-asistent/assets/_commonjsHelpers-BFTU3MAI.js","/rt-asistent/assets/export-xlsx-CBHfML-S.js","/rt-asistent/assets/index-Bh0RqQ0b.css","/rt-asistent/assets/index-CO4bjT0A.js","/rt-asistent/assets/index-D2KwxtmB.js","/rt-asistent/assets/index-sG9wzbAE.js","/rt-asistent/assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2","/rt-asistent/assets/inter-latin-wght-normal-Dx4kXJAl.woff2","/rt-asistent/assets/pdfmake-Q44JKpeV.js","/rt-asistent/assets/vfs_fonts-DYgd5Mxl.js","/rt-asistent/icons/rt-192.png","/rt-asistent/icons/rt-512.png","/rt-asistent/manifest.webmanifest"]};
const BASE=MANIFEST.base||'/';
const SHELL=MANIFEST.shell||BASE+'offline';
const CACHE='rt-asistent-shell-'+MANIFEST.version;
const paths=new Set(MANIFEST.assets);
const unavailable=()=>new Response('Offline kopie není úplná. V panelu Offline a zálohy stáhněte aktualizaci s připojením.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
async function install(repair=false){
 const cache=await caches.open(CACHE);
 try{await Promise.all(MANIFEST.assets.map(async path=>{
  let r=await fetch(path===SHELL?BASE+'offline-shell.json':path,{cache:'reload',credentials:'omit',redirect:'error'});
  if(!r.ok||r.redirected||new URL(r.url||path,self.location.origin).origin!==self.location.origin)throw new Error('Asset unavailable');
  const type=r.headers.get('content-type')||'';
  if(path===SHELL){
   if(!type.includes('application/json'))throw new Error('Not the application download');
   const shell=await r.json();if(shell.version!==MANIFEST.version||typeof shell.html!=='string'||!shell.html.includes('name="rt-app" content="calculator"')||!shell.headers?.['content-security-policy'])throw new Error('Invalid application shell');
   r=new Response(shell.html,{headers:shell.headers});
  }else if(type.includes('text/html'))throw new Error('Authentication page is not an asset');
  await cache.put(path,r);
 }));}catch(error){if(!repair)await caches.delete(CACHE);throw error;}
}
self.addEventListener('install',event=>event.waitUntil(install()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(key=>key.startsWith('rt-asistent-shell-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim();})()));
self.addEventListener('message',event=>{
 if(event.data?.type==='REPAIR')event.waitUntil(install(true).then(()=>event.ports[0]?.postMessage({ok:true})).catch(()=>event.ports[0]?.postMessage({ok:false})));
 if(event.data?.type==='STATUS')event.waitUntil((async()=>{const cache=await caches.open(CACHE);event.ports[0]?.postMessage({type:'OFFLINE_READY',localOnly:true,version:MANIFEST.version,ready:(await Promise.all(MANIFEST.assets.map(path=>cache.match(path)))).every(Boolean)});})());
 // Only the explicit update button sends this message. No background polling.
 if(event.data?.type==='CHECK_UPDATE')event.waitUntil((async()=>{try{
  const response=await fetch(BASE+'release.json',{cache:'no-store',credentials:'omit',redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))throw new Error('Server aktualizací není dostupný. Zkuste stažení později; uložená aplikace dál funguje offline.');
  const release=await response.json();if(!/^[a-f0-9]{16}$/.test(release.version))throw new Error('Neplatná verze aktualizace.');
  event.ports[0]?.postMessage({type:'UPDATE_AVAILABLE',version:release.version});
 }catch(error){event.ports[0]?.postMessage({type:'UPDATE_ERROR',error:['TypeError','TimeoutError','AbortError'].includes(error?.name)?'Aktualizaci nelze stáhnout. Zkontrolujte připojení; uložená aplikace dál funguje offline.':error.message||'Aktualizaci nelze stáhnout. Zkontrolujte připojení.'});}})());
});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(url.origin===self.location.origin&&request.method==='GET'&&request.mode==='navigate'&&[BASE,BASE+'index.html',BASE+'offline',BASE+'offline/',BASE+'offline.html'].includes(url.pathname)){
  event.respondWith((async()=>await(await caches.open(CACHE)).match(SHELL)||unavailable())());return;
 }
 if(url.origin===self.location.origin&&request.method==='GET'&&paths.has(url.pathname)&&!url.search){
  event.respondWith((async()=>await(await caches.open(CACHE)).match(url.pathname)||unavailable())());return;
 }
 // User-opened documents and pages outside this application navigate normally.
 if(request.mode==='navigate'&&(url.origin!==self.location.origin||!url.pathname.startsWith(BASE)))return;
 event.respondWith(Promise.resolve(new Response('Tato aplikace pracuje pouze s místními daty.',{status:410,headers:{'Content-Type':'text/plain; charset=utf-8'}})));
});
