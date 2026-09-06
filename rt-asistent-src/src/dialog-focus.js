export function focusableWithin(container){
 return [...container.querySelectorAll('button,a[href],input,select,textarea,summary,[tabindex="0"]')].filter(el=>{
  if(el.disabled||el.closest('[hidden],[inert]'))return false;
  for(let node=el.parentElement;node&&node!==container;node=node.parentElement)if(node.tagName==='DETAILS'&&!node.open&&node.querySelector('summary')!==el)return false;
  return true;
 });
}
export function trapFocus(event,container){
 if(event.key!=='Tab')return;
 const elements=focusableWithin(container),first=elements[0],last=elements.at(-1),active=container.ownerDocument.activeElement;
 if(!first){event.preventDefault();container.focus();return;}
 if(event.shiftKey&&(active===first||!elements.includes(active))){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&(active===last||!elements.includes(active))){event.preventDefault();first.focus();}
}
