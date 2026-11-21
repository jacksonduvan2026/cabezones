/* Revisión incremental. Las preferencias viajan dentro de cada perfil. */
(function(){
 for(const p of profiles){p.skill=Skills.get(p.skill).id;p.figureScale=p.figureScale===1?1:.89}
 const zonas=Contacto.zonas.bind(Contacto);
 Contacto.zonas=function(p,...args){const k=p.profile.figureScale===1?1:.89;return zonas(p,...args).map(z=>z.map((n,i)=>i<5?n*k:n))};
 const player=renderer.player.bind(renderer);
 renderer.player=function(p,g,context){
  const c=context||this.c,k=p.profile.figureScale===1?1:.89;
  c.save();c.translate(p.x,p.y);c.scale(k,k);c.translate(-p.x,-p.y);
  player(p,{...g,omitirEtiqueta:true},context);c.restore();
  if(p.profile.name)PersonalidadVisual.etiqueta(c,p,!context||c.canvas===renderer.c.canvas)
 };
 const use=Skills.use.bind(Skills);
 Skills.use=function(p,g){const result=use(p,g);if(result)p.lastUsedSkill=Skills.get(p.profile.skill).id;return result};
 const info=document.createElement('p');info.id='chosenSkills';info.style.cssText='position:absolute;top:110px;left:10%;width:80%;text-align:center;color:white;background:#102036dd;z-index:10;pointer-events:none';document.querySelector('.arena').append(info);
 const hud=UI.updateHUD.bind(UI);
 UI.updateHUD=function(){hud();info.classList.toggle('hidden',game.state!=='countdown');if(game.state==='countdown')info.textContent=game.players.map(p=>p.profile.name+' · '+Skills.get(p.profile.skill).name).join(' / ');if(new URLSearchParams(location.search).get('debug')!=='1')return;
  let box=$('skillDebug');if(!box){box=document.createElement('pre');box.id='skillDebug';box.style.cssText='position:fixed;bottom:4px;left:4px;z-index:999999;background:#001e;color:white;pointer-events:none;font:12px monospace';document.body.append(box)}
  const selected=RedAmigos.playing?RedAmigos.sessionProfiles:profiles;
  box.textContent=game.players.map(p=>'J'+(p.i+1)+' elegida '+(selected[p.i]?.skill||p.profile.skill)+' · partido '+p.profile.skill+' · usada '+(p.lastUsedSkill||'—')+' · escala '+(p.profile.figureScale===1?1:.89)).join('\n')
 };
 const oldEvent=RedAmigos.event.bind(RedAmigos);
 RedAmigos.event=function(m){oldEvent(m);if(m.kind==='skill'&&SKILLS.some(s=>s.id===m.skill)&&game.players[m.player])game.players[m.player].lastUsedSkill=m.skill};
 const skillUse=Skills.use.bind(Skills);
 Skills.use=function(p,g){const result=skillUse(p,g);if(result&&RedAmigos.host&&RedAmigos.playing)RedAmigos.sendEvent('skill',{player:p.i,skill:p.profile.skill});return result};
 const present=RedAmigos.present.bind(RedAmigos);
 RedAmigos.present=function(){present();document.querySelectorAll('#clubPreview section').forEach((section,i)=>{const line=document.createElement('p');line.textContent=Skills.get(game.players[i].profile.skill).name;section.append(line)})};
 const label=document.createElement('label');label.className='check';const original=document.createElement('input');original.type='checkbox';original.checked=profiles[0].figureScale===1;label.append(original,' Tamaño anterior del muñeco');document.querySelector('#settingsModal .settingsgrid').append(label);
 original.onchange=()=>{if(RedAmigos.playing){original.checked=profiles[0].figureScale===1;UI.toast('Cambia el tamaño antes de pulsar Listo');return}for(const p of profiles)p.figureScale=original.checked?1:.89;for(const p of game.players){p.profile.figureScale=original.checked?1:.89;p.zonasContacto=null}persist();if(RedAmigos.active)RedAmigos.updateLocal()};
 const start=game.start.bind(game);
 game.start=function(...args){const result=start(...args);for(const p of this.players)p.profile.figureScale??=profiles[0].figureScale;return result};
 persist();
})();

