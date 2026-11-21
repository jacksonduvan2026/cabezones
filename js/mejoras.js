function Polish1(){
 const foot=document.createElement('div');foot.id='matchSettingsActions';foot.className='dialogfoot';
 foot.append($('exitBtn'),$('restartMatch'),$('resumeBtn'));document.querySelector('#settingsModal .dialog').append(foot);
 const pause=Game.prototype.pause;Game.prototype.pause=function(){pause.call(this);if(this.state==='paused'){UI.close('pauseModal');UI.settings()}};
 const close=UI.close.bind(UI);UI.close=function(id){close(id);if(id==='settingsModal'&&game.state==='paused'&&!Mobile.orientationPaused)game.resume()};
 // Pointer activation survives browsers that suppress synthetic clicks after game touches.
 for(const b of [$('pauseBtn'),$('resumeBtn'),$('restartMatch'),$('exitBtn')]){let id=null;
 b.addEventListener('pointerdown',e=>{if(e.button!==0)return;id=e.pointerId;e.stopPropagation();b.setPointerCapture?.(id)});
 b.addEventListener('pointercancel',()=>id=null);
 b.addEventListener('pointerup',e=>{if(e.pointerId!==id)return;id=null;const r=b.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;e.preventDefault();e.stopPropagation();b._pointerActivated=performance.now();b.onclick?.(e)});
 b.addEventListener('click',e=>{if(performance.now()-(b._pointerActivated??-1000)<500){e.preventDefault();e.stopImmediatePropagation()}},true);
 }
 // Escape also works when a settings input has keyboard focus.
 window.addEventListener('keydown',e=>{if(e.code==='Escape'&&!input.binding&&/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)&&game.active){e.preventDefault();if(!e.repeat)game.togglePause()}},true);
 const layout=Mobile.layout.bind(Mobile);Mobile.layout=function(){layout();if(this.orientationPaused)$('settingsModal').classList.add('hidden')};
}

function Polish2(){
 const circle=Physics.circle;Physics.circle=function(b,x,y,r,vx=0,vy=0,restitution=.78){
 if(settings.classic)return circle.call(this,b,x,y,r,vx,vy,restitution);
 // Swept circle: solve the first intersection along the integrated ball path.
 if(Number.isFinite(b._sweepX)&&Math.hypot(b.x-x,b.y-y)>=b.r+r){
 const dx=b.x-b._sweepX,dy=b.y-b._sweepY,ox=b._sweepX-x,oy=b._sweepY-y,R=b.r+r,A=dx*dx+dy*dy,B=2*(ox*dx+oy*dy),C=ox*ox+oy*oy-R*R,D=B*B-4*A*C;
 if(A>1e-8&&C>0&&D>=0){const t=(-B-Math.sqrt(D))/(2*A);if(t>=0&&t<=1){b.x=b._sweepX+dx*t;b.y=b._sweepY+dy*t;const nx=(b.x-x)/R,ny=(b.y-y)/R;b.x-=nx*.01;b.y-=ny*.01}}
 }
 const hit=circle.call(this,b,x,y,r,vx,vy,restitution);if(hit){b._sweepX=b.x;b._sweepY=b.y}return hit;
 };
 const segment=Physics.segment;Physics.segment=function(b,x1,y1,x2,y2,r,vx,vy){if(settings.classic)return segment.call(this,b,x1,y1,x2,y2,r,vx,vy);const dx=x2-x1,dy=y2-y1,t=clamp(((b.x-x1)*dx+(b.y-y1)*dy)/(dx*dx+dy*dy||1),0,1);return this.circle(b,x1+t*dx,y1+t*dy,r,vx,vy,r>=17?.52:.7)};
 const step=Physics.step;Physics.step=function(g,dt){if(settings.classic)return step.call(this,g,dt);const b=g.ball;const n=clamp(Math.ceil((Math.hypot(b.vx,b.vy)+600)*dt/8),1,32);for(let i=0;i<n;i++){step.call(this,g,dt/n);if(g.state!=='playing')break}delete b._sweepX;delete b._sweepY;
 b.spin=clamp(b.spin,-65,65);
 const perch=[GOALDEPTH,W-GOALDEPTH].some(x=>Math.abs(b.x-x)<b.r+10&&Math.abs(b.y-(GOALTOP-b.r-7))<8),corner=b.y>FLOOR-b.r-3&&(b.x<GOALDEPTH+30||b.x>W-GOALDEPTH-30);
 g.perchTime=(perch||corner)&&Math.hypot(b.vx,b.vy)<35?(g.perchTime||0)+dt:0;if(g.perchTime>.55){b.vx=b.x<W/2?125:-125;b.vy=-165;g.perchTime=0}
 };
 const shoot=Game.prototype.shoot;Game.prototype.shoot=function(p,special){const touches=p.stats.touches;shoot.call(this,p,special);if(!settings.classic&&!special&&p.stats.touches>touches){this.ball.vx+=p.vx*.38;this.ball.vy+=Math.min(0,p.vy)*.13;this.ball.spin+=p.vx*.012}};
}

