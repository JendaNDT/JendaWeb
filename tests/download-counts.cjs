// Exercise the shipped components and handlers; no requests leave this process.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const Babel = require('../vendor/babel.min.js');
const root = path.join(__dirname, '..');
const calls = [], files = [], events = [], opened = [];
let rpcFailure = false, serverCount = 0;
const React = {
  useState: initial => [typeof initial === 'function' ? initial() : initial, () => {}],
  useRef: current => ({ current }), useCallback: fn => fn, useEffect() {},
  createElement: (type, props, ...children) => ({ type, props:{ ...props, children:children.flat(Infinity) } }),
};
const window = {
  __jwSupa:{ url:'https://example.invalid', key:'public-test-key' }, APPS_DATA:[],
  dispatchEvent: event => events.push(event), isItemLiked: () => false,
  open: url => opened.push(url),
};
const document = {
  documentElement:{ classList:{ contains:() => false } },
  body:{ appendChild() {} },
  createElement: () => ({ click() { files.push(this.href); }, remove() {} }),
};
const context = vm.createContext({
  React, window, document, Blob, URL, setTimeout,
  CustomEvent:class { constructor(type, options) { this.type = type; Object.assign(this, options); } },
  fetch:async (url, options) => {
    calls.push({ url, options });
    if (url.includes('/rpc/')) {
      if (rpcFailure) throw new Error('Simulated counter outage');
      return { ok:true, json:async () => ++serverCount };
    }
    return { ok:true, blob:async () => new Blob(['file fragment']) };
  },
});
for (const file of ['shared.jsx', 'apps-music.jsx']) {
  vm.runInContext(Babel.transform(fs.readFileSync(path.join(root, file), 'utf8'), { presets:['react'] }).code, context);
}
const walk = node => node && typeof node === 'object' ? [node, ...node.props.children.flatMap(walk)] : [];
const tick = () => new Promise(resolve => setImmediate(resolve));
const rpcCalls = () => calls.filter(c => c.url.includes('/rpc/'));
const basic = { id:42, name:'Test app', platform:'Android', link:'/binaries/test.apk', cs:'Test', en:'Test', screenshots:[] };
const variant = { ...basic, platform:'Windows / macOS', link:'/binaries/test.exe', downloads:[
  { url:'/binaries/test.exe', primary:true, label_en:'Windows' },
  { url:'/binaries/test.dmg', primary:true, label_en:'Mac' },
  { url:'/binaries/test.zip', primary:false, label_en:'ZIP' },
] };
function renderModal(app) { return walk(context.AppDetailModal({ app, lang:'en', onClose() {}, onShare() {} })); }
function launch(nodes) { return nodes.find(n => n.type === 'button' && n.props.onClick?.name === 'handleLaunch').props.onClick({ stopPropagation() {} }); }

(async () => {
  const card = walk(context.AppCard({ app:variant, lang:'en', onOpen:() => renderModal(variant) }));
  assert.equal(card.filter(n => n.type === 'a').length, 1, 'small card has only its detail link');
  card.find(n => n.type === 'a').props.onClick({ button:0, preventDefault() {}, currentTarget:{ closest() {} } });
  await tick();
  assert.equal(rpcCalls().length, 0, 'opening a detail does not count a download');

  window.APPS_DATA = [variant];
  const anchors = walk(context.AppDownloads({ app:variant, lang:'en' })).filter(n => n.type === 'a');
  for (let i = 0; i < anchors.length; i++) {
    assert.equal(anchors[i].props.href, variant.downloads[i].url);
    assert.equal(anchors[i].props.download, true, 'native download remains available');
    anchors[i].props.onClick();
    await tick();
    assert.equal(rpcCalls().length, i + 1, 'one RPC per primary/secondary variant activation');
    assert.equal(JSON.parse(rpcCalls()[i].options.body).p_download_url, variant.downloads[i].url);
  }
  assert.equal(variant.download_count, 3, 'all variants update the same app total');
  assert.equal(events.at(-1).detail.count, 3);

  await launch(renderModal(basic)); await tick();
  assert.equal(rpcCalls().length, 4, 'legacy APK button records once');
  assert.equal(files.at(-1), basic.link, 'APK navigation still starts');
  const chunked = { ...basic, link:'["/binaries/test.apk.part1","/binaries/test.apk.part2"]' };
  await launch(renderModal(chunked)); await tick();
  assert.equal(rpcCalls().length, 5, 'multipart file counts once, not per fragment');
  assert.equal(calls.filter(c => !c.url.includes('/rpc/')).length, 2, 'both file fragments still load');
  assert.match(files.at(-1), /^blob:/);

  rpcFailure = true;
  const beforeFiles = files.length;
  await launch(renderModal(basic)); await tick();
  assert.equal(files.length, beforeFiles + 1, 'counter outage does not stop the download');
  assert.equal(rpcCalls().length, 6, 'failed counter is not retried');
  assert.equal(events.length, 5, 'failure does not invent a successful count');

  const pwa = { ...basic, platform:'PWA', link:'https://example.invalid/app' };
  await launch(renderModal(pwa)); await tick();
  assert.equal(opened.at(-1), pwa.link);
  assert.equal(rpcCalls().length, 6, 'opening a PWA never counts');
  assert.equal(context.AppDownloadCount({ app:pwa, lang:'cs' }), null, 'PWA has no download metric');
  assert.equal(context.AppDownloadCount({ app:{ ...basic, link:'#' }, lang:'cs' }), null, 'unpublished app has no metric');
  assert.match(JSON.stringify(context.AppDownloadCount({ app:basic, lang:'en' })), /—/, 'missing data is not a fabricated zero');
  console.log('Download checks passed: detail-only links, per-variant totals, APK/multipart once, persisted-response display, failure isolation, PWA exclusion.');
})().catch(error => { console.error(error); process.exitCode = 1; });
