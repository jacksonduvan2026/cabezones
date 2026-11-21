/* Visual state is kept outside Player and Physics. */
const PersonalidadVisual = {
 celebrations:{random:'Aleatoria',run:'Brazos arriba corriendo',knees:'Deslizamiento de rodillas',dance:'Baile',flip:'Voltereta corta',plane:'Avioncito',ears:'Manos en la oreja',bow:'Reverencia',...Festejos.nombres},
 accessories:{...Object.fromEntries(Object.entries(Vestuario.piezas).map(([k,items])=>[k,['none',...Object.keys(items)]])),beard:['none','beard']},
 labels:{none:'Ninguno',cap:'Gorra',wig:'Peluca',vueltiao:'Sombrero vueltiao',headband:'Diadema',tricolor:'Bandana tricolor',glasses:'Gafas',moustache:'Bigote',beard:'Barba'},
 faces:new Map(),goalCount:0,goalTime:0,scorer:null,choices:new Map(),lastDrawn:new Map(),returnFrom:new Map(),returnAge:1,
 reduced(){return settings.quality==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches},
 normalize(profile){
  if(!Object.hasOwn(this.celebrations,profile.celebration))profile.celebration='random';
  profile.colors={...profile.colors};if(!Array.isArray(profile.savedLooks))profile.savedLooks=[];
  const stored=profile.accessories&&typeof profile.accessories==='object'?profile.accessories:{};
  profile.accessories=Object.fromEntries(Object.entries(this.accessories).map(([key,allowed])=>[key,allowed.includes(stored[key])?stored[key]:'none']));
 },
 goal(g){
  this.goalCount++;this.goalTime=0;this.scorer=g.players.find(p=>p.i===g.lastTouch&&p.team===g.goalTeam)?.i??g.players.find(p=>p.team===g.goalTeam)?.i;
  const autor=g.players.find(p=>p.i===this.scorer);this.especial=g.overtime?'Gol de oro':g.config.mode==='cup'&&Cup.data?.final&&Cup.current()===Cup.data.final?'Gol en la final':autor?.stats.goals===3?'Triplete':null;
  const options=Object.keys(this.celebrations).filter(key=>key!=='random');this.choices.clear();
  for(const p of g.players){this.normalize(p.profile);this.choices.set(p.i,p.profile.celebration==='random'?Festejos.sortear(p.i,options):p.profile.celebration)}
 },
 expression(p,g){
  let face='neutral';
  if(g.state==='result'&&g.penaltyWinner==null&&g.score[0]===g.score[1])face='neutral';
  else if(g.state==='goal'||g.state==='result')face=(g.state==='goal'?p.team===g.goalTeam:(g.penaltyWinner??(g.score[0]>g.score[1]?0:g.score[0]<g.score[1]?1:null))===p.team)?'happy':'sad';
  else if(p.hit>.08)face='hurt';
  else if(p.kick>0||!p.grounded)face='effort';
  else if(g.state==='playing'&&Math.abs(g.ball.x-p.x)<170&&g.ball.y<GOALTOP+30&&Math.abs(g.ball.vx)>500)face='surprise';
  else if(p._missExpressionUntil>g.elapsed)face='angry';
  const entry=this.faces.get(p.i)||{current:'neutral',prior:'neutral',changed:0};
  if(face!==entry.current&&((g.demoTime||0)-entry.changed>.16||face==='happy'||face==='sad')){entry.prior=entry.current;entry.current=face;entry.changed=g.demoTime||0}
  this.faces.set(p.i,entry);return entry;
 },
 face(c,r,state){
  c.fillStyle='#fff';c.strokeStyle='#35271e';c.lineWidth=2.5;c.lineCap='round';
  for(const side of [-1,1]){
   const x=side*r*.35;
   if(state==='hurt'){c.beginPath();c.moveTo(x-5,-3);c.lineTo(x+5,5);c.moveTo(x+5,-3);c.lineTo(x-5,5);c.stroke()}
   else if(state==='happy'){c.fillStyle='#ffe16b';c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rad=i%2?3:7;c.lineTo(x+Math.cos(a)*rad,Math.sin(a)*rad)}c.fill()}
   else {c.beginPath();c.ellipse(x,1,r*.15,state==='effort'?r*.08:r*.15,0,0,Math.PI*2);c.fill();c.fillStyle='#13202b';c.beginPath();c.arc(x+2,1,r*.075,0,Math.PI*2);c.fill()}
   c.fillStyle='#fff';c.beginPath();const slope=state==='angry'?-side*5:state==='sad'?side*4:0;c.moveTo(x-6,-10+slope);c.lineTo(x+6,-10-slope);c.stroke();
  }
  c.strokeStyle='#743e32';c.beginPath();
  if(state==='surprise'||state==='hurt'){c.ellipse(0,r*.3,4,7,0,0,Math.PI*2)}
  else if(state==='sad'||state==='angry'){c.arc(0,r*.5,r*.22,Math.PI+.2,Math.PI*2-.2)}
  else c.arc(0,r*.18,r*(state==='happy'?.4:.28),.15,Math.PI-.15);
  c.stroke();
  if(state==='sad'){c.fillStyle='#76c7ed';c.beginPath();c.ellipse(r*.4,r*.25,2.5,5,0,0,7);c.fill()}
 },
 radio(p){return 36*p.profile.head*(p.effects.giant>0?1.45:1)*(settings.estiloClasico?1:.875)},
 altura(p){return -99+(p.slide>0?27:0)-(settings.estiloClasico?0:12)},
 etiqueta(c,p,enCancha=false){
  const r=this.radio(p),a=p.profile.accessories||{};
  const extra=p.profile.photo?1:typeof Vestuario==='undefined'?(a.hat==='none'?1:1.65):Vestuario.altura(a);
  const tamano=p.profile.figureScale===1?1:.89;const limite=p.y+Math.min(this.altura(p)-r*extra-5,-137)*tamano;
  c.save();c.translate(p.x,limite);const escala=enCancha?this.escalaEtiqueta||1:1;c.scale(escala,escala);c.textAlign='center';c.font='bold 14px system-ui';
  const texto=p.profile.name||'',w=c.measureText(texto).width+14;
  c.fillStyle=p.profile.kit?.base||p.profile.shirt;c.globalAlpha=.83;c.beginPath();
  c.roundRect(-w/2,-21,w,20,5);c.fill();c.globalAlpha=1;c.strokeStyle='#eef7ff';c.lineWidth=1;c.stroke();
  c.lineWidth=2.7;c.strokeStyle='#152132';c.strokeText(texto,0,-6);c.fillStyle='#fff';c.fillText(texto,0,-6);
  const icons=POWERUPS.filter(v=>p.effects[v[0]]>0).map(v=>v[1]+' '+Math.ceil(p.effects[v[0]])).join('  ');
  if(icons)c.fillText(icons,0,-25);c.restore()
 },
 head(c,p,g){
  const r=this.radio(p),y=p.y+this.altura(p),photo=photoImage(p.profile.photo);
  c.save();c.translate(p.x,y);if(g.fotoRotation)c.rotate(-g.fotoRotation);
  // Uploaded photographs never rotate, squash, change expression or receive accessories.
  if(!p.profile.photo){const wobble=this.reduced()?0:Math.sin(p.walk||0)*Math.min(.05,Math.abs(p.vx)*.0002);c.rotate(wobble+(settings.estiloClasico||this.reduced()?0:clamp((p.inclinacion||0)*.02-(p.vy||0)*.00009,-.09,.09)))}
  c.fillStyle='#12202c';c.beginPath();c.arc(0,0,r+3,0,7);c.fill();
  c.save();c.beginPath();c.arc(0,0,r,0,7);c.clip();
  if(p.profile.photo){if(photo){const side=Math.min(photo.naturalWidth,photo.naturalHeight);c.drawImage(photo,(photo.naturalWidth-side)/2,(photo.naturalHeight-side)/2,side,side,-r,-r,r*2,r*2)}}
  else {
   c.fillStyle=p.profile.skin;c.fillRect(-r,-r,r*2,r*2);
   c.fillStyle=p.i?'#292137':'#30251e';c.beginPath();c.arc(0,-5,r,Math.PI,Math.PI*2);c.lineTo(r,0);c.lineTo(r*.55,-r*.4);c.lineTo(-r*.55,-r*.57);c.lineTo(-r,0);c.fill();
   const entry=this.expression(p,g),blend=clamp(((g.demoTime||0)-entry.changed)/.12,0,1);
   if(blend<1){c.globalAlpha=1-blend;this.face(c,r,entry.prior)}c.globalAlpha=blend;this.face(c,r,entry.current);c.globalAlpha=1;
  }
  c.restore();c.strokeStyle='#fff5';c.lineWidth=2;c.beginPath();c.arc(0,0,r,0,7);c.stroke();
  if(!p.profile.photo)Vestuario.cabeza(c,p,r);
  c.restore();
 },
 accessory(c,p,r){
  const a=p.profile.accessories||{},color=p.profile.kit?.accent||p.profile.shirt;
  c.save();c.scale(r/36,r/36);c.lineWidth=4;c.lineCap='round';
  if(a.hat==='cap'){c.fillStyle=color;c.beginPath();c.arc(0,-23,34,Math.PI,Math.PI*2);c.lineTo(34,-20);c.lineTo(-34,-20);c.fill();c.fillRect(-35,-24,80,7)}
  if(a.hat==='wig'){c.fillStyle=color;for(let i=0;i<7;i++){c.beginPath();c.arc(-32+i*10,-25-Math.sin(i/6*Math.PI)*14,12,0,7);c.fill()}}
  if(a.hat==='vueltiao'){
   c.fillStyle='#e6d0a2';c.beginPath();c.ellipse(0,-29,52,11,0,0,7);c.fill();c.fillRect(-24,-51,48,24);c.strokeStyle='#2b2621';
   for(let y=-48;y<-25;y+=7){c.beginPath();c.moveTo(-24,y);c.lineTo(24,y);c.stroke()}
   c.beginPath();c.ellipse(0,-29,43,6,0,0,7);c.stroke();
  }
  if(a.hat==='headband'||a.hat==='tricolor'){
   c.fillStyle=color;c.fillRect(-34,-20,68,8);
   if(a.hat==='tricolor'){for(const [i,col] of ['#f8d136','#2056ba','#d52c38'].entries()){c.fillStyle=col;c.fillRect(-34,-23+i*4,68,4)}}
  }
  if(a.glasses==='glasses'){c.strokeStyle='#142132';for(const x of [-14,14]){c.beginPath();c.roundRect(x-11,-7,22,16,5);c.stroke()}c.beginPath();c.moveTo(-3,0);c.lineTo(3,0);c.stroke()}
  if(a.beard==='beard'){c.fillStyle='#39271e';c.beginPath();c.moveTo(-25,14);c.quadraticCurveTo(0,57,25,14);c.lineTo(17,23);c.quadraticCurveTo(0,34,-17,23);c.fill()}
  if(a.moustache==='moustache'){c.fillStyle='#39271e';c.beginPath();c.ellipse(-8,13,10,4,-.2,0,7);c.ellipse(8,13,10,4,.2,0,7);c.fill()}
  c.restore();
 },
 celebrationBody(c,p,g,type,t,defeated=false){
  const quiet=this.reduced()||settings.quality==='low',wave=quiet?0:Math.sin(t*9);let arms=[[-34,-45],[34,-45]],legs=[[-15,-7],[15,-7]],angle=0;
  if(defeated){arms=[[-28,-18],[28,-18]];angle=.06}
  else if(type==='run'){arms=[[-32,-120],[32,-120]];legs=[[-15-wave*13,-7],[15+wave*13,-7]]}
  else if(type==='knees'){arms=[[-34,-110],[34,-110]];legs=[[-28,-8],[28,-8]]}
  else if(type==='dance'){arms=[[-38,-70+wave*25],[38,-70-wave*25]];angle=wave*.12}
  else if(type==='flip'){arms=[[-30,-85],[30,-85]];angle=quiet?0:Math.sin(Math.PI*clamp(t/1.7,0,1))*Math.PI*2}
  else if(type==='plane'){arms=[[-58,-77],[58,-77]];angle=wave*.06}
  else if(type==='ears'){arms=[[-31,-105],[31,-105]]}
  else if(type==='bow'){arms=[[-25,-40],[25,-40]];angle=quiet?.12:Math.sin(Math.PI*clamp(t/1.7,0,1))*.5}
  c.save();c.translate(p.x,p.y-45);c.rotate(angle);c.translate(0,45);
  c.strokeStyle=p.profile.skin;c.lineWidth=11;c.lineCap='round';
  for(const [i,side] of [-1,1].entries()){
   c.beginPath();c.moveTo(side*15,-68);c.lineTo(...arms[i]);c.stroke();
   c.beginPath();c.moveTo(side*9,-34);c.lineTo(legs[i][0],legs[i][1]-13);c.stroke();
   c.strokeStyle=p.profile.socks;c.beginPath();c.moveTo(legs[i][0],legs[i][1]-15);c.lineTo(...legs[i]);c.stroke();c.strokeStyle=p.profile.skin;
   c.fillStyle='#142033';c.fillRect(legs[i][0]-6,legs[i][1]-4,20,9);
  }
  c.fillStyle=p.profile.shorts;c.fillRect(-21,-45,42,19);c.fillStyle=p.profile.shirt;c.beginPath();c.moveTo(-19,-78);c.lineTo(19,-78);c.lineTo(24,-43);c.lineTo(-24,-43);c.closePath();c.fill();
  c.save();if(p.profile.kit)Clubs.shirt(c,p.profile.kit);c.restore();c.fillStyle='#fff';c.font='bold 18px system-ui';c.textAlign='center';c.fillText(p.profile.number,0,-51);c.restore();
 }
};
(function(){
 const visual=PersonalidadVisual;profiles.forEach(p=>visual.normalize(p));
 const ancho=new ResizeObserver(([entry])=>{if(entry.contentRect.width>0)visual.escalaEtiqueta=Math.max(1,12*W/(14*entry.contentRect.width))});ancho.observe($('pitch'));
 const player=renderer.player.bind(renderer);
 renderer.player=function(p,g,context){
  const c=context||this.c,profile=p.profile;
  const copy=Object.assign(Object.create(Object.getPrototypeOf(p)),p,{profile});
  if(g.state==='paused'&&g.previousState==='goal')g={...g,state:'goal'};
  const celebrating=g.state==='goal',time=g.visualTime??(g.state==='result'?(g.demoTime||0)%1.7:visual.goalTime);
  if(celebrating&&!context&&!visual.reduced()){
   const winner=copy.team===g.goalTeam,type=visual.choices.get(copy.i)||'run';
   if(winner){const scorer=g.players.find(q=>q.i===visual.scorer);let shift=copy.i===visual.scorer?(type==='run'?Math.sin(time*3)*24:type==='knees'?Math.sin(time*2)*24:0):scorer?Math.sign(scorer.x-copy.x)*Math.min(70,Math.max(0,Math.abs(scorer.x-copy.x)-65))*Math.sin(Math.PI*Math.min(1,time/1.7)):0;
    const occupied=g.players.some(q=>q.team!==copy.team&&Math.abs(q.x-(copy.x+shift))<70);if(occupied||(g.ball.x>=Math.min(copy.x,copy.x+shift)-g.ball.r-42&&g.ball.x<=Math.max(copy.x,copy.x+shift)+g.ball.r+42))shift=0;
    copy.x=clamp(copy.x+shift,GOALDEPTH+42,W-GOALDEPTH-42);if(type==='flip')copy.y-=Math.sin(Math.PI*Math.min(1,time/1.7))*22;
   }
  }
  if(g.state==='countdown'&&visual.returnAge<.28&&!visual.reduced()){const from=visual.returnFrom.get(copy.i);if(from){const t=clamp(visual.returnAge/.28,0,1),blend=t*t*(3-2*t);copy.x=from.x+(copy.x-from.x)*blend;copy.y=from.y+(copy.y-from.y)*blend}}
  const result=g.state==='result',draw=result&&g.penaltyWinner==null&&g.score[0]===g.score[1];
  const team=celebrating?g.goalTeam:(g.penaltyWinner??(g.score?.[0]>g.score?.[1]?0:1));
  const winner=copy.team===team,scorer=g.players?.find(q=>q.i===visual.scorer);
  const leader=visual.choices.get(visual.scorer),paired=celebrating&&winner&&Festejos.pares.includes(leader)&&!g.preview;
  const own=g.visualChoice||visual.choices.get(copy.i)||'run';
  const type=(celebrating||result)?(draw?'bow':paired?leader:celebrating&&!g.preview&&copy.i!==visual.scorer&&winner?'ears':own):null;
  const quiet=visual.reduced(),t=quiet?.65:time,u=clamp(t/1.7,0,1),arc=Math.sin(Math.PI*u);
  let rotation=0;
  if(type&&winner&&!draw){
   if(paired&&scorer&&!quiet){const mate=g.players.find(q=>q.team===team&&q.i!==scorer.i);if(mate){const middle=(mate.x+scorer.x)/2,side=copy.i===scorer.i?-1:1,space=type==='hug'?19:type==='chest'?20:38,amount=Math.min(1,arc*2);copy.x=p.x+(middle+side*space-p.x)*amount}}
   if(!quiet){
    if(type==='cartwheel'||type==='backflip'){rotation=(type==='backflip'?-1:1)*Math.PI*2*u;copy.y-=arc*34}
    if(type==='worm'){rotation=1.35*arc;copy.y+=30*arc+4*Math.sin(t*10)*arc}
    if(type==='chest'||type==='pairJump')copy.y-=Math.max(0,Math.sin((u-.25)*Math.PI*2))*27;
    if(type==='moon'||type==='longSlide')copy.x+=arc*(type==='moon'?-22:36);
   }
  }
  if(!context)visual.lastDrawn.set(copy.i,{x:copy.x,y:copy.y});
  c.save();if(rotation){c.translate(copy.x,copy.y-69);c.rotate(rotation);c.translate(-copy.x,-copy.y+69)}
  if(!settings.estiloClasico||Festejos.nombres[type]){
   Cuerpo.draw(c,copy,g,type,t,!!type&&!draw&&!winner);
  }else if(type){visual.celebrationBody(c,copy,g,type,t,!winner&&!draw)}
  else{const body=Object.assign(Object.create(Object.getPrototypeOf(copy)),copy,{profile:{...profile,head:0,photo:null,name:''}});player(body,g,context)}
  if(settings.estiloClasico&&!Festejos.nombres[type]){c.save();c.translate(copy.x,copy.y);Vestuario.cuerpo(c,copy,Cuerpo.pose(copy,g,type,t,!winner));c.restore()}
  visual.head(c,copy,rotation&&profile.photo?{...g,fotoRotation:rotation}:g);
  if(type&&winner&&!draw)Festejos.props(c,copy,type,t,celebrating&&!context&&copy.i===visual.scorer?visual.especial:null);
  c.restore();
  if(!g.omitirEtiqueta)visual.etiqueta(c,copy,!context||c.canvas===renderer.c.canvas);
 };
 const goal=game.goal.bind(game);game.goal=function(...args){const state=this.state;const result=goal(...args);if(state==='playing'&&this.state==='goal'){this.goalTimer=1.7;visual.goal(this)}return result};
 const afterGoal=game.afterGoal.bind(game);game.afterGoal=function(...args){visual.returnFrom=new Map(visual.lastDrawn);const result=afterGoal(...args);visual.returnAge=0;return result};
 const update=game.update.bind(game);game.update=function(dt){if(this.state==='countdown')visual.returnAge+=dt;if(this.state==='goal')visual.goalTime=Math.min(1.7,visual.goalTime+dt);return update(dt)};
 const shoot=game.shoot.bind(game);game.shoot=function(p,special){const touches=p.stats.touches;const result=shoot(p,special);if(!special&&p.stats.touches===touches)p._missExpressionUntil=this.elapsed+.8;return result};
 const skip=document.createElement('button');skip.id='skipCelebration';skip.className='small hidden';skip.textContent='Saltar festejo';document.querySelector('.arenaActions').prepend(skip);skip.onclick=()=>{if(game.state==='goal'){game.goalTimer=0;game.hitStop=0}};
 const draw=renderer.draw.bind(renderer);renderer.draw=function(g){skip.classList.toggle('hidden',g.state!=='goal');draw(g)};
 window.addEventListener('keydown',event=>{if(event.code==='Space'&&!Mobile.editable(event.target)&&game.state==='goal'){event.preventDefault();skip.click()}});
 persist();
})();

