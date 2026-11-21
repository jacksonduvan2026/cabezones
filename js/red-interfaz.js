Object.assign(RedAmigos,{
 renderLobby(){
  if(this.phase!=='lobby')return;
  const own=this.host?0:1,lobbyProfiles=this.host?[this.local,this.remote]:[this.remote,this.local],box=$('onlinePlayers');box.replaceChildren();
  for(let i=0;i<2;i++){
   const panel=document.createElement('section');panel.className='card';const title=document.createElement('h3');title.textContent=(lobbyProfiles[i]?.name||'Esperando…')+(i===own?' · Tú':'');
   const avatar=document.createElement('canvas');avatar.width=280;avatar.height=260;avatar.style.cssText='width:120px;height:auto;display:block;margin:auto';
   if(lobbyProfiles[i]){const p=new Player(i,Clubs.dress(lobbyProfiles[i],this.teams[i]));p.x=avatar.width/2;p.y=avatar.height-22;renderer.player(p,{...game,state:'menu'},avatar.getContext('2d'))}
   const team=document.createElement('select');team.setAttribute('aria-label','Equipo de '+(lobbyProfiles[i]?.name||'tu amigo'));
   for(const club of CLUBS.slice(0,20))team.add(new Option(club.name,club.id));team.value=this.teams[i];team.disabled=i!==own;
   team.onchange=()=>{this.teams[i]=team.value;this.ready=[false,false];if(this.host)this.sendLobby();else this.send({type:'choice',team:team.value});this.renderLobby()};
   const source=lobbyProfiles[i]?.photo,im=source?photoCache.get(source):null;if(im&&!im.complete)im.addEventListener('load',()=>this.renderLobby(),{once:true});
   const badge=Clubs.badge(this.teams[i],48),status=document.createElement('p');status.textContent=this.ready[i]?'✓ Listo':'Eligiendo';const skill=document.createElement('select');skill.setAttribute('aria-label','Habilidad');for(const item of SKILLS)skill.add(new Option(item.name,item.id));skill.value=lobbyProfiles[i]?.skill||'precise';skill.disabled=i!==own;skill.onchange=async()=>{profiles[0].skill=skill.value;persist();this.ready=[false,false];await this.updateLocal();if(this.host)this.sendLobby()};
   panel.append(title,avatar,badge,team,skill,status);box.append(panel);
  }
  const venues=$('onlineVenue');venues.replaceChildren();this.teams.forEach((id,i)=>venues.add(new Option(SEDES[id]?.[0]||'Estadio local',String(i))));venues.value=String(this.venueIndex);venues.disabled=!this.host;$('onlineDuration').value=this.duration;$('onlineDuration').disabled=!this.host;
  $('onlineReady').disabled=!this.local||!this.remote||this.ready[own];$('onlineReady').textContent=this.ready[own]?'Esperando a tu amigo…':'Listo';
 },
 updatePing(){
  const badge=$('onlinePing');if(!this.playing)return;
  badge.textContent='En línea · '+this.ping+' ms'+(!this.host?' · Tú juegas a la derecha':'');badge.style.color=this.ping>220?'#ff778b':this.ping>110?'#ffdf70':'#b9f34b';
  if(this.ping>350&&performance.now()-(this.lastLagWarning||0)>12000){UI.toast('La conexión está lenta');this.lastLagWarning=performance.now()}
 },
 installUI(){
  const button=document.createElement('button');button.className='mode';button.id='onlinePlay';button.textContent='Jugar en línea (1 vs 1)';document.querySelector('.modegrid').append(button);button.onclick=()=>this.open();
  const modal=document.createElement('div');modal.id='onlineModal';modal.className='modal hidden';
  modal.innerHTML=`<div class="dialog"><div class="dialoghead"><h2>Jugar con un amigo</h2><button id="onlineExit" aria-label="Salir de la sala">✕</button></div>
   <p id="onlineStatus" role="status" aria-live="polite"></p>
   <div data-online-panel="choose"><div class="onlineButtons"><button class="primary" id="onlineCreate">Crear partida</button><button id="onlineJoinShow">Unirse a partida</button></div>
    <label>Código propio opcional<input id="onlineCustomCode" maxlength="12" placeholder="5 caracteres" autocomplete="off" autocapitalize="characters"></label></div>
   <div data-online-panel="join" class="hidden"><label>Código de tu amigo<input id="onlineJoinCode" maxlength="12" placeholder="ABCDE" autocomplete="off" autocapitalize="characters"></label><button class="primary" id="onlineJoin">Unirse</button></div>
   <div data-online-panel="waiting" class="hidden"><div id="onlineCode"></div><div class="onlineButtons"><button id="onlineCopy">Copiar código</button><button id="onlineShare">Compartir link</button><button id="onlineCancel">Cancelar</button></div></div>
   <div data-online-panel="lobby" class="hidden"><p class="hint">Tu nombre, foto y accesorios se comparten con tu amigo durante esta sesión.</p><div id="onlinePlayers"></div><label>Estadio<select id="onlineVenue"></select></label><label>Duración<select id="onlineDuration"><option value="t30">30 segundos</option><option value="t60">60 segundos</option><option value="t90">90 segundos</option></select></label>
    <div class="onlineButtons"><button id="onlineCustomize">Mi personalización</button><button class="primary" id="onlineReady">Listo</button></div></div>
   <div data-online-panel="retry" class="hidden"><div class="onlineButtons"><button class="primary" id="onlineRetry">Reintentar conexión</button><button id="onlineReturn">Volver al menú</button></div></div></div>`;
  document.body.append(modal);
  const style=document.createElement('style');style.textContent='#onlineCode{font:bold 48px monospace;text-align:center;letter-spacing:8px;padding:25px}.onlineButtons{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}.onlineButtons>button{flex:1;min-height:48px}#onlinePlayers{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}#onlinePlayers select{width:100%}#onlineStatus{margin:12px 0;color:#ffdf70}#onlineModal label{display:grid;gap:7px;margin:12px 0}#onlinePing{position:absolute;left:8px;bottom:8px;z-index:10;background:#071625cf;padding:4px 7px;border-radius:6px;font-size:10px;pointer-events:none}.mobile-session #onlinePing{bottom:77px}.online-session .aiStyle{display:none}.online-custom #profiles .profile:nth-child(2){display:none}@media(max-width:500px){#onlinePlayers{gap:5px}#onlinePlayers .card{padding:8px}#onlinePlayers canvas{max-width:100%}}';document.head.append(style);
  const ping=document.createElement('div');ping.id='onlinePing';ping.className='hidden';document.querySelector('.arena').append(ping);
  const pause=document.createElement('p');pause.id='onlinePause';pause.className='hidden';document.querySelector('#settingsModal .dialoghead').after(pause);
  const change=document.createElement('button');change.id='onlineChange';change.className='hidden';change.textContent='Cambiar equipos';$('resultNext').before(change);change.onclick=()=>{if(this.host)this.backLobby();else this.send({type:'lobby-request'})};
  $('onlineExit').onclick=$('onlineCancel').onclick=$('onlineReturn').onclick=()=>this.exit();
  $('onlineCreate').onclick=()=>{sound.init();this.create($('onlineCustomCode').value)};
  $('onlineJoinShow').onclick=()=>{this.showPanel('join');$('onlineJoinCode').focus()};$('onlineJoin').onclick=()=>{sound.init();this.join($('onlineJoinCode').value)};
  $('onlineCopy').onclick=()=>this.copy(this.code);
  $('onlineShare').onclick=async()=>{const url=location.origin+location.pathname+'#sala='+this.code;try{if(navigator.share)await navigator.share({title:'Cabezones · juega conmigo',url});else await this.copy(url)}catch(error){if(error.name!=='AbortError')this.copy(url)}};
  $('onlineVenue').onchange=()=>{if(this.host){this.venueIndex=+$('onlineVenue').value;this.ready=[false,false];this.sendLobby();this.renderLobby()}};
  $('onlineDuration').onchange=()=>{if(this.host){this.duration=$('onlineDuration').value;this.ready=[false,false];this.sendLobby();this.renderLobby()}};
  $('onlineCustomize').onclick=()=>{document.body.classList.add('online-custom');UI.renderProfiles();UI.open('customModal');this.ready=[false,false];this.editing=true;this.send({type:'editing',editing:true});if(this.host)this.sendLobby()};
  $('onlineReady').onclick=()=>{sound.init();Mobile.enter();this.setReady()};
  $('onlineRetry').onclick=()=>{
   if(this.role==='guest')this.join(this.code,true);
   else if(this.peer?.disconnected)this.peer.reconnect();else if(this.phase==='disconnected'){this.status('Esperando la reconexión de tu amigo…')}else this.create($('onlineCustomCode').value);
  };
  const close=UI.close.bind(UI);UI.close=id=>{close(id);if(id==='customModal'&&this.active){document.body.classList.remove('online-custom');this.editing=false;this.updateLocal().then(()=>{this.send({type:'editing',editing:false});if(this.host)this.sendLobby()})}};
  document.addEventListener('visibilitychange',()=>{if(this.active&&!document.hidden)this.wake()});
  const joinHash=()=>{const hash=location.hash.match(/^#sala=([a-z2-9]{5})$/i);if(!hash)return;const code=this.normalize(hash[1]);if(this.active&&this.code===code)return;if(this.active){this.exit();history.replaceState(null,'',location.pathname+location.search+'#sala='+code)}this.open();$('onlineJoinCode').value=code;this.join(code)};
  window.addEventListener('hashchange',joinHash);joinHash();
 },
 async copy(text){try{await navigator.clipboard.writeText(text);UI.toast('Copiado')}catch{UI.toast('Copia este código o enlace: '+text)}}
});
RedAmigos.installUI();RedAmigos.installSync();
