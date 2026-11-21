const Vestidor={
 montar(section,p,i){
  PersonalidadVisual.normalize(p);
  const panel=document.createElement('div');panel.className='visualOptions';section.append(panel);
  function add(parent,tag,text){const el=document.createElement(tag);if(text)el.textContent=text;parent.append(el);return el}
  function button(parent,text,fn){const b=add(parent,'button',text);b.type='button';b.className='small';b.onclick=fn;return b}
  function select(parent,label,entries,current,onchange){const l=add(parent,'label',label),s=add(l,'select');for(const [key,name] of Object.entries(entries))s.add(new Option(name,key));s.value=current;s.onchange=()=>onchange(s.value);return s}
  add(panel,'h3','Vestidor');const canvas=add(panel,'canvas');canvas.width=280;canvas.height=260;canvas.dataset.visualPreview=i;
  const note=add(panel,'p','Tu foto queda fija. Los accesorios de cuello y cuerpo siguen visibles.');note.dataset.accessoryNotice=i;note.className='hint';note.classList.toggle('hidden',!p.photo);
  const tabs=add(panel,'div');tabs.className='vestTabs';const editor=add(panel,'div');let active='hat';
  function show(){
   for(const b of tabs.children)b.setAttribute('aria-pressed',String(b.dataset.tab===active));
   editor.replaceChildren();select(editor,Vestuario.nombres[active],{none:'Ninguno',...Vestuario.piezas[active]},p.accessories[active],v=>{p.accessories[active]=v;if(active==='moustache')p.accessories.beard='none';persist();show()}).dataset.accessory=active;
   const label=add(editor,'label','Color'),color=add(label,'input');color.type='color';color.value=p.colors[active]==='tricolor'?'#ffce43':Vestuario.color(active,p.accessories[active],p);color.oninput=()=>{p.colors[active]=color.value;persist()};
   if(active==='hair')select(editor,'Paleta',{custom:'Personalizado',...Object.fromEntries(Object.entries(Vestuario.paleta).map(([n,v])=>[v,n]))},Object.values(Vestuario.paleta).includes(p.colors.hair)?p.colors.hair:'custom',v=>{if(v!=='custom'){p.colors.hair=v;persist();show()}});
  }
  for(const [key,name] of Object.entries(Vestuario.nombres))button(tabs,name,()=>{active=key;show()}).dataset.tab=key;
  const clear=()=>{for(const k of Object.keys(p.accessories))p.accessories[k]='none';p.colors={}};
  const actions=add(panel,'div');actions.className='vestTabs';
  button(actions,'Aleatorio',()=>{clear();for(const [k,opts] of Object.entries(Vestuario.piezas)){const vals=['none',...Object.keys(opts)];p.accessories[k]=vals[Math.floor(Math.random()*vals.length)]}persist();show()});
  button(actions,'Quitar todo',()=>{clear();persist();show()});
  const looks=select(panel,'Looks prearmados',{'':'Elegir look',...Object.fromEntries(Object.keys(Vestuario.looks).map(k=>[k,k]))},'',v=>{if(v){clear();Object.assign(p.accessories,Vestuario.looks[v]);persist();show();looks.value=''}});
  const slots=add(panel,'div');slots.className='vestSlots';
  for(let n=0;n<3;n++){const row=add(slots,'div');add(row,'span','Look '+(n+1));
   button(row,'Guardar',()=>{p.savedLooks[n]=structuredClone({accessories:p.accessories,colors:p.colors});load.disabled=false;persist();UI.toast('Look '+(n+1)+' guardado')});
   const load=button(row,'Usar',()=>{const s=p.savedLooks[n];if(s){clear();Object.assign(p.accessories,s.accessories);Object.assign(p.colors,s.colors);persist();show()}});load.disabled=!p.savedLooks[n];
  }
  const carousel=add(panel,'div');carousel.className='vestCarousel';add(carousel,'h4','Celebración de gol');
  const mini=add(carousel,'canvas');mini.width=240;mini.height=246;mini.dataset.dance=i;
  const rail=add(carousel,'div'),keys=Object.keys(PersonalidadVisual.celebrations);
  function advance(delta){const at=keys.indexOf(p.celebration);p.celebration=keys[(at+delta+keys.length)%keys.length];choice.value=p.celebration;persist()}
  button(rail,'‹',()=>advance(-1)).ariaLabel='Celebración anterior';
  const choice=select(rail,'Celebración',PersonalidadVisual.celebrations,p.celebration,v=>{p.celebration=v;persist()});
  button(rail,'›',()=>advance(1)).ariaLabel='Celebración siguiente';show()
 }
};
