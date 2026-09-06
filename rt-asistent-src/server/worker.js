const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
// Retired endpoint remains explicit so an older open tab cannot upload data.
export async function workspaceApi(){return json({error:'Synchronizace byla odstraněna. Data se ukládají pouze v zařízení.'},410);}
async function route(request,env,appShell,assets){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/'))return workspaceApi();
 if(appShell&&url.pathname==='/release.json')return json({version:appShell.match(/name="rt-build" content="([a-f0-9]+)"/)?.[1]});
 if(appShell&&url.pathname==='/offline-shell.json'){
  // JSON distribution avoids third-party scripts injected into hosted HTML.
  const shell=await secureResponse(new Response(appShell,{headers:{'Content-Type':'text/html; charset=utf-8'}}));
  return json({version:appShell.match(/name="rt-build" content="([a-f0-9]+)"/)?.[1],html:await shell.text(),headers:Object.fromEntries(shell.headers)});
 }
 if(appShell&&['/','/index.html','/offline','/offline/','/offline.html'].includes(url.pathname)){
  if(!['GET','HEAD'].includes(request.method))return json({error:'Nepodporovaná metoda.'},405);
  return new Response(request.method==='HEAD'?null:appShell,{headers:{'Content-Type':'text/html; charset=utf-8'}});
 }
 if(assets){
  const asset=assets[url.pathname];if(!asset)return new Response('Nenalezeno.',{status:404});
  if(!['GET','HEAD'].includes(request.method))return json({error:'Nepodporovaná metoda.'},405);
  const bytes=request.method==='HEAD'?null:Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0));
  return new Response(bytes,{headers:{'Content-Type':asset.type,'Cache-Control':url.pathname.startsWith('/assets/')||url.pathname.startsWith('/offline-worker/')?'public, max-age=31536000, immutable':'no-cache','Service-Worker-Allowed':'/'}});
 }
 if(!env.ASSETS)return new Response('Assets unavailable',{status:503});
 // HTML gets a fresh nonce, so do not combine a new policy with a cached 304 body.
 const headers=new Headers(request.headers);headers.delete('if-none-match');headers.delete('if-modified-since');
 return env.ASSETS.fetch(new Request(request,{headers}));
}
export async function secureResponse(response){
 const headers=new Headers(response.headers),html=headers.get('content-type')?.includes('text/html');
 const nonce=html?btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(18)))):null;
 headers.set('Content-Security-Policy',`default-src 'self'; script-src 'self'${nonce?` 'nonce-${nonce}'`:''}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; frame-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'self'`);
 headers.set('X-Content-Type-Options','nosniff');headers.set('X-Frame-Options','DENY');
 headers.set('Referrer-Policy','strict-origin-when-cross-origin');headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=(), usb=()');
 headers.set('Strict-Transport-Security','max-age=31536000');
 let body=response.body;
 if(html&&response.status!==304){
  // ASSETS serves only the compiled application shell, never user-generated HTML.
  // Cloudflare also applies this response-header nonce to its injected scripts.
  body=(await response.text()).replace(/<script\b/g,`<script nonce="${nonce}"`);
  headers.set('Cache-Control','private, no-store');headers.delete('etag');headers.delete('content-length');
 }
 return new Response(body,{status:response.status,statusText:response.statusText,headers});
}
export function createWorker(appShell=null,assets=null){return {async fetch(request,env){return secureResponse(await route(request,env,appShell,assets));}};}
export default createWorker();
