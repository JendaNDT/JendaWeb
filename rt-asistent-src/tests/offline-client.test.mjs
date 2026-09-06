import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {initOffline} from '../src/offline.js';
function setup(existing=true,base="/",parent=false){
 const dom=new JSDOM('<meta name="rt-build" content="0123456789abcdef"><p id="offline-status"></p><p id="offline-detail"></p><button id="offline-check"></button><button id="offline-update"></button><p id="offline-update-status"></p>',{url:'https://test.invalid'}),w=dom.window;
 const meta=w.document.createElement('meta');meta.name='rt-base';meta.content=base;w.document.head.append(meta);
 const calls=[];let installed=existing;const sw=new w.EventTarget();sw.controller=existing?{postMessage(message,ports){calls.push(message.type);ports[0].peer.onmessage({data:{type:'OFFLINE_READY',ready:true,version:'0123456789abcdef',localOnly:true}});}}:null;
 const reg=new w.EventTarget();reg.scope='https://test.invalid'+(parent?'/':base);reg.active={scriptURL:'https://test.invalid'+(parent?'/sw.js':base+'offline-worker/0123456789abcdef.js')};
 sw.getRegistration=async()=>{calls.push('getRegistration');return installed?reg:undefined;};sw.register=async(path)=>{calls.push(path);installed=true;return reg;};
 Object.defineProperty(w.navigator,'serviceWorker',{value:sw});w.MessageChannel=class{constructor(){this.port1={close(){}};this.port2={peer:this.port1};}};
 const app=initOffline({window:w});return {w,calls,app,close(){app.destroy();w.close();}};
}
test('installed startup and readiness button only query local browser state',async()=>{
 const a=setup();await new Promise(r=>setTimeout(r,0));a.w.document.getElementById('offline-check').click();await new Promise(r=>setTimeout(r,0));assert.ok(a.calls.includes('getRegistration'));assert.ok(a.calls.includes('STATUS'));assert.ok(a.calls.every(c=>['getRegistration','STATUS'].includes(c)));a.close();
});
test('first acquisition registers the immutable worker URL once',async()=>{
 const a=setup(false);await new Promise(r=>setTimeout(r,0));assert.deepEqual(a.calls,['getRegistration','/offline-worker/0123456789abcdef.js']);a.close();
});

test('subdirectory startup replaces a parent portfolio registration with the correct scope',async()=>{
 const a=setup(true,'/rt-asistent/',true);await new Promise(r=>setTimeout(r,0));assert.ok(a.calls.includes('/rt-asistent/offline-worker/0123456789abcdef.js'));a.close();
 const b=setup(true,'/rt-asistent/');await new Promise(r=>setTimeout(r,0));assert.ok(b.calls.every(c=>['getRegistration','STATUS'].includes(c)));b.close();
});
