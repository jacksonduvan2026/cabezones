/* Only network sessions enter these branches; the existing local duel is authoritative. */
const RedAmigos={
 phase:'idle',role:null,peer:null,conn:null,code:'',token:'',remoteToken:null,
 local:null,remote:null,ready:[false,false],teams:['nacional','millonarios'],venueIndex:0,duration:'t60',
 matchId:0,seq:0,lastEvent:0,owner:null,ping:0,samples:[],held:{},edges:{},outEdges:{},lastInput:{},
 original:{},internal:false,sessionProfiles:null,lastState:null,deadline:0,receivedAt:0,sentPhoto:null,
 get active(){return this.phase!=='idle'},
 get host(){return this.role==='host'},
 get playing(){return this.active&&this.sessionProfiles&&['presenting','match','result','disconnected'].includes(this.phase)},
 normalize(value){return String(value||'').replace(/\s/g,'').toUpperCase()},
 valid(code){return code.length===5&&[...code].every(c=>RED_CONFIG.alphabet.includes(c))},
 randomCode(){const bytes=crypto.getRandomValues(new Uint8Array(5));return [...bytes].map(n=>RED_CONFIG.alphabet[n%RED_CONFIG.alphabet.length]).join('')},
 send(data){if(this.conn?.open){try{this.conn.send({v:RED_CONFIG.protocol,...data})}catch{this.drop()}}},
 status(text){$('onlineStatus').textContent=text},
 async ensurePeer(){
  if(window.Peer)return;
  if(!this.library)this.library=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='libs/peerjs-1.5.5.min.js';script.onload=resolve;script.onerror=()=>reject(Error('No se pudo cargar PeerJS'));document.head.append(script)});
  return this.library;
 },
 async photo(src){
  if(!src)return null;
  const image=photoImage(src)||await new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src});if(!image)return null;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const scale=Math.min(128/image.naturalWidth,128/image.naturalHeight),width=image.naturalWidth*scale,height=image.naturalHeight*scale;canvas.getContext('2d').drawImage(image,(128-width)/2,(128-height)/2,width,height);return canvas.toDataURL('image/webp',.78);
 },
 cleanProfile(value,oldPhoto=null){
  // Keep every cosmetic field supported by the supplied version, including neck/body options.
  const copy=(input,depth=0)=>{
   if(depth>8)return null;
   if(typeof input==='string')return input.slice(0,200);
   if(typeof input==='number')return Number.isFinite(input)?input:0;
   if(typeof input==='boolean'||input===null)return input;
   if(Array.isArray(input))return input.slice(0,40).map(item=>copy(item,depth+1));
   if(input&&typeof input==='object')return Object.fromEntries(Object.entries(input).filter(([key])=>!['__proto__','prototype','constructor','photo','savedLooks'].includes(key)).slice(0,80).map(([key,item])=>[key,copy(item,depth+1)]));
   return null;
  };
  const profile={...copy(baseProfiles[0]),...copy(value||{})};
  profile.name=String(profile.name||'Amigo').slice(0,18);
  for(const key of ['shirt','shorts','socks','skin'])if(!/^#(?:[a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(profile[key]))profile[key]=baseProfiles[0][key];
  profile.head=Number.isFinite(profile.head)&&profile.head>0&&profile.head<=4?profile.head:baseProfiles[0].head;
  profile.skill=Skills.get(profile.skill).id;profile.figureScale=profile.figureScale===1?1:.89;
  profile.photo=value?.photo===undefined?oldPhoto:typeof value.photo==='string'&&value.photo.length<60000&&/^data:image\/(png|jpeg|webp);base64,/.test(value.photo)?value.photo:null;
  PersonalidadVisual.normalize(profile);photoImage(profile.photo);return profile;
 },
 async updateLocal(){
  const lifecycle=this.lifecycle,revision=this.profileRevision=(this.profileRevision||0)+1;
  const profile=this.cleanProfile({...profiles[0],photo:await this.photo(profiles[0].photo)});
  if(!this.active||lifecycle!==this.lifecycle||revision!==this.profileRevision)return null;
  this.local=profile;const fingerprint=JSON.stringify(profile);if(this.conn?.open&&fingerprint!==this.localFingerprint){const packet={...profile};if(packet.photo===this.sentPhoto)delete packet.photo;else this.sentPhoto=packet.photo;this.send({type:'profile',profile:packet});this.localFingerprint=fingerprint;}this.renderLobby();return profile;
 },
 async wake(){try{if(document.visibilityState==='visible'&&!this.wakeLock)this.wakeLock=await navigator.wakeLock?.request('screen');this.wakeLock?.addEventListener('release',()=>this.wakeLock=null,{once:true})}catch{}},
 releaseWake(){this.wakeLock?.release().catch(()=>{});this.wakeLock=null},
 destroy(){
  this.lifecycle=(this.lifecycle||0)+1;clearTimeout(this.presentationTimer);if(this.sessionProfiles){game.history=[];game.goalReplay=[];document.querySelectorAll('#clubPreview canvas:not(.teamBadge),#resultsModal canvas:not(.teamBadge)').forEach(canvas=>canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height))}$('clubPreviewGo').disabled=false;$('clubPreviewGo').textContent='Elegir habilidades →';this.internal=true;this.phase='idle';for(const photo of [this.remote?.photo,this.local?.photo])if(photo&&!profiles.some(p=>p.photo===photo))photoCache.delete(photo);this.conn?.close();this.peer?.destroy();this.conn=this.peer=null;this.releaseWake();
  this.editing=false;this.remoteEditing=false;this.role=null;this.denied=false;this.remoteToken=null;this.sessionProfiles=null;this.samples=[];this.local=null;this.remote=null;$('onlinePlayers').replaceChildren();this.ready=[false,false];this.sentPhoto=null;this.localFingerprint=null;this.deadline=0;this.owner=null;
  this.held={};this.edges={};input.clear();document.body.classList.remove('online-custom','online-session');$('onlinePing').classList.add('hidden');$('onlinePause').classList.add('hidden');$('restartMatch').classList.remove('hidden');$('onlineChange').classList.add('hidden');$('resumeBtn').disabled=false;
  this.internal=false;
 },
 exit(notify=true){if(notify)this.send({type:'leave'});this.destroy();this.original.menu();UI.close('onlineModal');if(location.hash.startsWith('#sala='))history.replaceState(null,'',location.pathname+location.search)},
 open(){if(game.active)this.original.menu();UI.hideAll();UI.open('onlineModal');this.showPanel('choose');this.status('Juega un duelo 1 contra 1 con tu amigo.');},
 showPanel(name){for(const panel of document.querySelectorAll('[data-online-panel]'))panel.classList.toggle('hidden',panel.dataset.onlinePanel!==name)},
 async create(custom='',attempt=0){
  if(this.phase!=='idle')this.destroy();this.role='host';this.phase='waiting';this.code=this.normalize(custom)||this.randomCode();this.token=crypto.randomUUID();
  if(!this.valid(this.code)){this.destroy();this.status('Usa 5 letras o números, sin 0, O, 1, I ni L.');return}
  this.showPanel('waiting');$('onlineCode').textContent=this.code;this.status('Creando sala…');this.wake();
  const lifecycle=this.lifecycle;try{await this.ensurePeer();if(this.phase!=='waiting'||lifecycle!==this.lifecycle)return;const peer=new Peer(RED_CONFIG.roomPrefix+this.code,RED_CONFIG.peer);this.peer=peer;
   peer.on('open',()=>{if(this.peer!==peer)return;this.status('Esperando a tu amigo…');this.updateLocal()});
   peer.on('connection',conn=>this.accept(conn));
   peer.on('error',error=>{
    if(this.peer!==peer)return;
    if(error.type==='unavailable-id'){this.destroy();if(!custom&&attempt<4)this.create('',attempt+1);else{this.showPanel('choose');this.status('Ese código ya está ocupado. Escribe otro o genera una sala.')}}
    else this.peerError(error);
   });peer.on('disconnected',()=>{if(this.peer===peer&&!peer.destroyed)try{peer.reconnect()}catch{}});
  }catch{this.status('No se pudo conectar. Prueba con otra red o vuelve a intentarlo');this.showPanel('retry')}
 },
 async join(value,retry=false){
  const code=this.normalize(value);if(!this.valid(code)){this.status('Código incorrecto o la sala ya no existe');return}
  if(!retry){this.destroy();this.role='guest';this.phase='connecting';this.code=code;this.token=crypto.randomUUID();this.showPanel('waiting');$('onlineCode').textContent=code}
  this.status('Conectando…');this.wake();
  const lifecycle=this.lifecycle;try{await this.ensurePeer();if(!this.active||lifecycle!==this.lifecycle)return;
   if(this.peer&&!this.peer.destroyed){if(this.peer.disconnected){this.peer.reconnect();return}this.connect();return}
   const peer=new Peer(undefined,RED_CONFIG.peer);this.peer=peer;
   peer.on('open',()=>{if(this.peer===peer)this.connect()});peer.on('error',error=>this.peerError(error));
   peer.on('disconnected',()=>{if(this.peer===peer&&!peer.destroyed)try{peer.reconnect()}catch{}});
  }catch{this.status('No se pudo conectar. Prueba con otra red o vuelve a intentarlo');this.showPanel('retry')}
 },
 connect(){
  if(!this.peer?.open||this.conn?.open||this.conn?.dataChannel?.readyState==='connecting')return;
  const old=this.conn;this.conn=null;old?.close();
  const conn=this.peer.connect(RED_CONFIG.roomPrefix+this.code,{reliable:true,serialization:'json',metadata:{v:RED_CONFIG.protocol,token:this.token}});this.attach(conn);
  const timeout=setTimeout(()=>{if(this.conn===conn&&!conn.open){this.denied=true;conn.close();this.connectionError(this.lastFailure||'No se pudo conectar. Prueba con otra red o vuelve a intentarlo')}},10000);conn.on('open',()=>clearTimeout(timeout));
 },
 accept(conn){
  const valid=conn.metadata?.v===RED_CONFIG.protocol&&typeof conn.metadata.token==='string';
  const reserved=this.remoteToken&&conn.metadata?.token!==this.remoteToken;
  const expired=this.sessionProfiles&&this.phase==='disconnected'&&(!this.deadline||performance.now()>this.deadline);
  if(!valid||this.conn?.open||reserved||expired){conn.on('open',()=>{conn.send({v:RED_CONFIG.protocol,type:'error',text:expired?'La partida caducó. Vuelve al menú.':'La sala está llena'});setTimeout(()=>conn.close(),200)});return}
  this.remoteToken=conn.metadata.token;this.attach(conn);
 },
 attach(conn){
  this.denied=false;this.lastFailure=null;this.conn=conn;
  conn.on('open',async()=>{
   if(this.conn!==conn)return;this.receivedAt=performance.now();this.deadline=0;
   if(this.sessionProfiles){
    this.phase=game.state==='result'?'result':'match';
    if(this.host){if(this.reconnectResume&&game.state==='paused'){this.owner=null;this.original.resume()}this.send({type:'restore',config:this.matchConfig,matchId:this.matchId,owner:this.owner});this.snapshot(true)}
    this.status('Amigo reconectado');UI.close('onlineModal');
   }else{this.phase='lobby';this.localFingerprint=null;this.ready=[false,false];this.showPanel('lobby');this.status('Tu amigo está conectado. Elijan equipo y pulsen Listo.');await this.updateLocal();if(this.host)this.sendLobby()}
  });
  conn.on('close',()=>{if(this.conn===conn&&this.active&&!this.denied){if(this.lastFailure&&!this.playing)this.connectionError(this.lastFailure);else this.drop()}});conn.on('error',()=>{if(this.conn===conn&&this.active){if(this.playing)this.drop();else this.connectionError(this.lastFailure||'No se pudo conectar. Prueba con otra red o vuelve a intentarlo')}});
  conn.on('data',message=>{if(this.conn!==conn||!message||message.v!==RED_CONFIG.protocol||typeof message.type!=='string')return;this.receivedAt=performance.now();this.receive(message)});
  conn.on('close',()=>{if(this.conn===conn&&!this.internal)this.drop()});conn.on('error',()=>{if(this.conn===conn)this.drop()});
 },
 peerError(error){
  if(error.type==='peer-unavailable')this.connectionError('Código incorrecto o la sala ya no existe');
  else if(error.type!=='disconnected')this.connectionError('No se pudo conectar. Prueba con otra red o vuelve a intentarlo');
 },
 connectionError(text){if(this.playing){this.drop();return}this.status(text);this.showPanel('retry')},
 drop(){
  if(!this.active||this.phase==='disconnected')return;
  this.outEdges={};this.reconnectResume=game.active&&game.state!=='paused'&&game.state!=='result';this.phase='disconnected';this.deadline=performance.now()+RED_CONFIG.reconnectMs;this.held={};this.edges={};
  if(game.active&&game.state!=='result')this.original.pause();UI.open('onlineModal');this.showPanel('retry');this.status('Se perdió la conexión con tu amigo');
 },
 sendLobby(){this.send({type:'lobby',teams:this.teams,venueIndex:this.venueIndex,duration:this.duration,ready:this.ready})},
 async setReady(){
  if(this.phase!=='lobby'||this.editing||this.remoteEditing)return;const profile=await this.updateLocal();if(!profile||this.phase!=='lobby')return;const index=this.host?0:1;this.ready[index]=true;this.send({type:'ready',ready:true});this.renderLobby();if(this.host)this.checkStart();
 },
 checkStart(){if(this.phase==='lobby'&&!this.editing&&!this.remoteEditing&&this.ready.every(Boolean)&&this.local&&this.remote)this.begin()},
 begin(){
  if(!this.host)return;
  this.matchId++;this.lastEvent=0;this.seq=0;this.sessionProfiles=[this.local,this.remote];this.phase='presenting';this.owner=null;this.rematch=[false,false];
  this.matchConfig={...UI.config(),mode:'local',clubIds:[...this.teams],venueClub:this.teams[this.venueIndex],rules:this.duration,online:true};
  this.send({type:'start',config:this.matchConfig,matchId:this.matchId});this.startGame(this.matchConfig);this.present();this.snapshot(true);
 },
 startGame(config){
  document.body.classList.add('online-session');this.internal=true;this.original.start(config);this.internal=false;
  const kits=Clubs.pair(...config.clubIds);
  game.players.forEach((p,i)=>{p.profile=Clubs.dress({...this.sessionProfiles[i]},config.clubIds[i],kits[i]);p.human=i});
  game.goalReplay=[];this.samples=[];this.predicted=null;this.lastInput={};this.lastAck=0;this.outEdges={};this.held={};this.edges={};this.lastState=null;this.startedId=this.matchId;this.resultRecorded=false;
  input.clear();UI.hideAll();$('restartMatch').classList.add('hidden');$('onlinePing').classList.remove('hidden');this.ready=[false,false];UI.updateHUD();Mobile.layout();Mobile.awake();
 },
 receive(message){
  this.receivedAt=performance.now();
  switch(message.type){
   case 'error':this.denied=true;this.conn?.close();this.connectionError(String(message.text).slice(0,100));break;
   case 'profile':
    if(this.phase!=='lobby')break;
    this.remote=this.cleanProfile(message.profile,this.remote?.photo);this.ready=[false,false];this.renderLobby();if(this.host)this.sendLobby();break;
   case 'lobby':
    if(this.host||!Array.isArray(message.teams)||!message.teams.every(id=>CLUBS.slice(0,20).some(c=>c.id===id)))break;
    this.teams=message.teams.slice(0,2);this.venueIndex=message.venueIndex===1?1:0;this.duration=['t30','t60','t90'].includes(message.duration)?message.duration:'t60';this.ready=message.ready?.map(Boolean).slice(0,2)||[false,false];this.renderLobby();break;
   case 'choice':
    if(!this.host||this.phase!=='lobby'||!CLUBS.slice(0,20).some(c=>c.id===message.team))break;
    this.teams[1]=message.team;this.ready=[false,false];this.sendLobby();this.renderLobby();break;
   case 'editing':this.remoteEditing=message.editing===true;this.ready=[false,false];if(this.host)this.sendLobby();this.renderLobby();break;
   case 'ready':
    if(this.phase!=='lobby')break;this.ready[this.host?1:0]=!!message.ready;this.renderLobby();if(this.host){this.sendLobby();this.checkStart()}break;
   case 'start':
    if(this.host||!(this.phase==='lobby'||this.phase==='result'&&this.rematch?.[1])||!this.remote||!this.local)break;
    this.matchId=message.matchId;this.lastEvent=0;this.sessionProfiles=[this.remote,this.local];this.phase='presenting';this.matchConfig=this.cleanConfig(message.config);this.startGame(this.matchConfig);this.present();break;
   case 'go':if(!this.host&&this.phase==='presenting')this.go();break;
   case 'restore':
    if(this.host||!this.sessionProfiles||message.matchId!==this.matchId)break;
    this.phase=game.state==='result'?'result':'match';this.owner=message.owner;UI.close('onlineModal');break;
   case 'input':
    if(!this.host||!this.playing||message.matchId!==this.matchId||!Number.isSafeInteger(message.seq)||message.seq<=(this.lastAck||0))break;
    for(const key of ['left','right','jump','kick','special','tackle'])this.held[key]=message.a?.[key]===true;
    for(const key of ['jumpPressed','kickReleased','specialPressed','tacklePressed'])this.edges[key]||=message.a?.[key]===true;
    this.lastAck=message.seq;break;
   case 'state':if(!this.host&&this.playing&&message.matchId===this.matchId)this.acceptState(message);break;
   case 'event':if(!this.host&&this.playing&&message.matchId===this.matchId&&message.id>this.lastEvent){this.lastEvent=message.id;this.event(message)}break;
   case 'pause':if(this.host&&this.playing)this.pause(1);break;
   case 'resume':if(this.host&&this.playing&&(this.owner===1||this.owner===null))this.resume();break;
   case 'paused':if(!this.host&&this.playing){this.owner=message.owner;if(message.paused)this.original.pause();else this.original.resume();this.pauseLabel()}break;
   case 'skip-goal':if(this.host&&this.playing&&game.state==='goal')game.goalTimer=0;break;
   case 'skip-replay':if(this.host&&this.playing&&game.state==='replay')this.original.skipReplay();break;
   case 'ping':this.send({type:'pong',time:message.time});break;
   case 'pong':if(Number.isFinite(message.time))this.ping=Math.round(performance.now()-message.time);break;
   case 'rematch':if(this.host&&this.phase==='result'){this.rematch||=[false,false];this.rematch[1]=true;if(this.rematch[0])this.begin()}break;
   case 'lobby-request':if(this.host&&this.phase==='result')this.backLobby();break;
   case 'back-lobby':if(!this.host)this.backLobby(false);break;
   case 'leave':UI.toast('Tu amigo salió de la partida');this.exit(false);break;
  }
 },
 cleanConfig(config){
  const ids=Array.isArray(config?.clubIds)&&config.clubIds.length===2?config.clubIds:['nacional','millonarios'];
  return {...UI.config(),mode:'local',online:true,clubIds:ids.map(id=>Clubs.get(id).id),venueClub:ids.includes(config?.venueClub)?config.venueClub:ids[0],rules:['t30','t60','t90'].includes(config?.rules)?config.rules:'t60',theme:config?.theme||'night',weather:config?.weather||'none',powerups:!!config?.powerups};
 },
 present(){
  Clubs.preview({...this.matchConfig,mode:'online-preview'},null,()=>{});
  $('clubPreview').querySelectorAll('section').forEach((section,i)=>{const canvas=section.querySelector('canvas:not(.crest)');if(canvas&&game.players[i]){const p=new Player(i,game.players[i].profile);p.x=95;p.y=214;const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);renderer.player(p,{...game,state:'menu'},c)}});
  $('clubPreviewGo').disabled=true;$('clubPreviewGo').textContent='El partido comienza en un momento…';
  const id=this.matchId;
  if(this.host)this.presentationTimer=setTimeout(()=>{if(this.active&&this.matchId===id&&this.phase==='presenting'){this.send({type:'go'});this.go()}},1200);
 },
 go(){this.phase='match';UI.close('clubPreviewModal');$('clubPreviewGo').disabled=false;$('clubPreviewGo').textContent='Elegir habilidades →';this.snapshot(true)},
 pause(owner){if(game.state==='paused')return;this.owner=owner;this.original.pause();this.send({type:'paused',paused:true,owner});this.pauseLabel();this.snapshot(true)},
 resume(){if(this.phase==='disconnected')return;this.owner=null;this.original.resume();this.send({type:'paused',paused:false,owner:null});this.pauseLabel();this.snapshot(true)},
 pauseLabel(){
  const label=$('onlinePause');label.classList.toggle('hidden',!this.playing||game.state!=='paused');
  const profile=this.sessionProfiles?.[this.owner??0];label.textContent='Partido en pausa por '+(profile?.name||'tu amigo');$('resumeBtn').disabled=!this.host&&this.owner===0;
 },
 rematchAsk(){if(this.phase!=='result')return;this.rematch||=[false,false];this.rematch[this.host?0:1]=true;this.send({type:'rematch'});UI.toast('Esperando que tu amigo acepte la revancha…');if(this.host&&this.rematch[1])this.begin()},
 backLobby(notify=true){
  if(notify)this.send({type:'back-lobby'});this.internal=true;this.original.menu();this.internal=false;
  this.sessionProfiles=null;this.phase='lobby';this.ready=[false,false];this.showPanel('lobby');UI.open('onlineModal');this.renderLobby();if(this.host)this.sendLobby();
 }
};
