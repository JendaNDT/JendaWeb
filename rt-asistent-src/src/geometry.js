// Functional cross-sections: geometry is schematic, never to scale.
const dimension=(x1,x2,y,label,key)=>`<g class="dimension" data-dimension="${key}"><path d="M${x1} ${y-5}v10m0-5h${x2-x1}m0-5v10"/><text x="${(x1+x2)/2}" y="${y-8}" text-anchor="middle">${label}</text></g>`;
export function geometryDiagram(technique,{module='n',compact=false,highlight='distance',gap=20}={}){
 const single=technique==='single',inside=technique==='inside',nearFilm=technique==='outside';
 const source=inside?224:30;
 const front=single?174:158,rear=single?238:302,inner=282;
 const film=nearFilm?181:module==='n'||gap===0?rear+4:322;
 const surface=technique==='dwsi'?inner:front;
 const body=single?'<rect class="object-wall" x="174" y="45" width="64" height="68"/>':'<circle class="object-wall" cx="230" cy="79" r="72"/><circle class="object-void" cx="230" cy="79" r="52"/>';
 const rayEnd=film;
 let dims='';
 if(!compact){
  if(module==='n')dims=dimension(source,nearFilm?front:film,173,nearFilm?'f':'SFD','distance')+dimension(inside?inner:front,inside?rear:front+20,139,'t','thickness');
  else dims=dimension(source,surface,173,technique==='dwsi'?'f′':'f','distance')+dimension(surface,film,203,technique==='dwsi'?'b′':'b','gap')+(gap===0?'':dimension(rear,film,139,'mezera','gap'))+dimension(technique==='dwsi'?inner:front,single?rear:technique==='dwsi'?rear:front+20,139,'t','thickness');
  if(!single)dims+=dimension(front,rear,236,'De','diameter');
 }
 const label=single?'Jedna stěna':inside?'Zdroj uvnitř, film vně':nearFilm?'Zdroj vně, film uvnitř':technique==='dwdi'?'Dvě stěny, hodnocení obou':'Dvě stěny, hodnocení stěny u filmu';
 return `<svg class="geometry-svg ${compact?'geometry-mini':''}" viewBox="0 0 356 ${compact?156:250}" ${compact?'aria-hidden="true"':`role="img" aria-label="${label}. Rozměry jsou schematické."`} data-technique="${technique}" data-highlight="${highlight}">
 ${body}<path class="radiation-ray" d="M${source} 79L${rayEnd} 58M${source} 79L${rayEnd} 100"/>
 ${technique==='dwsi'?'<path class="evaluated-wall" d="M282 63v32"/>':technique==='dwdi'?'<path class="evaluated-wall" d="M158 63v32M282 63v32"/>':''}
 <circle class="source-point" cx="${source}" cy="79" r="7"/><path class="film-line" d="M${film} 51v56"/>
 ${compact?'':`<text class="diagram-label" x="${source}" y="35" text-anchor="middle">Zdroj</text><text class="diagram-label" x="${film}" y="35" text-anchor="middle">Film</text>`}${dims}</svg>${compact?'':'<p class="diagram-caption">Schéma není v měřítku.</p>'}`;
}

export function geometryChoices(id,label,options){
 return `<div class="geometry-picker"><h3>${label}</h3><select id="${id}" hidden aria-label="${label}">${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select><div class="geometry-options" role="radiogroup" aria-label="${label}">${options.map(([v,t],i)=>`<button type="button" class="geometry-option" role="radio" aria-checked="${i===0}" tabindex="${i===0?0:-1}" data-choice-for="${id}" data-value="${v}">${geometryDiagram(v,{compact:true})}<span>${t}</span></button>`).join('')}</div></div>`;
}
