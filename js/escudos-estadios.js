/* Shared UI badges and aesthetic stadium choice. No simulation code is changed. */
(function () {
 const stylized=Clubs.crest.bind(Clubs);
 Clubs.badge=function(id,size=28,canvas=null){
  const target=canvas||document.createElement('canvas');
  target.width=target.height=128;target.style.width=size+'px';target.style.height=size+'px';target.classList.add('teamBadge');target.dataset.club=id;
  target.setAttribute('aria-label','Escudo estilizado de '+this.get(id).name);stylized(target,id);
  this.loadCrestFiles().then(async files=>{
   const path=files[id];
   if(typeof path!=='string'||!/^img\/escudos\/[^?#]+\.(png|webp|svg|jpe?g)$/i.test(path))return;
   if(!this.crestImages.has(path))this.crestImages.set(path,new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{console.warn('No se pudo cargar el escudo:',image.src);resolve(null)};image.src=path}));
   const image=await this.crestImages.get(path);if(!image)return;
   const c=target.getContext('2d'),scale=Math.min(128/image.naturalWidth,128/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;
   c.clearRect(0,0,128,128);c.imageSmoothingQuality='high';c.drawImage(image,(128-w)/2,(128-h)/2,w,h);target.setAttribute('aria-label','Escudo de '+this.get(id).name);
  });return target;
 };
 Clubs.crest=(canvas,id)=>Clubs.badge(id,canvas.classList.contains('crest')?80:64,canvas);
 Clubs.selectorCrest=(canvas,id)=>Clubs.badge(id,64,canvas);
 Clubs.swatch=id=>Clubs.badge(id,24);
 // Resolve and decode once. All interface instances share these promises/images.
 Clubs.loadCrestFiles().then(files=>{for(const id of Object.keys(files))if(files[id])Clubs.badge(id)});
 const labelCache=new WeakMap();
 Clubs.label=function(el,id,text){const name=text||this.get(id).name;let entry=labelCache.get(el);if(!entry||entry.id!==id||entry.name!==name){entry={id,name,nodes:[this.badge(id,24),document.createTextNode(name)]};labelCache.set(el,entry)}if(el.firstChild!==entry.nodes[0]||el.childNodes.length!==2)el.replaceChildren(...entry.nodes)};
 const style=document.createElement('style');style.textContent=`.clubcard>.teamBadge:last-child{display:none}.teamBadge{object-fit:contain;vertical-align:middle;flex-shrink:0;margin-right:5px}.teamName{white-space:normal}.hud .teamBadge{width:24px!important;height:24px!important}.stadiumChoices{display:grid;grid-template-columns:1fr 1fr;gap:14px}.stadiumChoice{padding:12px;border:2px solid transparent}.stadiumChoice.selected{border-color:#ffda42}.stadiumChoice>canvas:last-child{width:100%;height:auto;display:block;margin-top:12px;border-radius:9px}#pauseTeams{display:flex;justify-content:center;gap:20px;margin:8px 0}#clubPreview .crest{width:80px!important;height:80px!important}@media(max-width:600px){.stadiumChoices{gap:6px}.stadiumChoice{padding:7px}.teamBadge{max-width:64px}}`;document.head.append(style);
 const modal=document.createElement('div');modal.className='modal hidden';modal.id='stadiumModal';modal.innerHTML='<div class="dialog"><h2>Elige el estadio</h2><div class="stadiumChoices" id="stadiumChoices"></div><div class="dialogfoot"><button id="stadiumBack">Volver a equipos</button><button class="primary" id="stadiumContinue">Continuar →</button></div></div>';document.body.append(modal);
 const venue=Ambiente.venue.bind(Ambiente);
 Ambiente.venue=function(config=game.config,opponent){if(config.mode==='cup'||!config.venueClub)return venue(config,opponent);const id=config.venueClub,a=SEDES[id]||SEDES.nacional;return {name:a[0],city:a[1],land:a[2],arch:a[3],club:id}};
 const preview=Clubs.preview.bind(Clubs);
 Clubs.preview=function(config,opponent,done){
  if(!['cpu','local'].includes(config.mode)){preview(config,opponent,done);return}
  const ids=this.matchIds(config,opponent);let chosen=ids.includes(config.venueClub)?config.venueClub:ids[0];
  const box=$('stadiumChoices');box.replaceChildren();
  function render(){box.replaceChildren();for(const id of ids){
   const club=Clubs.get(id),v=Ambiente.venue({...config,venueClub:id},opponent),b=document.createElement('button');b.className='stadiumChoice'+(id===chosen?' selected':'');b.setAttribute('aria-pressed',String(id===chosen));b.append(Clubs.badge(id,40),document.createTextNode(v.name));
   const cv=document.createElement('canvas');cv.width=600;cv.height=325;const view=new Renderer(cv);view.c.scale(.5,.5);const g={...game,config:{...config,venue:v},demoTime:0,staticVenue:true};const previous=Ambiente.current;try{Ambiente.current=()=>v;view.stadium(g);view.goal(0,g);view.goal(1,g)}finally{Ambiente.current=previous}b.append(cv);b.onclick=()=>{chosen=id;render()};box.append(b);
  }}
  render();UI.open('stadiumModal');
  $('stadiumContinue').onclick=()=>{config.venueClub=chosen;UI.close('stadiumModal');preview(config,opponent,done)};
  $('stadiumBack').onclick=()=>{UI.close('stadiumModal');Clubs.select(config.mode,()=>{config.clubIds=[...Clubs.selected()];delete config.venueClub;Clubs.preview(config,opponent,done)})};
 };
 const themeLabel=$('theme').closest('label');function syncTheme(){themeLabel.classList.toggle('hidden',['cpu','local'].includes(UI.mode))}document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',syncTheme));syncTheme();
 const pair=document.createElement('div');pair.id='pauseTeams';document.querySelector('#settingsModal .dialoghead').after(pair);
 const pause=game.pause.bind(game);game.pause=function(){pause();pair.replaceChildren();for(const id of this.config.clubIds||[]){const label=document.createElement('span');Clubs.label(label,id);pair.append(label)}};
 // Team names in cup prose, presentation, statistics and replay banners use the same badge.
 const names=[...CLUBS].sort((a,b)=>b.name.length-a.name.length);const escaped=names.map(c=>c.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));const pattern=new RegExp(escaped.join('|'),'g');
 function decorate(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){const parent=node.parentElement;if(!parent||parent.closest('.teamName,.clubcard,#clubPreview h3,canvas,script,style,option,select,textarea')||node.previousSibling?.classList?.contains('teamBadge'))continue;
   pattern.lastIndex=0;if(!pattern.test(node.nodeValue))continue;pattern.lastIndex=0;
   const fragment=document.createDocumentFragment();let end=0;for(const match of node.nodeValue.matchAll(pattern)){fragment.append(document.createTextNode(node.nodeValue.slice(end,match.index)));const club=names.find(c=>c.name===match[0]),span=document.createElement('span');span.className='teamName';span.append(Clubs.badge(club.id,22),document.createTextNode(club.name));fragment.append(span);end=match.index+match[0].length}fragment.append(document.createTextNode(node.nodeValue.slice(end)));node.replaceWith(fragment);
  }
 }
 let pending=false;const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{observer.disconnect();document.querySelectorAll('.modal,.hud,#banner').forEach(decorate);observer.observe(document.body,{childList:true,subtree:true});pending=false})});observer.observe(document.body,{childList:true,subtree:true});
 UI.updateHUD();
})();
