// Exercise the real gallery handlers without a browser or a React render loop.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const Babel = require('../vendor/babel.min.js');
let slots = [], cursor = 0;
const React = {
  useState(initial) {
    const id = cursor++;
    if (!(id in slots)) slots[id] = typeof initial === 'function' ? initial() : initial;
    return [slots[id], value => { slots[id] = typeof value === 'function' ? value(slots[id]) : value; }];
  },
  useRef(initial) { const id = cursor++; return slots[id] || (slots[id] = { current:initial }); },
  useCallback:fn => fn,
  useEffect() {},
  createElement:(type, props, ...children) => ({ type, props:{ ...props, children:children.flat(Infinity) } }),
};
const context = vm.createContext({ React, ReactDOM:{ createPortal:node => node }, document:{ body:{} } });
vm.runInContext(Babel.transform(fs.readFileSync(path.join(__dirname, '../gallery.jsx'), 'utf8'), { presets:['react'] }).code, context);
const captured = new Set();
const surface = {
  clientWidth:300, clientHeight:500,
  getBoundingClientRect:() => ({ left:0, top:0, width:300, height:500 }),
  setPointerCapture:id => captured.add(id), hasPointerCapture:id => captured.has(id), releasePointerCapture:id => captured.delete(id),
};
const walk = node => node && typeof node === 'object' ? [node, ...node.props.children.flatMap(walk)] : [];
let nodes;
function render() {
  cursor = 0;
  nodes = walk(context.ScreenshotGallery({ images:['one.png','two.png','three.png'], initialIndex:0, title:'Test', lang:'en', onClose() {} }));
  for (const node of nodes) {
    if (node.props.ref && node.props.className?.startsWith('gallery-stage')) node.props.ref.current = surface;
    if (node.props.ref && node.type === 'img') node.props.ref.current = { offsetWidth:300, offsetHeight:400 };
  }
}
const stage = () => nodes.find(n => n.props.className?.startsWith('gallery-stage'));
const image = () => nodes.find(n => n.type === 'img' && n.props.ref);
const button = label => nodes.find(n => n.props['aria-label'] === label);
function pointer(type, id, x, y) {
  const event = { type, pointerId:id, pointerType:'touch', button:0, clientX:x, clientY:y, currentTarget:surface };
  const handlers = { pointerdown:'onPointerDown', pointermove:'onPointerMove', pointerup:'onPointerUp', pointercancel:'onPointerCancel', lostpointercapture:'onLostPointerCapture' };
  stage().props[handlers[type]](event); render();
}
render();
pointer('pointerdown', 1, 250, 250); pointer('pointerup', 1, 50, 250);
assert.equal(image().props.src, 'two.png', 'horizontal swipe advances');
pointer('pointerdown', 1, 150, 100); pointer('pointerup', 1, 140, 400);
assert.equal(image().props.src, 'two.png', 'vertical gesture does not advance');
pointer('pointerdown', 1, 250, 250); pointer('pointercancel', 1, 50, 250);
assert.equal(image().props.src, 'two.png', 'cancelled gesture does not advance');
pointer('pointerdown', 1, 100, 250); pointer('pointerdown', 2, 200, 250);
pointer('pointermove', 2, 300, 250);
assert.match(image().props.style.transform, /scale\(2\)$/, 'two fingers zoom the image');
pointer('pointermove', 2, 200, 250);
pointer('pointerup', 2, 200, 250); pointer('pointerup', 1, 0, 250);
assert.equal(image().props.src, 'two.png', 'finishing a pinch at fit size does not become a swipe');
button('Zoom in').props.onClick(); render(); button('Zoom in').props.onClick(); render();
pointer('pointerdown', 1, 150, 250); pointer('pointermove', 1, 1000, 1000); pointer('pointerup', 1, 1000, 1000);
assert.equal(image().props.src, 'two.png', 'dragging a zoomed image does not browse');
assert.equal(image().props.style.transform, 'translate(150px, 150px) scale(2)', 'pan stops at the image edges');
button('Next screenshot').props.onClick(); render();
assert.equal(image().props.src, 'three.png');
assert.equal(image().props.style.transform, 'translate(0px, 0px) scale(1)', 'browsing resets zoom and pan');
pointer('pointerdown', 1, 200, 250); pointer('lostpointercapture', 1, 100, 250);
assert.equal(captured.size, 0, 'lost capture cleans up the gesture');
assert.equal(image().props.src, 'three.png', 'lost capture does not browse');
console.log('Gallery gesture checks passed: swipe, vertical/cancel, pinch, pan bounds, reset, lost capture.');
