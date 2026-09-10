const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const Babel = require('../vendor/babel.min.js');
let slots = [], cursor = 0, effects = [], checks = 0, focused = '', calls = [];
const React = {
  useState(initial) { const n=cursor++; if (!(n in slots)) slots[n]=initial; return [slots[n], value=>slots[n]=typeof value==='function'?value(slots[n]):value]; },
  useRef(value) { const n=cursor++; return slots[n]||(slots[n]={current:value}); },
  useEffect(fn) { effects.push(fn); }, useMemo:fn=>fn(),
  createElement:(type,props,...children)=>({type,props:{...props,children:children.flat(Infinity)}}),
};
const ctx = vm.createContext({React,console, window:{location:{}},
  tx:(lang,key)=>lang+':'+key,
  fetch:async (...args)=>{calls.push(args);return {ok:true};},
});
vm.runInContext(Babel.transform(fs.readFileSync(path.join(__dirname,'../player-contact.jsx'),'utf8'),{presets:['react']}).code,ctx);
const walk = n=>n&&typeof n==='object'&&n.props?[n,...n.props.children.flatMap(walk)]:[];
function render(lang='cs') { cursor=0;effects=[];return walk(ctx.ContactForm({lang})); }
function reset() { slots=[];cursor=0;calls=[];focused='';ctx.window.CONTACT_ENDPOINT='https://contact.example.invalid/send';ctx.window.CONTACT_EMAIL='jenda@example.com';ctx.window.location={}; }
const field=(nodes,id)=>nodes.find(n=>n.props.id===id);
function fill(lang='cs') { const nodes=render(lang);for(const [id,value]of[['cf-name','Test'],['cf-email','test@example.invalid'],['cf-msg','A test message']])field(nodes,id).props.onChange({target:{value}});return render(lang); }
const event=()=>({preventDefault(){},currentTarget:{querySelector:id=>({focus(){focused=id;}})}});
const status=nodes=>field(nodes,'cf-status').props.children.join('');
async function check(name, fn) { reset(); await fn();checks++;console.log('PASS',name); }
(async()=>{
  for(const lang of ['cs','en']) await check('Contact '+lang+': linked, announced errors and first invalid focus',async()=>{
    let nodes=render(lang);await nodes.find(n=>n.type==='form').props.onSubmit(event());nodes=render(lang);
    assert.equal(focused,'#cf-name');assert.equal(calls.length,0);
    for(const id of ['cf-name','cf-email','cf-msg']){
      assert.equal(field(nodes,id).props['aria-invalid'],true);
      assert.equal(field(nodes,id).props['aria-describedby'],id+'-error');
      assert.equal(field(nodes,id+'-error').props['aria-live'],'polite');
      assert(field(nodes,id+'-error').props.children.some(Boolean));
    }
    assert.match(status(nodes), lang==='en'?/correct the marked/:/Oprav prosím/);
    assert.equal(field(nodes,'cf-status').props.role,'status');
    field(nodes,'cf-name').props.onChange({target:{value:'Test'}});nodes=render(lang);await nodes.find(n=>n.type==='form').props.onSubmit(event());assert.equal(focused,'#cf-email');
  });
  await check('Contact sending blocks duplicate submissions and freezes fields', async()=>{
    let finish; ctx.fetch=(...args)=>{calls.push(args);return new Promise(resolve=>finish=resolve);};
    const nodes=fill();const submit=nodes.find(n=>n.type==='form').props.onSubmit;
    const pending=submit(event());await submit(event());const busy=render();assert.equal(calls.length,1);
    assert.equal(busy.find(n=>n.type==='form').props['aria-busy'],true);
    assert(busy.filter(n=>['input','textarea','button'].includes(n.type)).every(n=>n.props.disabled));
    finish({ok:true});await pending;const done=render();assert(!done.some(n=>n.type==='form'));
    assert.match(status(done),/contact_ok/);field(done,'cf-status').props.ref.current={focus(){focused='status';}};effects.forEach(fn=>fn());assert.equal(focused,'status');
  });
  for(const lang of ['cs','en']) await check('Contact '+lang+': rejected request preserves content and permits retry',async()=>{
    ctx.fetch=async()=>{calls.push(1);return {ok:false};};let nodes=fill(lang);await nodes.find(n=>n.type==='form').props.onSubmit(event());nodes=render(lang);
    assert.equal(field(nodes,'cf-msg').props.value,'A test message');assert.match(status(nodes),lang==='en'?/not sent/:/nepodařilo odeslat/);
    ctx.fetch=async()=>({ok:true});await nodes.find(n=>n.type==='form').props.onSubmit(event());assert.match(status(render(lang)),/contact_ok/);
  });
  await check('Contact network failure is announced without clearing message',async()=>{
    ctx.fetch=async()=>{throw Error('offline');};const nodes=fill();await nodes.find(n=>n.type==='form').props.onSubmit(event());assert.match(status(render()),/nepodařilo/);assert.equal(field(render(),'cf-msg').props.value,'A test message');
  });
  await check('Contact absent configuration never reports success or opens placeholder email',async()=>{
    ctx.window.CONTACT_ENDPOINT=null;const nodes=fill();await nodes.find(n=>n.type==='form').props.onSubmit(event());assert.match(status(render()),/nedostupný/);assert.equal(ctx.window.location.href,undefined);
  });
  await check('Contact mail handoff truthfully asks user to finish sending',async()=>{
    ctx.window.CONTACT_ENDPOINT=null;ctx.window.CONTACT_EMAIL='contact@example.invalid';const nodes=fill('en');await nodes.find(n=>n.type==='form').props.onSubmit(event());assert.match(ctx.window.location.href,/^mailto:contact@example.invalid/);assert.match(status(render('en')),/cannot confirm/);
  });
  await check('Contact error colors meet 4.5:1 against their opaque backgrounds',()=>{
    const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
    function lum(hex){const rgb=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
    for(const mode of [/:root\s*{([^}]+)}/,/html\[data-mode="light"\]\s*{([^}]+)}/]){
      const css=html.match(mode)[1],bg=css.match(/--bg:\s*#(\w+)/)[1],fg=css.match(/--error:\s*#(\w+)/)[1];
      const values=[lum(bg),lum(fg)].sort((a,b)=>b-a),ratio=(values[0]+.05)/(values[1]+.05);assert(ratio>=4.5);console.log('Contrast #'+fg+' / #'+bg+': '+ratio.toFixed(2)+':1');
    }
    assert.match(html,/\.field-err\s*{[^}]*background: var\(--bg\)/);assert.match(html,/\.contact-status\s*{[^}]*background: var\(--bg\)/);
  });
  console.log(checks+' contact behavior checks passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