const VestidorComodo={
 baseline:null,index:0,history:[],persistOriginal:persist,
 changed(){return this.baseline&&JSON.stringify(profiles)!==JSON.stringify(this.baseline)},
 remember(){this.history.push(structuredClone(profiles));if(this.history.length>30)this.history.shift()},
 restore(data){data.forEach((p,i)=>{for(const key of Object.keys(profiles[i]))delete profiles[i][key];Object.assign(profiles[i],structuredClone(p))})},
 save(){this.baseline=structuredClone(profiles);this.persistOriginal();UI.toast('Cambios guardados')},
 setup(){
  const self=this,render=UI.renderProfiles.bind(UI),open=UI.open.bind(UI),close=UI.close.bind(UI);
  persist=function(){if(!self.baseline)self.persistOriginal()};
  UI.open=function(id){if(id==='customModal'&&!self.baseline){self.baseline=structuredClone(profiles);self.history=[]}return open(id)};
  UI.close=function(id){
   if(id==='customModal'&&self.changed()&&!confirm('¿Descartar los cambios sin guardar?'))return;
   if(id==='customModal'&&self.baseline){self.restore(self.baseline);self.baseline=null;self.history=[]}
   return close(id)
  };
  UI.renderProfiles=function(){render();self.layout()};
  $('saveProfiles').onclick=()=>{self.save();UI.close('customModal')};
  const foot=document.querySelector('#customModal .dialogfoot');
  function button(text,fn){const b=document.createElement('button');b.textContent=text;b.type='button';b.onclick=fn;foot.append(b)}
  $('saveProfiles').textContent='Guardar';
  $('saveProfiles').onclick=()=>self.save();
  button('Aleatorio',()=>{self.remember();self.action('Aleatorio')});
  button('Quitar todo',()=>{self.remember();self.action('Quitar todo')});
  button('Deshacer',()=>{const data=self.history.pop();if(data){self.restore(data);UI.renderProfiles()}});
  button('Volver',()=>UI.close('customModal'));
  const container=$('profiles');
  container.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,select'))self.remember()},true);
  container.addEventListener('keydown',e=>{if(!e.repeat)self.remember()},true);
 },
 action(text){const section=$('profiles').children[this.index];[...section.querySelectorAll('.visualOptions button')].find(b=>b.textContent===text)?.click()},
 layout(){
  const box=$('profiles'),sections=[...box.children],online=document.body.classList.contains('online-custom');
  if(online)this.index=0;
  let switcher=$('vestPlayer');if(!switcher){switcher=document.createElement('div');switcher.id='vestPlayer';box.before(switcher)}
  switcher.replaceChildren();
  sections.forEach((section,i)=>{
   section.classList.toggle('hidden',i!==this.index);
   if(!online){const b=document.createElement('button');b.textContent='Jugador '+(i+1);b.setAttribute('aria-pressed',String(i===this.index));b.onclick=()=>{this.index=i;this.layoutSwitch()};switcher.append(b)}
   const p=profiles[i],visual=section.querySelector('.visualOptions'),preview=visual.querySelector('[data-visual-preview]'),notice=visual.querySelector('[data-accessory-notice]');
   const stage=document.createElement('div');stage.className='fittingStage';stage.append(preview,notice);section.prepend(stage);
   const controls=document.createElement('div');controls.className='fittingControls';section.append(controls);
   const fields=section.querySelector('.fields'),avatar=section.querySelector('.avatarrow');avatar.querySelector('canvas').classList.add('hidden');
   const clothing=document.createElement('div');clothing.append(avatar,fields);
   const tabs=visual.querySelector('.vestTabs'),editor=tabs.nextElementSibling,actions=editor.nextElementSibling,lookLabel=actions.nextElementSibling,slots=visual.querySelector('.vestSlots'),dance=visual.querySelector('.vestCarousel');
   actions.classList.add('hidden');visual.querySelector('h3').classList.add('hidden');
   const looks=document.createElement('div');looks.append(lookLabel,slots);
   const content=document.createElement('div');content.className='fittingScroll';controls.append(tabs,content);
   content.append(clothing,editor,looks,dance);
   const icons={hat:'♛ Gorros',hair:'♟ Cabello',glasses:'◉ Gafas',moustache:'〰 Vello',paint:'✦ Pintura',mouth:'◡ Boca',body:'♧ Cuerpo'};
   function show(node){for(const n of [clothing,editor,looks,dance])n.classList.toggle('hidden',n!==node);tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'))}
   const more=(text,node,first=false)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>{show(node);b.setAttribute('aria-pressed','true')};if(first)tabs.prepend(b);else tabs.append(b);return b};
   for(const b of [...tabs.children]){const fn=b.onclick;b.textContent=icons[b.dataset.tab];b.onclick=()=>{show(editor);fn();tabs.querySelectorAll('button').forEach(q=>q.setAttribute('aria-pressed',String(q===b)));this.options(editor,p,i)}}
   const first=more('▤ Ropa',clothing,true);more('♫ Festejos',dance);more('★ Looks',looks);
   for(const [n,row] of [...slots.children].entries()){
    const name=document.createElement('input');name.maxLength=24;name.placeholder='Look '+(n+1);name.value=p.savedLooks[n]?.name||'';name.setAttribute('aria-label','Nombre del look '+(n+1));
    row.firstElementChild.replaceWith(name);name.onchange=()=>{if(p.savedLooks[n])p.savedLooks[n].name=name.value;persist()};
    const save=[...row.querySelectorAll('button')].find(b=>b.textContent==='Guardar'),old=save.onclick;
    save.onclick=()=>{old();p.savedLooks[n].name=name.value;persist()};
   }
   const cel=dance.querySelector('select');this.tiles(dance,cel,p,i,'celebration');
   section.querySelector('h3').classList.add('hidden');first.click()
  })
 },
 layoutSwitch(){[...$('profiles').children].forEach((s,i)=>s.classList.toggle('hidden',i!==this.index));[...$('vestPlayer').children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===this.index)))},
 options(editor,p,i){
  const s=editor.querySelector('[data-accessory]');if(!s)return;
  this.tiles(editor,s,p,i,s.dataset.accessory);
  const palette=document.createElement('div');palette.className='quickColors';
  for(const color of Object.values(Vestuario.paleta)){
   const b=document.createElement('button');b.type='button';b.style.background=color==='tricolor'?'linear-gradient(#ffdb43 50%,#2674db 50%,#ef4141)':color;b.setAttribute('aria-label','Color '+Object.keys(Vestuario.paleta).find(k=>Vestuario.paleta[k]===color));
   b.onclick=()=>{p.colors[s.dataset.accessory]=color==='tricolor'&&s.dataset.accessory!=='hair'?'#ffdb43':color;this.optionsRefresh(editor,p,i)};palette.append(b)
  }
  const reset=document.createElement('button');reset.textContent='Restablecer color';reset.onclick=()=>{delete p.colors[s.dataset.accessory];this.optionsRefresh(editor,p,i)};palette.append(reset);editor.append(palette)
 },
 optionsRefresh(editor,p,i){editor.querySelector('.optionTiles')?.remove();editor.querySelector('.quickColors')?.remove();this.options(editor,p,i);persist()},
 tiles(parent,select,p,i,category){
  const grid=document.createElement('div');grid.className='optionTiles';
  for(const option of select.options){
   const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',String(select.value===option.value));
   const cv=document.createElement('canvas');cv.width=140;cv.height=160;const profile=structuredClone(p);profile.name='';
   if(category==='celebration')profile.celebration=option.value;else profile.accessories[category]=option.value;
   const actor=new Player(i,profile);actor.x=70;actor.y=151;
   const ctx=cv.getContext('2d');ctx.translate(70,151);ctx.scale(.78,.78);ctx.translate(-70,-151);renderer.player(actor,{...game,state:category==='celebration'?'goal':'menu',goalTeam:i,players:[actor],preview:true,visualChoice:option.value,visualTime:.65},cv.getContext('2d'));
   const name=document.createElement('span');name.textContent=option.text;b.append(cv,name);
   b.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change'));if(category==='celebration')grid.querySelectorAll('button').forEach(q=>q.setAttribute('aria-pressed',String(q===b)));else this.optionsRefresh(parent,p,i)};
   grid.append(b)
  }
  select.parentElement.classList.add('hidden');parent.append(grid)
 }
};
VestidorComodo.setup();
