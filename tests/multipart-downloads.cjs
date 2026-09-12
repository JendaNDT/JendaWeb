// Exercise the shipped download controls with real release parts; no network or counters leave this process.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const Babel = require('../vendor/babel.min.js');
const root = path.join(__dirname, '..');
let hooks = [], cursor = 0, rpc = 0, badResponse = false, shortResponse = false;
const saved = [], objects = new Map();
const React = {
  Fragment:'fragment',
  useState(initial) { const i = cursor++; if (!(i in hooks)) hooks[i] = initial; return [hooks[i], value => { hooks[i] = value; }]; },
  useRef(initial) { const i = cursor++; return hooks[i] ||= { current:initial }; },
  useEffect() {}, useCallback:fn => fn,
  createElement:(type, props, ...children) => ({ type, props:{ ...props, children:children.flat(Infinity) } }),
};
const context = vm.createContext({
  React, Blob,
  window:{ __jwSupa:{ url:'https://example.invalid', key:'test' }, APPS_DATA:[], dispatchEvent() {} },
  document:{ body:{ appendChild() {} }, createElement:() => ({ click() { saved.push({ name:this.download, blob:objects.get(this.href) }); }, remove() {} }) },
  URL:{ createObjectURL(blob) { const url = 'blob:test-' + objects.size; objects.set(url, blob); return url; }, revokeObjectURL() {} },
  setTimeout() {}, CustomEvent:class {},
  fetch:async url => {
    if (url.includes('/rpc/')) { rpc++; return { ok:true, json:async () => rpc }; }
    if (badResponse) return { ok:false };
    return { ok:true, blob:async () => new Blob([shortResponse ? 'incomplete' : fs.readFileSync(path.join(root, url))]) };
  },
});
for (const file of ['shared.jsx', 'apps-music.jsx']) {
  vm.runInContext(Babel.transform(fs.readFileSync(path.join(root, file), 'utf8'), { presets:['react'] }).code, context);
}
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), context);
const app = context.window.APPS_DATA.find(a => a.id === 31);
const releaseVersion = app.downloads[0].version;
assert.match(releaseVersion, /^\d+\.\d+\.\d+$/);
assert.ok(app.downloads.every(download => download.version === releaseVersion), 'all controls use the same release');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'binaries', `bomberman-${releaseVersion}`, 'manifest.json')));
assert.equal(manifest.version, releaseVersion);
for (const download of app.downloads) {
  const parts = JSON.parse(download.url);
  const expected = manifest.files.find(file => file.parts[0] === parts[0]);
  assert.ok(expected, 'each control points to an artifact in the release manifest');
  assert.deepEqual(parts, expected.parts, 'the catalog preserves every part in manifest order');
  assert.equal(download.bytes, expected.bytes, 'the catalog validates the complete artifact size');
}
const walk = node => node && typeof node === 'object' ? [node, ...node.props.children.flatMap(walk)] : [];
const render = lang => { cursor = 0; return walk(context.AppDownloads({ app, lang })); };
const controls = lang => render(lang).filter(n => n.type === 'button');
const tick = () => new Promise(resolve => setImmediate(resolve));

(async () => {
  assert.equal(controls('cs').length, 4, 'both primary and secondary packages are offered');
  for (let i = 0; i < app.downloads.length; i++) {
    const nodes = controls(i % 2 ? 'en' : 'cs');
    const before = rpc;
    const download = nodes[i].props.onClick();
    assert.ok(controls('cs').every(n => n.props.disabled), 'all multipart buttons disable during the download');
    assert.match(JSON.stringify(render('en')), /Downloading/);
    await nodes[i].props.onClick(); // Repeat activation before React rerenders must be ignored.
    await download; await tick();
    assert.equal(rpc, before + 1, 'one counter event per file, even after a rapid repeat click');
    const result = saved.pop();
    const expected = manifest.files.find(f => f.name === result.name);
    assert.ok(expected, 'the saved filename is an original installer/archive, without a part suffix');
    assert.equal(result.blob.size, expected.bytes);
    assert.equal(createHash('sha256').update(Buffer.from(await result.blob.arrayBuffer())).digest('hex'), expected.sha256);
    assert.ok(controls('cs').every(n => !n.props.disabled), 'successful completion re-enables downloads');
    objects.clear();
  }
  for (const mode of ['http', 'truncated']) {
    badResponse = mode === 'http'; shortResponse = mode === 'truncated';
    await controls('en')[0].props.onClick();
    assert.equal(saved.length, 0, 'a failed or truncated response never saves a broken installer');
    assert.match(JSON.stringify(render('cs')), /Stažení se nepodařilo/);
    assert.match(JSON.stringify(render('en')), /Download failed/);
    assert.ok(controls('en').every(n => !n.props.disabled), 'failure permits retry');
  }
  badResponse = shortResponse = false;
  await controls('cs')[2].props.onClick();
  assert.equal(saved.length, 1, 'retry after failure succeeds');
  assert.doesNotMatch(JSON.stringify(render('en')), /Download failed/);
  for (const input of ['[]', '["javascript:alert(1)"]', '["//example.invalid/file.exe.part0"]', '[broken']) {
    assert.equal(context.downloadParts(input), null, 'invalid multipart lists are rejected');
  }
  console.log('Multipart downloads passed: all four real artifact hashes, filenames, primary/secondary controls, cs/en progress/errors, repeat-click guard, failed/truncated responses and retry.');
})().catch(error => { console.error(error); process.exitCode = 1; });
