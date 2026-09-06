const THEMES=['auto','light','dark'];
export function initAppearance({document:d=globalThis.document}={}){
 const w=d.defaultView,root=d.documentElement,select=d.getElementById('theme-select'),abort=new w.AbortController();
 const media=w.matchMedia?.('(prefers-color-scheme: dark)'),layout=w.matchMedia?.('(min-width: 851px)');
 let theme='auto';try{const saved=w.localStorage.getItem('rt_theme_v1');if(THEMES.includes(saved))theme=saved;}catch{}
 function apply(){const resolved=theme==='auto'?(media?.matches?'dark':'light'):theme;root.dataset.theme=resolved;root.style.colorScheme=resolved;select.value=theme;d.dispatchEvent(new w.CustomEvent('rt-theme-change',{detail:{theme,resolved}}));}
 function orientation(){d.getElementById('tabs')?.setAttribute('aria-orientation',layout?.matches?'vertical':'horizontal');}
 const change=()=>{theme=THEMES.includes(select.value)?select.value:'auto';try{w.localStorage.setItem('rt_theme_v1',theme);}catch{}apply();};
 select.addEventListener('change',change,{signal:abort.signal});
 const system=()=>{if(theme==='auto')apply();};
 const storage=e=>{if(e.key==='rt_theme_v1'){theme=THEMES.includes(e.newValue)?e.newValue:'auto';apply();}};
 w.addEventListener('storage',storage,{signal:abort.signal});media?.addEventListener?.('change',system);layout?.addEventListener?.('change',orientation);
 const details=d.getElementById('connection-popover'),storageStatus=d.getElementById('storage-status'),offline=d.getElementById('offline-status'),note=d.querySelector('.save-note');
 function connection(){const state=note?.dataset.state==='error'||storageStatus.dataset.state==='error'?'error':storageStatus.dataset.state||'loading';details.dataset.state=state;d.getElementById('connection-summary').textContent=state==='error'?'Zkontrolovat uložení':state==='local'?'Pouze v zařízení':'Načítám místní data…';details.querySelector('summary').title=storageStatus.textContent+' · '+offline.textContent;}
 const observer=new w.MutationObserver(connection);[storageStatus,offline,note].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:['data-state']}));
 d.addEventListener('click',e=>{if(details.open&&!details.contains(e.target))details.open=false;},{signal:abort.signal});
 details.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();details.open=false;details.querySelector('summary').focus();}},{signal:abort.signal});
 apply();orientation();connection();
 return {destroy(){abort.abort();observer.disconnect();media?.removeEventListener?.('change',system);layout?.removeEventListener?.('change',orientation);},theme:()=>theme};
}
