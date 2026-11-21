Object.assign(RedAmigos,{
 playerKeys:['x','y','vx','vy','face','grounded','energy','charge','kick','slide','walk','hit','squash','skillCD','airJump','aiming','skillFlash'],
 ballKeys:['x','y','vx','vy','r','spin','angle','fire','heavy','fast','curve','ground','precise'],
 send(message){
  if(!this.conn?.open)return false;
  if((this.conn.bufferSize||0)>=8&&['state','input'].includes(message.type))return false;
  try{this.conn.send({v:RED_CONFIG.protocol,...message});return true}catch{this.drop();return false}
 },
 sendEvent(kind,data={}){if(this.host&&this.playing)this.send({type:'event',kind,id:++this.seq,matchId:this.matchId,...data})},
 snapshot(force=false){
  if(!this.host||!this.playing||!this.conn?.open)return;
  const now=performance.now(),interval=this.phase==='result'?500:1000/RED_CONFIG.snapshotHz;if(!force&&now-(this.lastSnapshot||0)<interval)return;this.lastSnapshot=now;
  let ball=game.ball,players=game.players;
  if(game.state==='replay'&&game.goalReplay?.length){const frame=game.goalReplay[Math.min(game.goalReplay.length-1,Math.floor(game.replayTime*30))];ball=frame.ball;players=frame.players}
  this.send({type:'state',matchId:this.matchId,ack:this.lastAck||0,n:++this.stateSeq||1,state:game.state,owner:this.owner,previous:game.previousState,
   b:this.ballKeys.map(key=>ball[key]??0),p:players.map(p=>({v:this.playerKeys.map(key=>p[key]??0),fx:{...p.effects},stats:{...game.players[p.i]?.stats}})),
   score:game.score,time:game.time,elapsed:game.elapsed,countdown:game.countdown,goalTimer:game.goalTimer,goalTeam:game.goalTeam,
   overtime:game.overtime,extraTime:game.extraTime,lastTouch:game.lastTouch,net:game.net,ice:game.goalIce,slow:game.slow,cameraShake:game.cameraShake,timeSkill:game.timeSkill,
   items:game.items.map(item=>[item.x,item.y,item.life,POWERUPS.findIndex(type=>type[0]===item.type[0])]),penaltyWinner:game.penaltyWinner});
 },
 acceptState(message){
  if(!Array.isArray(message.p)||message.p.length!==2||!Array.isArray(message.b)||!message.b.every(Number.isFinite)||!['countdown','playing','goal','replay','paused','result'].includes(message.state)||!Number.isFinite(message.time))return;
  if(message.p.some(p=>!Array.isArray(p.v)||p.v.some(v=>typeof v!=='boolean'&&!Number.isFinite(v))))return;
  this.receivedAt=performance.now();message.received=this.receivedAt;
  if(message.state!==game.state)this.samples=[];
  this.samples.push(message);if(this.samples.length>20)this.samples.shift();
  game.players.forEach((player,i)=>{player.stats={...message.p[i].stats}});
  game.score=message.score.map(n=>clamp(+n||0,0,999));game.time=message.time;game.elapsed=message.elapsed;game.overtime=message.overtime;game.extraTime=message.extraTime;
  game.countdown=message.countdown;game.goalTimer=message.goalTimer;game.goalTeam=message.goalTeam;game.lastTouch=message.lastTouch;game.penaltyWinner=message.penaltyWinner;
  game.net=message.net;game.goalIce=message.ice;game.slow=message.slow;game.timeSkill=message.timeSkill;game.cameraShake=message.cameraShake||0;this.owner=message.owner;
  const prior=game.state;game.state=message.state;$('skipBtn').classList.toggle('hidden',message.state!=='replay');if(message.state==='replay')UI.banner('REPETICIÓN','EL GOL, UNA VEZ MÁS');
  if(prior!==message.state){
   if(prior==='paused'&&message.state!=='paused'){UI.hideAll();$('resumeBtn').disabled=false}
   if(message.state==='paused'){game.previousState=message.previous||'playing';UI.settings();this.pauseLabel()}
   else if(message.state==='result'){
    this.phase='result';this.rematch=[false,false];
    const won=(game.penaltyWinner??(game.score[0]>game.score[1]?0:game.score[0]<game.score[1]?1:null))===1;
    if(!this.resultRecorded){records.games++;records.wins+=won?1:0;records.goals+=game.score[1];persist();this.resultRecorded=true}
    UI.results(false,won);$('resultNext').textContent='Revancha';$('onlineChange').classList.remove('hidden');
   }else {UI.hideAll();$('onlinePause').classList.add('hidden')}
  }
  UI.updateHUD();
 },
 takeRemote(){const action={...this.held,...this.edges};this.edges={};return action},
 inputTick(){
  if(this.host||!this.playing||this.phase!=='match')return;
  const action=this.original.read(0);this.lastInput=action;
  for(const key of ['jumpPressed','kickReleased','specialPressed','tacklePressed'])this.outEdges[key]||=!!action[key];
  const sent=this.send({type:'input',matchId:this.matchId,seq:++this.inputSeq||1,a:{...action,...this.outEdges}});
  if(action.jumpPressed&&this.predicted&&game.players[1]?.grounded&&!(game.players[1].effects.freeze>0)){this.predicted.vy=-650;this.predicted.jumping=true}
  if(sent)this.outEdges={};
 },
 clientFrame(dt){
  game.demoTime+=dt;game.cameraShake=Math.max(0,(game.cameraShake||0)-dt*27);for(const p of game.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.life-=dt}game.particles=game.particles.filter(p=>p.life>0);
  if(!this.samples.length)return;
  const target=performance.now()-RED_CONFIG.interpolationMs;let a=this.samples[0],b=a;
  for(const sample of this.samples){if(sample.received<=target)a=sample;if(sample.received>=target){b=sample;break}b=sample}
  const blend=a===b?1:clamp((target-a.received)/(b.received-a.received),0,1);
  this.ballKeys.forEach((key,i)=>game.ball[key]=a.b[i]+(b.b[i]-a.b[i])*blend);
  game.players.forEach((p,index)=>{
   this.playerKeys.forEach((key,i)=>p[key]=['x','y','vx','vy','walk'].includes(key)?a.p[index].v[i]+(b.p[index].v[i]-a.p[index].v[i])*blend:b.p[index].v[i]);
   p.effects={...b.p[index].fx};p.stats={...b.p[index].stats};
  });
  game.items=(b.items||[]).filter(item=>POWERUPS[item[3]]).map(item=>({x:item[0],y:item[1],life:item[2],type:POWERUPS[item[3]]}));
  if(game.state==='playing'){
   const p=game.players[1],dir=(this.lastInput.right?1:0)-(this.lastInput.left?1:0);
   if(!this.predicted||Math.abs(this.predicted.x-p.x)>180)this.predicted={x:p.x,y:p.y,vx:p.vx,vy:p.vy};
   const prediction=this.predicted,weight=1-Math.exp(-10*dt);
   prediction.x+=(p.x-prediction.x)*weight;prediction.y+=(p.y-prediction.y)*weight;
   const frozen=p.effects.freeze>0||p.effects.stasis>0;
   prediction.vx+=((frozen?0:p.slide>0?p.face*580:dir*280)-prediction.vx)*Math.min(1,dt*(p.grounded?15:5));prediction.x=clamp(prediction.x+prediction.vx*dt,96,1104);
   if(prediction.jumping){prediction.vy+=game.gravity*dt;prediction.y=Math.min(FLOOR,prediction.y+prediction.vy*dt);if(prediction.y>=FLOOR)prediction.jumping=false}
   else prediction.y=p.y;
   p.x=prediction.x;p.y=prediction.y;
  }else this.predicted=null;
  if(game.state==='countdown')UI.banner(game.countdown>.4?Math.ceil(game.countdown-.4):'¡YA!','PARTIDO EN LÍNEA');
  if(game.state==='playing')UI.banner('','');
  if(game.state==='goal')PersonalidadVisual.goalTime=clamp(1.7-game.goalTimer,0,1.7);
 },
 event(message){
  if(message.kind==='audio'){
   if(message.name?.startsWith('whistle-')){
    StadiumAudio.whistle(message.name.slice(8));
    if(StadiumAudio.pendingIntro){const text=StadiumAudio.pendingIntro;StadiumAudio.pendingIntro=null;setTimeout(()=>Ambiente.speak(text),100)}
   }else if(typeof message.name==='string')StadiumAudio.fx(message.name,{gain:clamp(+message.gain||1,0,1.5),bus:message.bus==='crowd'?'crowd':'effects',delay:clamp(+message.delay||0,0,5)});
  }
  if(message.kind==='burst'&&Array.isArray(message.args)){const [x,y,n,color,speed]=message.args;if(Number.isFinite(x+y+n+speed)&&/^#[a-f0-9]{3,8}$/i.test(color))game.burst(x,y,clamp(n,0,75),color,clamp(speed,0,600))}
  if(message.kind==='speech')Ambiente.speak(String(message.text).slice(0,300));
  if(message.kind==='goal'){game.goalTeam=message.team;PersonalidadVisual.goal(game);if(Array.isArray(message.choices)){PersonalidadVisual.choices=new Map(message.choices.filter(([id,type])=>Number.isInteger(id)&&Object.hasOwn(PersonalidadVisual.celebrations,type)));PersonalidadVisual.scorer=message.scorer;PersonalidadVisual.especial=message.especial}UI.banner('¡GOOOL!','A LA RED')}
 },
 peerError(error){
  if(!this.active||this.conn?.open)return;
  this.lastFailure=error.type==='peer-unavailable'?'Código incorrecto o la sala ya no existe':'No se pudo conectar. Prueba con otra red o vuelve a intentarlo';this.connectionError(this.lastFailure);
 },
 installSync(){
  this.stateSeq=0;this.inputSeq=0;
  this.original={start:game.start.bind(game),menu:game.menu.bind(game),pause:game.pause.bind(game),resume:game.resume.bind(game),update:game.update.bind(game),read:input.read.bind(input),skipReplay:game.skipReplay.bind(game)};
  game.update=dt=>{if(this.phase==='presenting'){game.demoTime+=dt;return}if(this.playing&&!this.host){this.clientFrame(dt);return}if(this.playing&&this.host&&game.players[1]){game.players[1]._jumpEvent=false;game.players[1]._kickRelease=false}this.original.update(dt)};
  input.read=index=>this.playing&&this.host&&index===1?(()=>{const action=this.takeRemote();input.previous[1]={...action};return action})():this.original.read(index);
  game.pause=(...args)=>{if(!this.playing||this.internal)return this.original.pause(...args);if(this.host)this.pause(0);else{this.send({type:'pause'});this.original.pause();this.owner=1;this.pauseLabel()}};
  game.resume=(...args)=>{
   if(!this.playing||this.internal)return this.original.resume(...args);
   if(this.phase==='disconnected')return;
   if(this.host)this.resume();else if(this.owner===1||this.owner===null)this.send({type:'resume'});else{UI.settings();UI.toast('El anfitrión debe continuar el partido')}
  };
  game.menu=(...args)=>{if(this.active&&!this.internal){this.exit();return}return this.original.menu(...args)};
  const burst=game.burst.bind(game);game.burst=(...args)=>{if(this.host&&this.playing&&args[2]>=6)this.sendEvent('burst',{args});return burst(...args)};
  const goal=game.goal.bind(game);game.goal=(...args)=>{const prior=game.state,result=goal(...args);if(this.host&&this.playing&&prior==='playing'&&game.state==='goal'){this.snapshot(true);this.sendEvent('goal',{team:game.goalTeam,choices:[...PersonalidadVisual.choices],scorer:PersonalidadVisual.scorer,especial:PersonalidadVisual.especial})}return result};
  const finish=game.finish.bind(game);game.finish=(...args)=>{const result=finish(...args);if(this.host&&this.playing&&game.state==='result'){this.phase='result';this.rematch=[false,false];$('resultNext').textContent='Revancha';$('onlineChange').classList.remove('hidden');this.snapshot(true)}return result};
  const audio=StadiumAudio.fx.bind(StadiumAudio);StadiumAudio.fx=(name,options={})=>{if(this.host&&this.playing&&!name.startsWith('ui-'))this.sendEvent('audio',{name,gain:options.gain??1,bus:options.bus,delay:options.delay});return audio(name,options)};
  const speak=Ambiente.speak.bind(Ambiente);Ambiente.speak=text=>{if(this.playing&&!this.host&&this.internal)return;if(this.host&&this.playing)this.sendEvent('speech',{text});return speak(text)};
  for(const event of ['keydown','keyup','pointerdown','pointerup','pointercancel'])window.addEventListener(event,e=>{if(this.playing&&!this.host&&!Mobile.editable(e.target))queueMicrotask(()=>this.inputTick())});
  const skipGoal=$('skipCelebration').onclick;$('skipCelebration').onclick=()=>{if(this.playing&&!this.host)this.send({type:'skip-goal'});else skipGoal()};
  game.skipReplay=()=>{if(this.playing&&!this.host)this.send({type:'skip-replay'});else this.original.skipReplay()};
  const next=$('resultNext').onclick;$('resultNext').onclick=event=>this.active?this.rematchAsk():next(event);
  const restart=$('restartMatch').onclick;$('restartMatch').onclick=event=>{if(!this.active)restart(event)};
  setInterval(()=>{
   if(!this.active)return;
   this.inputTick();
   if(this.playing&&this.conn?.open&&performance.now()-this.receivedAt>10000)this.drop();
   if(this.phase==='disconnected'&&this.deadline&&performance.now()>this.deadline){this.status('Se perdió la conexión con tu amigo. Vuelve al menú para crear otra sala.');this.deadline=0}
  },20);
  setInterval(()=>{if(this.playing&&this.host)this.snapshot(this.phase!=='result')},1000/RED_CONFIG.snapshotHz);
  setInterval(()=>{if(this.conn?.open){this.send({type:'ping',time:performance.now()});this.updatePing()}},1500);
  window.addEventListener('beforeunload',()=>{if(this.active)this.send({type:'leave'})});
 }
});
