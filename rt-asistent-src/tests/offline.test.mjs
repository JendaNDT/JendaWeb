import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../server/service-worker.js',import.meta.url),'utf8');
const manifest={version:'test1',assets:['/offline','/assets/app.js','/assets/app.css']};
function harness(config=manifest){const handlers={},storage=new Map();let network=async path=>path===(config.base||'/')+'offline-shell.json'?Response.json({version:'test1',html:'<meta name="rt-app" content="calculator">',headers:{'content-type':'text/html','content-security-policy':"default-src 'self'"}}):new Response('asset',{headers:{'Content-Type':path.endsWith('.js')?'application/javascript':'text/css'}}),claimed=false;
 const caches={async open(name){if(!storage.has(name))storage.set(name,new Map());const cache=storage.get(name);return {put:async(k,v)=>cache.set(k,v),match:async k=>cache.get(k)?.clone()};},keys:async()=>[...storage.keys()],delete:async k=>storage.delete(k)};
 const self={location:{origin:'https://prototype.test'},clients:{claim:async()=>claimed=true},addEventListener:(name,fn)=>handlers[name]=fn};
 vm.runInNewContext(source.replace('__RT_MANIFEST__',JSON.stringify(config)),{self,caches,fetch:(...args)=>network(...args),URL,Response,Set,Promise,Error,AbortSignal});
 const lifetime=async name=>{let pending;handlers[name]({waitUntil:p=>pending=p});await pending;};
 const fetch=async(path,mode='cors',method='GET')=>{let promise;handlers.fetch({request:{url:path.startsWith('https:')?path:'https://prototype.test'+path,mode,method},respondWith:p=>promise=p});return promise===undefined?null:await promise;};
 return {handlers,storage,caches,lifetime,fetch,setNetwork:fn=>network=fn,claimed:()=>claimed};
}
test('offline install caches complete shell; failed/login install is discarded',async()=>{
 const a=harness();await a.lifetime('install');assert.equal(a.storage.get('rt-asistent-shell-test1').size,3);await a.lifetime('activate');assert.ok(a.claimed());
 const bad=harness();bad.setNetwork(async()=>new Response('<html>Sign in</html>',{headers:{'Content-Type':'text/html'}}));await assert.rejects(bad.lifetime('install'));assert.equal(bad.storage.has('rt-asistent-shell-test1'),false);
});

test('subdirectory distribution stays offline and preserves the portfolio cache',async()=>{
 const a=harness({version:'test1',base:'/rt-asistent/',shell:'/rt-asistent/index.html',assets:['/rt-asistent/index.html','/rt-asistent/assets/app.js']});
 await a.caches.open('jw-v89');await a.lifetime('install');await a.lifetime('activate');assert.ok(a.storage.has('jw-v89'));
 const calls=[];a.setNetwork(async path=>{calls.push(path);return Response.json({version:'0123456789abcdef'});});
 assert.match(await(await a.fetch('/rt-asistent/','navigate')).text(),/rt-app/);
 assert.equal(await(await a.fetch('/rt-asistent/assets/app.js')).text(),'asset');assert.equal(await a.fetch('/','navigate'),null);
 assert.equal((await a.fetch('/rt-asistent/api/workspace')).status,410);assert.deepEqual(calls,[]);
 let pending;a.handlers.message({data:{type:'CHECK_UPDATE'},ports:[{postMessage(){}}],waitUntil:p=>pending=p});await pending;
 assert.deepEqual(calls,['/rt-asistent/release.json']);
});

test('portfolio upgrade never deletes or intercepts the RT offline installation',async()=>{
 const handlers={},deleted=[],keys=['jw-v88','jw-v90','rt-asistent-shell-test1','unrelated'];
 vm.runInNewContext(fs.readFileSync(new URL('../../sw.js',import.meta.url),'utf8'),{self:{addEventListener:(n,fn)=>handlers[n]=fn,clients:{claim(){}},skipWaiting(){}},location:{origin:'https://prototype.test'},URL,caches:{keys:async()=>keys,delete:async k=>deleted.push(k)}});
 let pending;handlers.activate({waitUntil:p=>pending=p});await pending;assert.deepEqual(deleted,['jw-v88']);
 for(const p of ['/rt-asistent','/rt-asistent/','/rt-asistent/offline-worker/test.js'])handlers.fetch({request:{method:'GET',url:'https://prototype.test'+p},respondWith(){assert.fail('Portfolio intercepted RT request');}});
});
test('runtime is cache-only even online, rejects APIs and never fetches a missing asset',async()=>{
 const a=harness();await a.lifetime('install');let requests=0;a.setNetwork(async()=>{requests++;return new Response('Login',{status:401});});
 for(const path of ['/','/index.html','/offline'])assert.match(await(await a.fetch(path,'navigate')).text(),/rt-app/);
 assert.equal(await(await a.fetch('/assets/app.js')).text(),'asset');for(const p of ['/api/workspace','/release.json','https://elsewhere.test/a.js'])assert.equal((await a.fetch(p)).status,410);
 assert.equal((await a.fetch('/api/workspace','cors','POST')).status,410);a.storage.get('rt-asistent-shell-test1').delete('/assets/app.css');assert.equal((await a.fetch('/assets/app.css')).status,503);assert.equal(requests,0);
 for(const p of ['https://elsewhere.test/manual.pdf'])assert.equal(await a.fetch(p,'navigate'),null);
});
test('offline activation only removes app shell caches and readiness waits for complete install',async()=>{
 const a=harness();await a.caches.open('rt-asistent-shell-old');await a.caches.open('unrelated');await a.lifetime('install');await a.lifetime('activate');assert.equal(a.storage.has('rt-asistent-shell-old'),false);assert.equal(a.storage.has('unrelated'),true);let result,pending;a.handlers.message({data:{type:'STATUS'},ports:[{postMessage:r=>result=r}],waitUntil:p=>pending=p});await pending;assert.equal(result.ready,true);assert.equal(result.version,'test1');
});

test('installed launch uses its downloaded shell and detects evicted offline assets',async()=>{
 const a=harness();await a.lifetime('install');let requests=0;a.setNetwork(async()=>{requests++;return new Response('Login',{status:401});});assert.match(await(await a.fetch('/offline','navigate')).text(),/rt-app/);assert.equal(requests,0);assert.equal((await a.fetch('/','navigate')).status,200);
 a.storage.get('rt-asistent-shell-test1').delete('/assets/app.css');let result,pending;a.handlers.message({data:{type:'STATUS'},ports:[{postMessage:r=>result=r}],waitUntil:p=>pending=p});await pending;assert.equal(result.ready,false);
});

test('only explicit update message contacts release endpoint and rejects login HTML',async()=>{
 const a=harness();await a.lifetime('install');const calls=[];a.setNetwork(async path=>{calls.push(path);return Response.json({version:'0123456789abcdef'});});let result,pending;
 a.handlers.message({data:{type:'CHECK_UPDATE'},ports:[{postMessage:r=>result=r}],waitUntil:p=>pending=p});await pending;assert.deepEqual(calls,['/release.json']);assert.equal(result.version,'0123456789abcdef');
 a.setNetwork(async()=>new Response('<html>Login</html>',{headers:{'Content-Type':'text/html'}}));a.handlers.message({data:{type:'CHECK_UPDATE'},ports:[{postMessage:r=>result=r}],waitUntil:p=>pending=p});await pending;assert.equal(result.type,'UPDATE_ERROR');assert.equal((await a.fetch('/offline','navigate')).status,200);
});