function Polish3(){
 const update=Player.prototype.update;Player.prototype.update=function(dt,a,g){if(settings.classic)return update.call(this,dt,a,g);const x=this.x,vx=this.vx;update.call(this,dt,a,g);
 if(this.slide<=0&&!(this.effects.freeze>0)&&!(this.effects.stasis>0)){if(!a.left&&!a.right&&this.grounded){this.vx*=Math.exp(-7*dt);this.x=clamp(this.x-(vx-this.vx)*dt*.15,GOALDEPTH+22,W-GOALDEPTH-22)}
 if(this.human===null){const d=g.config.mode==='cup'?(g.config.aiLevel||.8):({easy:.5,medium:.78,hard:1}[g.config.difficulty]||.78),factor=.72+.28*d;this.x=x+(this.x-x)*factor;this.vx*=factor}}
 };
 // Correct only overlapping teammates, before ball contacts, and never move the ball.
 const step=Physics.step;Physics.step=function(g,dt){if(!settings.classic){for(let i=0;i<g.players.length;i++)for(let j=i+1;j<g.players.length;j++){const p=g.players[i],q=g.players[j];if(p.team!==q.team||Math.abs(p.y-q.y)>90)continue;const gap=Math.abs(q.x-p.x),min=settings.estiloClasico?54:Math.max(54,Math.sqrt(Math.max(0,(p.radius+q.radius)**2-(p.headY-q.headY)**2)));if(gap>=min)continue;const dir=q.x===p.x?(q.i>p.i?1:-1):Math.sign(q.x-p.x),shift=Math.max((28-gap)*.5,Math.min((min-gap)*.5,(settings.estiloClasico?180:330)*dt));p.x=clamp(p.x-dir*shift,GOALDEPTH+22,W-GOALDEPTH-22);q.x=clamp(q.x+dir*shift,GOALDEPTH+22,W-GOALDEPTH-22);if(!settings.estiloClasico&&gap<min){
 const left=dir>0?p:q,right=dir>0?q:p;
 const room=right.x-left.x,extra=Math.min(min-room,220*dt);
 if(extra>0&&left.x<=GOALDEPTH+22.01)right.x=Math.min(W-GOALDEPTH-22,right.x+extra);
 else if(extra>0&&right.x>=W-GOALDEPTH-22.01)left.x=Math.max(GOALDEPTH+22,left.x-extra);
 }if((q.vx-p.vx)*dir<0){const mean=(p.vx+q.vx)*.5;p.vx+=(mean-p.vx)*Math.min(1,dt*14);q.vx+=(mean-q.vx)*Math.min(1,dt*14)}}}return step.call(this,g,dt)};
}

