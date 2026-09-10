const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Babel=require('../vendor/babel.min.js');
let slots=[],cursor=0,effects=[],listeners={},checks=0;
const React={
 useState(initial){const n=cursor++;if(!(n in slots))slots[n]=typeof initial==='function'?initial():initial;return[slots[n],v=>slots[n]=typeof v==='function'?v(slots[n]):v]},
 useRef(initial){const n=cursor++;return slots[n]||(slots[n]={current:initial})},
 useMemo:fn=>fn(),useCallback:fn=>fn,useEffect:fn=>effects.push(fn),
 createElement:(type,props,...children)=>({type,props:{...props,children:children.flat(Infinity)}}),
};
const storage=new Map();
const context=vm.createContext({React,ReactDOM:{createPortal:x=>x},URL,Number,Math,Set,Map,console,
 navigator:{onLine:true,userAgent:'QA'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
 document:{querySelector:()=>null,body:{style:{}},documentElement:{classList:{contains:()=>false}}},
 window:{addEventListener:(k,fn)=>(listeners[k]||=[]).push(fn),removeEventListener(){},dispatchEvent(){},matchMedia:()=>({matches:false}),STRINGS:{},location:{hash:''}},
 CustomEvent:function(type,args){this.type=type;this.detail=args?.detail},setTimeout(){},clearTimeout(){},setInterval(){},clearInterval(){},
});
for(const file of ['shared.jsx','apps-music.jsx','player-contact.jsx','player-expand.jsx','extras.jsx'])vm.runInContext(Babel.transform(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{presets:['react']}).code,context);
vm.runInContext('useInView=()=>[null,true]',context);
const walk=n=>n&&typeof n==='object'&&n.props?[n,...n.props.children.flatMap(walk)]:[];
function render(fn,props){cursor=0;effects=[];return walk(context[fn](props))}
function reset(){slots=[];cursor=0;effects=[];listeners={}}
function check(name,fn){fn();checks++;console.log('PASS',name)}
function event(key,target={}){return {key,code:key===' '?'Space':key,target,preventDefault(){this.defaultPrevented=true},stopPropagation(){this.stopped=true}}}
const track={id:1,title:'Celtic Awakening',duration:'0:30',audioUrl:'fixture.wav',downloadUrl:'fixture.wav',plays:116};
const album={id:1,title:'Celtic Code'};
context.window.TRACKS_DATA=[track];context.window.ALBUMS=[album];
let played=0,toggled=0,liked=0;
context.window.isItemLiked=()=>false;context.window.toggleLikedItem=()=>true;context.window.apiToggleLike=()=>liked++;
check('Track: separate native play / Like / download controls',()=>{
 reset();const nodes=render('TrackRow',{track,album,idx:0,active:false,playing:false,onPlay:()=>played++,onToggle:()=>toggled++,lang:'cs'});
 const p=nodes.find(n=>n.props.className==='track-play');assert.equal(p.type,'button');assert.equal(p.props['aria-label'],'Přehrát: Celtic Awakening');
 assert(!walk(p).slice(1).some(n=>['button','a'].includes(n.type)));
 p.props.onClick();assert.equal(played,1);assert.equal(toggled,0);
 const like=nodes.find(n=>n.props['aria-label']==='Líbí se mi: Celtic Awakening');like.props.onClick({stopPropagation(){}});assert.equal(liked,1);assert.equal(played,1);
 assert(nodes.find(n=>n.type==='a'&&n.props['aria-label']==='Stáhnout: Celtic Awakening'));
});
check('Active track toggles pause/resume without restarting playback',()=>{
 reset();let nodes=render('TrackRow',{track,album,idx:0,active:true,playing:true,onPlay:()=>played++,onToggle:()=>toggled++,lang:'en'});
 nodes.find(n=>n.props.className==='track-play').props.onClick();assert.equal(played,1);assert.equal(toggled,1);assert(nodes.find(n=>n.props['aria-label']==='Pause: Celtic Awakening'));
 nodes=render('TrackRow',{track,album,idx:0,active:true,playing:false,onPlay:()=>played++,onToggle:()=>toggled++,lang:'en'});assert(nodes.find(n=>n.props['aria-label']==='Play: Celtic Awakening'));
});
for(const [key,expected] of [['ArrowLeft',7],['ArrowRight',17],['ArrowDown',7],['ArrowUp',17],['Home',0],['End',30],['PageDown',9],['PageUp',15]])check('Seek '+key,()=>{
 let value;const props=context.seekSliderProps(12,30,v=>value=v,'cs');const e=event(key);props.onKeyDown(e);assert.equal(value,expected);assert(e.defaultPrevented&&e.stopped);assert.equal(props.tabIndex,0);assert.equal(props['aria-valuetext'],'0:12 z 0:30');
});
check('Seek clamps boundaries and ignores unknown duration/modifier shortcuts',()=>{
 let values=[];context.seekSliderProps(2,30,v=>values.push(v),'en').onKeyDown(event('ArrowLeft'));
 context.seekSliderProps(29,30,v=>values.push(v),'en').onKeyDown(event('ArrowRight'));assert.deepEqual(values,[0,30]);
 const disabled=context.seekSliderProps(0,Infinity,v=>values.push(v),'en');disabled.onKeyDown(event('End'));assert.equal(disabled.tabIndex,-1);assert.equal(values.length,2);
 const e=event('ArrowRight');e.ctrlKey=true;context.seekSliderProps(2,30,v=>values.push(v),'en').onKeyDown(e);assert(!e.defaultPrevented);assert.equal(values.length,2);
});
const playerProps={track,album,playlist:[track],isPlaying:false,setIsPlaying:v=>toggled++,onPrev:()=>played++,onNext:()=>played++,getNext:()=>null,onClose(){},initialPosition:0,restoring:false,shuffle:false,setShuffle(){},repeat:'off',setRepeat(){},onShare(){},lang:'cs',expanded:false,setExpanded(){}};
check('Global Space leaves native controls alone and preserves body shortcut',()=>{
 reset();render('AudioPlayer',playerProps);effects.filter(fn=>fn.toString().includes("'keydown'")).forEach(fn=>fn());
 const handler=listeners.keydown[0];assert(handler);const before=toggled;handler(event(' ',{closest:()=>({})}));assert.equal(toggled,before);
 const e=event(' ',{closest:()=>null});handler(e);assert.equal(toggled,before+1);assert(e.defaultPrevented);
});
for(const mode of ['bars','mirror','radial'])check('Expanded '+mode+' exposes the same keyboard slider',()=>{
 reset();const nodes=render('ExpandMode',{...playerProps,currentTime:12,duration:30,progress:.4,bars:[.2,.4],fft:null,liked:false,likeCount:0,onLike(){},onSeekTo(){},vizMode:mode,setVizMode(){},vol:.8,setVol(){},muted:false,setMuted(){},setLoopA(){},setLoopB(){},handlePointerDown(){},handlePointerMove(){},handlePointerUp(){},isDraggingRef:{current:false}});
 const slider=nodes.find(n=>n.props.role==='slider');assert(slider);assert.equal(slider.props.tabIndex,0);assert.equal(slider.props['aria-valuemax'],30);assert.equal(slider.props['aria-label'],'Pozice ve skladbě');
});
check('Expanded volume ArrowDown does not collapse the player',()=>{
 reset();let closed=0;render('ExpandMode',{...playerProps,onClose:()=>closed++,currentTime:12,duration:30,progress:.4,bars:[],fft:null,liked:false,likeCount:0,onLike(){},onSeekTo(){},vizMode:'bars',vol:.8});
 effects.filter(fn=>fn.toString().includes("'keydown'")).forEach(fn=>fn());const fn=listeners.keydown[0];fn(event('ArrowDown',{closest:()=>({})}));assert.equal(closed,0);fn(event('Escape',{closest:()=>null}));assert.equal(closed,1);
});
check('Newsletter accepts only the configured Buttondown form route',()=>{
 for(const v of [null,'','javascript:alert(1)','https://example.com/form','http://buttondown.com/api/emails/embed-subscribe/svatos','https://buttondown.com.evil.test/api/emails/embed-subscribe/svatos','https://evil@buttondown.com/api/emails/embed-subscribe/svatos'])assert.equal(context.newsletterFormEndpoint(v),'');
 assert.equal(context.newsletterFormEndpoint('https://buttondown.email/api/emails/embed-subscribe/svatos'),'https://buttondown.com/api/emails/embed-subscribe/svatos');
});
function newsletter(){return render('NewsletterSection',{lang:'cs'})}
check('Missing newsletter configuration shows unavailable; no false success or form',()=>{
 reset();context.window.NEWSLETTER_ENDPOINT=null;const nodes=newsletter();assert(!nodes.some(n=>n.type==='form'));assert(nodes.some(n=>n.props.role==='status'&&n.props.children.join('').includes('nedostupný')));
});
check('Invalid email prevents submission and gives associated message',()=>{
 reset();context.window.NEWSLETTER_ENDPOINT='https://buttondown.com/api/emails/embed-subscribe/svatos';let nodes=newsletter();nodes.find(n=>n.props.id==='nl-email').props.onChange({target:{value:'invalid'}});nodes=newsletter();let focused=false;const e=event('submit');e.currentTarget={elements:{email:{focus(){focused=true}}}};nodes.find(n=>n.type==='form').props.onSubmit(e);nodes=newsletter();assert(e.defaultPrevented&&focused);assert.equal(nodes.find(n=>n.props.id==='nl-email').props['aria-invalid'],true);assert(nodes.find(n=>n.props.id==='nl-status').props.children.join('').includes('platnou'));
});
check('Offline submit is rejected locally and can be retried',()=>{
 reset();let nodes=newsletter();nodes.find(n=>n.props.id==='nl-email').props.onChange({target:{value:'test@example.invalid'}});nodes=newsletter();context.navigator.onLine=false;const e=event('submit');nodes.find(n=>n.type==='form').props.onSubmit(e);assert(e.defaultPrevented);assert(newsletter().find(n=>n.props.id==='nl-status').props.children.join('').includes('offline'));context.navigator.onLine=true;
});
check('Valid email uses native POST/new window; no invented acceptance; form stays mounted',()=>{
 reset();let nodes=newsletter();nodes.find(n=>n.props.id==='nl-email').props.onChange({target:{value:'test@example.invalid'}});nodes=newsletter();const form=nodes.find(n=>n.type==='form');assert.equal(form.props.method,'post');assert.equal(form.props.target,'_blank');assert.equal(form.props.rel,'noopener');const e=event('submit');form.props.onSubmit(e);assert(!e.defaultPrevented);nodes=newsletter();assert(nodes.find(n=>n.type==='form'));assert(nodes.find(n=>n.props.id==='nl-email'));assert(nodes.find(n=>n.type==='input'&&n.props.name==='embed'&&n.props.value==='1'));assert(nodes.find(n=>n.props.id==='nl-status').props.children.join('').includes('nepotvrzuje'));
 const duplicate=event('submit');nodes.find(n=>n.type==='form').props.onSubmit(duplicate);assert(duplicate.defaultPrevented);
 nodes.find(n=>n.type==='button'&&n.props.type==='button').props.onClick();assert(!newsletter().find(n=>n.type==='button'&&n.props.type==='submit').props.disabled);
});
console.log(`${checks} focused behavior checks passed`);
