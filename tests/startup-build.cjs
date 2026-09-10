const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const {outputs, build} = require('../build_site.cjs');
let checks=0;
async function check(name, fn) { await fn(); checks++; console.log('PASS',name); }
function boot(lang='cs', denied=false) {
  const nodes=Object.fromEntries(['boot-status','boot-message','boot-retry'].map(id=>[id,{hidden:id==='boot-retry',textContent:'',addEventListener(type,fn){this[type]=fn;}}]));
  const listeners={};let timer,clearCount=0,reloads=0;
  const storage={jw_lang:lang,jw_jsx_version:'jw-v108','jw_jsx_cache_combined.jsx':'old code',jw_theme:'ember',jw_likes:'kept',jw_offline_albums:'kept'};
  Object.defineProperties(storage,{getItem:{value:key=>{if(denied)throw Error('storage blocked');return storage[key];}},removeItem:{value:key=>delete storage[key]}});
  const window={location:{hash:'#app=bomberman',reload(){reloads++;}},addEventListener:(type,fn)=>listeners[type]=fn,removeEventListener:type=>delete listeners[type]};
  vm.runInNewContext(read('boot.js'), {window, document:{getElementById:id=>nodes[id]}, localStorage:storage, setTimeout:fn=>(timer=fn,1), clearTimeout:()=>clearCount++});
  return {nodes,window,storage,listeners,timeout:()=>timer(),reloads:()=>reloads,clearCount:()=>clearCount};
}
function worker({precacheFail=false,networkFail=false,status=200}={}) {
  const handlers={},puts=[],deletes=[],added=[],order=[];let respond, waiting=[],skip=0,claim=0;
  const cached={kind:'cached'}, response={ok:status===200,status,clone:()=>({kind:'copy'})};
  const store={async addAll(urls){added.push(...urls);order.push('precache');if(precacheFail)throw Error('missing asset');},async put(...args){puts.push(args);}};
  const caches={open:async()=>store,keys:async()=>['jw-v108','rt-asistent-v1','other-app-cache','jw-offline-albums',version],delete:async key=>(deletes.push(key),true),match:async req=>req==='/index.html'?cached:undefined};
  const self={addEventListener:(key,fn)=>handlers[key]=fn,skipWaiting:async()=>{skip++;order.push('skip');},clients:{claim:async()=>{claim++;order.push('claim');}}};
  const ctx=vm.createContext({self,caches,location:{origin:'https://jenda.cool'},URL,fetch:async()=>{if(networkFail)throw Error('offline');return response;}});
  vm.runInContext(read('sw.js'),ctx);const version=vm.runInContext('VERSION',ctx),shell=vm.runInContext('SHELL',ctx);
  function event(type,request) { waiting=[];respond=undefined;handlers[type]({request,waitUntil:p=>waiting.push(p),respondWith:p=>respond=p});return {done:()=>Promise.all(waiting),response:()=>respond}; }
  return {event,puts,deletes,added,order,skip:()=>skip,claim:()=>claim,version,shell,cached,response};
}
const request=(pathname='/',html=true)=>({method:'GET',url:'https://jenda.cool'+pathname,mode:html?'navigate':'cors',headers:{get:()=>html?'text/html':'*/*'}});
(async()=>{
  await check('Build is deterministic and checked-in outputs match',()=>{
    assert.deepEqual(outputs(),outputs());assert.doesNotThrow(()=>build(true));
  });
  await check('Stale HTML fails the publication check and changes the release fingerprint',()=>{
    const fakeFS={...fs,readFileSync(file,...args){const value=fs.readFileSync(file,...args);return file===path.join(root,'index.html')?value+'\n<!-- changed HTML fixture -->':value;}};
    const mod={exports:{}};
    vm.runInNewContext(read('build_site.cjs'),{require:name=>name==='node:fs'?fakeFS:require(name==='./vendor/babel.min.js'?'../vendor/babel.min.js':name),module:mod,__dirname:root,console,process});
    const changed=mod.exports.outputs();assert.notEqual(changed['sw.js'],read('sw.js'));
    assert.throws(()=>mod.exports.build(true),/Stale build output/);
  });
  await check('Production JavaScript parses without JSX or a client compiler',()=>{
    const result=outputs();for(const [name,content] of Object.entries(result))if(name.endsWith('.js'))new vm.Script(content,{filename:name});
    const html=result['index.html'];assert(!/babel\.min|Babel\.transform|combined\.jsx|jw_jsx_cache_.*getItem/.test(html));
    const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"[^>]*data-jw-required/g)].map(m=>m[1]);assert.equal(scripts.length,5);
    assert(scripts[2].includes('/data.'));assert(scripts[3].includes('/supabase-data.'));assert(scripts[4].includes('/app.'));
    assert(html.includes('id="boot-retry"'));assert(html.includes('<noscript>'));assert(html.includes('id="tracks"'));assert(html.includes('id="apps"'));
  });
  await check('HTML and worker share every fingerprinted asset and release',()=>{
    const html=read('index.html');const w=worker();assert(html.includes(w.version));
    const urls=[...html.matchAll(/src="(\/site-assets\/[^\"]+)"/g)].map(m=>m[1]);assert.equal(urls.length,3);
    urls.forEach(url=>{assert(w.shell.includes(url));assert(fs.existsSync(path.join(root,url)));});
    assert(!w.shell.some(url=>/babel|combined\.jsx/.test(url)));
  });
  for(const lang of ['cs','en']) await check('Startup '+lang+': failed script offers retry without clearing user state',()=>{
    const b=boot(lang);b.listeners.error({target:{hasAttribute:key=>key==='data-jw-required'}});
    assert.equal(b.nodes['boot-status'].hidden,false);assert.equal(b.nodes['boot-retry'].hidden,false);
    assert.match(b.nodes['boot-message'].textContent,lang==='en'?/could not finish/:/nepodařilo načíst/);
    b.nodes['boot-retry'].click();assert.equal(b.reloads(),1);assert.equal(b.window.location.hash,'#app=bomberman');assert.equal(b.storage.jw_likes,'kept');assert.equal(b.storage.jw_jsx_version,'jw-v108');
  });
  await check('Startup runtime error is visible; unrelated image failure is ignored',()=>{
    const b=boot();b.listeners.error({target:{hasAttribute:()=>false}});assert(b.nodes['boot-retry'].hidden);b.listeners.error({target:b.window});assert(!b.nodes['boot-retry'].hidden);
  });
  await check('Slow startup can recover and removes the failure panel',()=>{
    const b=boot();b.timeout();assert(!b.nodes['boot-retry'].hidden);b.window.__jwAppReady();assert(b.nodes['boot-status'].hidden);assert(!b.listeners.error);assert(b.clearCount()>0);
    b.timeout();assert(b.nodes['boot-status'].hidden);
  });
  await check('Successful startup removes only old compiler keys',()=>{
    const b=boot();b.window.__jwAppReady();assert(!Object.hasOwn(b.storage,'jw_jsx_version'));assert(!Object.hasOwn(b.storage,'jw_jsx_cache_combined.jsx'));
    for(const key of ['jw_lang','jw_theme','jw_likes','jw_offline_albums'])assert(Object.hasOwn(b.storage,key));
  });
  await check('Storage refusal does not break startup or successful completion',()=>{
    const b=boot('en',true);assert.doesNotThrow(()=>b.window.__jwAppReady());assert(b.nodes['boot-status'].hidden);
  });
  await check('React boundary can surface a render failure even after first mount',()=>{
    const b=boot();b.window.__jwAppReady();b.window.__jwBootFailed();assert(!b.nodes['boot-status'].hidden);assert(!b.nodes['boot-retry'].hidden);
    assert.match(read('app.jsx'),/componentDidCatch\(error\).*__jwBootFailed/);assert.match(read('app.jsx'),/render\(<StartupBoundary><Root \/><\/StartupBoundary>\)/);
  });
  await check('Failed PWA precache rejects installation without activation',async()=>{
    const w=worker({precacheFail:true});await assert.rejects(w.event('install').done(),/missing asset/);assert.equal(w.skip(),0);assert.equal(w.deletes.length,0);
  });
  await check('Complete PWA precache precedes activation',async()=>{
    const w=worker();await w.event('install').done();assert.equal(w.skip(),1);assert.deepEqual(w.order,['precache','skip']);assert.equal(w.added.length,w.shell.length);
  });
  await check('PWA activation preserves unrelated and offline-album caches',async()=>{
    const w=worker();await w.event('activate').done();assert.deepEqual(w.deletes,['jw-v108']);assert.equal(w.claim(),1);
  });
  for(const mode of ['offline','http-error'])await check('PWA '+mode+': use cached HTML, never cache a failed response',async()=>{
    const w=worker(mode==='offline'?{networkFail:true}:{status:500});const e=w.event('fetch',request());assert.equal(await e.response(),w.cached);await e.done();assert.equal(w.puts.length,0);
  });
  await check('PWA online navigation refreshes HTML cache',async()=>{
    const w=worker(),e=w.event('fetch',request());assert.equal(await e.response(),w.response);await e.done();assert.equal(w.puts.length,1);
  });
  await check('PWA never intercepts installers or RT Asistent scope',()=>{
    const w=worker();for(const url of ['/binaries/test.apk','/rt-asistent','/rt-asistent/example.js'])assert.equal(w.event('fetch',request(url,false)).response(),undefined);
  });
  await check('Versioned assets use immutable caching and publication runs the build',()=>{
    const config=JSON.parse(read('vercel.json'));assert.equal(config.buildCommand,'node build_site.cjs');assert.equal(config.outputDirectory,'.');
    assert(config.headers.find(rule=>rule.source==='/site-assets/(.*)').headers.some(h=>h.value.includes('immutable')));
    assert(config.headers.find(rule=>rule.source==='/sw.js').headers.some(h=>h.value.includes('no-store')));
  });
  console.log(checks+' startup/build/cache checks passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