function Polish4(){
 const team=TeamAI.read,solo=AI.read;
 function read(p,g,dt,classic){if(settings.classic)return classic(p,g,dt);const b=g.ball,dir=p.team===0?1:-1,d=clamp(g.config.mode==='cup'?(g.config.aiLevel||.8):({easy:.5,medium:.78,hard:1}[g.config.difficulty]||.78),.4,1),a={};p.aiCooldown=Math.max(0,p.aiCooldown-dt);p.thinkIn=(p.thinkIn||0)-dt;
 if(p.thinkIn<=0||!Number.isFinite(p.aimX)){
 p.thinkIn=.08+(1-d)*.38;
 // Bounded trajectory simulation includes the first floor and side-wall rebounds.
 let x=b.x,y=b.y,vx=b.vx,vy=b.vy;for(let t=0;t<.85;t+=1/30){vy+=g.gravity*.86/30;x+=vx/30;y+=vy/30;if(x<92){x=184-x;vx=Math.abs(vx)*.82}if(x>1108){x=2216-x;vx=-Math.abs(vx)*.82}if(y>FLOOR-b.r){y=FLOOR-b.r;vy=-Math.abs(vy)*.74}if(t>.12&&vy>0&&y>p.headY-20)break}
 const mates=g.players.filter(q=>q.team===p.team),rank=q=>Math.abs(q.x-x)+(q.human!==null?-65:0)+(q===p&&p.smartRole==='attack'?-20:0),attacker=[...mates].sort((q,r)=>rank(q)-rank(r)||q.i-r.i)[0];p.smartRole=attacker===p?'attack':'support';
 const danger=p.team===0?b.x<360:b.x>840,home=p.team===0?130:1070;
 p.aimX=p.smartRole==='attack'?x-dir*48:home+(x-home)*.42;
 if(p.smartRole==='support'&&Math.abs(p.aimX-attacker.x)<110)p.aimX=attacker.x-dir*145;
 p.aimX=clamp(p.aimX+Math.sin(g.elapsed*2.1+p.i*2.7)*(1-d)*65,110,1090);p.danger=danger;
 }
 const dead=9+(1-d)*23;a.left=p.x>p.aimX+dead;a.right=p.x<p.aimX-dead;
 const dist=Math.abs(b.x-p.x),contact=Skills.near(p,g),attacking=p.smartRole==='attack'||p.danger&&dist<100;
 if(attacking&&p.grounded&&dist<80+35*d&&b.y<p.headY-20&&b.y>170&&b.vy> -300&&p.aiCooldown<=0){a.jumpPressed=true;p.aiCooldown=.22+(1-d)*.5}
 if(attacking&&contact&&p.aiCooldown<=0&&!p.aiCharge){p.aiCharge=p.danger?.035:.12+(1-d)*.3;p.face=dir}
 if(p.aiCharge>0){p.aiCharge-=dt;a.kick=true;p.face=dir;if(p.aiCharge<=0){a.kick=false;a.kickReleased=true;p.aiCooldown=.2+(1-d)*.65}}
 if(Skills.ready(p)){const id=Skills.get(p.profile.skill).id,rival=g.players.some(q=>q.team!==p.team&&Math.abs(q.x-b.x)<130&&Math.abs(q.x-p.x)<240&&(q.charge>.1||b.vx*dir< -150));a.specialPressed=id==='freeze'?rival:id==='wall'?p.danger&&b.vx*dir<0:id==='magnet'?p.danger&&dist<200:Skills.ai(p,g)&&attacking&&(p.danger||dir*(b.x-W/2)>0);if(a.specialPressed)p.face=dir}
 if(a.kickReleased){p.face=dir;a.left=dir<0;a.right=dir>0}return a;
 }
 TeamAI.read=(p,g,dt)=>read(p,g,dt,team);AI.read=(p,g,dt)=>read(p,g,dt,solo);
 const reset=Player.prototype.reset;Player.prototype.reset=function(){reset.call(this);this.thinkIn=0;this.aimX=NaN;this.smartRole=null};
}

