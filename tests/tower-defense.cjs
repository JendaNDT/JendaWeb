const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const root=path.join(__dirname,'..'),dir=path.join(root,'tower-defense/releases/1.0.0-web.1'),manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json')));
let bytes=0;
for(const f of manifest.files){const data=fs.readFileSync(path.join(dir,f.file));assert.equal(data.length,f.bytes,f.file);assert.equal(crypto.createHash('sha256').update(data).digest('hex'),f.sha256,f.file);bytes+=data.length;}
for(const need of ['index.html','index.js','index.pck','index.wasm.gz','index.audio.worklet.js','index.audio.position.worklet.js','index.apple-touch-icon.png'])assert(manifest.files.some(f=>f.file===need),need);
const wasm=zlib.gunzipSync(fs.readFileSync(path.join(dir,'index.wasm.gz')));assert.equal(wasm.subarray(0,4).toString('hex'),'0061736d');assert.equal(wasm.length,manifest.wasm_bytes);assert.equal(crypto.createHash('sha256').update(wasm).digest('hex'),manifest.wasm_sha256);
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');assert.equal(fs.readFileSync(path.join(root,'tower-defense/index.html'),'utf8'),html);
assert(html.includes('<base href="/tower-defense/releases/1.0.0-web.1/">'));
assert(html.includes('"persistentPaths":["/userfs/OstrovVOblacich"]'),'oddělené trvalé úložiště (jinak by se hra dělila o databázi /userfs s Lost Signal)');
assert(!html.includes('"threads":true')&&html.includes('"executable":"index"'));
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json')));
for(const [src,dst] of [['/tower-defense/','/tower-defense/releases/1.0.0-web.1/index.html'],['/tower-defense/index.html','/tower-defense/releases/1.0.0-web.1/index.html']])assert(config.rewrites.some(x=>x.source===src&&x.destination===dst),src);
assert(config.rewrites.some(x=>x.source==='/tower-defense/releases/:version/index.wasm'&&x.destination.endsWith('.wasm.gz')));
assert(config.redirects.some(x=>x.source==='/tower-defense'&&x.destination==='/tower-defense/'));
for(const s of ['/tower-defense/releases/:version/index.wasm','/tower-defense/releases/:version/index.wasm.gz']){const h=config.headers.find(x=>x.source===s).headers;assert(h.some(x=>x.key==='Content-Encoding'&&x.value==='gzip'));assert(h.some(x=>x.key==='Content-Type'&&x.value==='application/wasm'));}
assert(config.headers.find(x=>x.source==='/tower-defense/releases/:path*').headers.some(x=>x.key==='Cache-Control'&&x.value.includes('immutable')));
assert(config.headers.find(x=>x.source==='/tower-defense/').headers.some(x=>x.key==='Cache-Control'&&x.value.includes('must-revalidate')));
const row=JSON.parse(fs.readFileSync(path.join(root,'tower-defense/catalog.json')));assert.equal(row.link,'/tower-defense/');assert.equal(row.platform,'Web');
for(const f of [row.icon_url,...row.screenshots])assert(fs.existsSync(path.join(root,f)),f);
const data=fs.readFileSync(path.join(root,'data.js'),'utf8');assert(data.includes('"id": '+row.id+', "name": "'+row.name+'"'),'řádek v data.js');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');assert(sw.includes("'/tower-defense'")&&sw.includes("startsWith('/tower-defense/')"),'service worker hru nekešuje');
console.log(`Tower Defense: ${manifest.files.length} souborů / ${bytes} bajtů ověřeno hashi, gzip WASM ${wasm.length} bajtů, vstupní stránka, MIME/kódování, katalog a service worker ověřeny.`);
