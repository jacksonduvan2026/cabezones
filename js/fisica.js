class Physics{
 static circle(b,x,y,r,vx=0,vy=0,restitution=.78){let dx=b.x-x,dy=b.y-y,dist=Math.hypot(dx,dy),min=b.r+r;if(dist>=min)return false;if(dist<.0001){dx=0;dy=-1;dist=1}const nx=dx/dist,ny=dy/dist;b.x=x+nx*(min+.1);b.y=y+ny*(min+.1);const vn=(b.vx-vx)*nx+(b.vy-vy)*ny;if(vn<0){b.vx-=(1+restitution)*vn*nx;b.vy-=(1+restitution)*vn*ny;b.spin+=((b.vx-vx)*ny-(b.vy-vy)*nx)*.006}return true}
 static segment(b,x1,y1,x2,y2,r,vx,vy){const dx=x2-x1,dy=y2-y1,t=clamp(((b.x-x1)*dx+(b.y-y1)*dy)/(dx*dx+dy*dy||1),0,1);return this.circle(b,x1+t*dx,y1+t*dy,r,vx,vy)}
 // Protección exclusiva de 2 vs 2: las proyecciones entre piernas no pueden
 // expulsar el balón debajo del suelo. Si persiste, buscar el hueco libre más cercano.
 static releaseCrowded(g,h){const b=g.ball,buried=b.y+b.r>FLOOR+.1;g.cupTrapped=buried?(g.cupTrapped||0)+h:Math.max(0,(g.cupTrapped||0)-h*.2);
 if(buried){b.y=FLOOR-b.r;if(b.vy>0)b.vy=-b.vy*.74}
 b.x=clamp(b.x,17+b.r,W-17-b.r);b.y=Math.max(95+b.r,b.y);
 if(b.y<GOALTOP)b.x=clamp(b.x,GOALDEPTH+b.r,W-GOALDEPTH-b.r);
 if(g.cupTrapped<.22)return;
 const clear=x=>g.players.every(p=>{if(Math.hypot(x-p.x,b.y-p.headY)<p.radius+b.r+1)return false;const stride=Math.sin(p.walk)*13,slide=p.slide>0?35:0;const segments=[[p.x,p.y-65,p.x,p.y-35,17],[p.x-9,p.y-35,p.x-12-stride+slide*p.face,p.y-7,9],[p.x+9,p.y-35,p.x+12+stride+slide*p.face,p.y-7,9]];return segments.every(([x1,y1,x2,y2,r])=>{const dx=x2-x1,dy=y2-y1,t=clamp(((x-x1)*dx+(b.y-y1)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(x-x1-t*dx,b.y-y1-t*dy)>b.r+r+1})});
 const prefer=b.vx<0?-1:1;for(let n=5;n<450;n+=5)for(const sign of [prefer,-prefer]){const x=b.x+n*sign;if(x<GOALDEPTH+b.r||x>W-GOALDEPTH-b.r||!clear(x))continue;b.x=x;b.vx=sign*Math.max(160,Math.abs(b.vx));b.vy=Math.min(b.vy,-120);g.cupTrapped=0;return}
 }
 static step(g,dt){const b=g.ball;const sub=3,h=dt/sub;for(let s=0;s<sub;s++){
 if(!(b.ground>0))b.vy+=g.gravity*(b.heavy>0?1.6:.86)*h;if(b.curve>0)b.vy+=550*h;b.vx+=(g.config.weather==='wind'?135*Math.sin(g.elapsed*.3)+70:0)*h;b.vy+=clamp(b.spin*b.vx*.028,-100,100)*h;if(!(b.precise>0)){b.vx*=Math.exp(-.055*h);b.vy*=Math.exp(-.035*h)}if(!settings.classic){b._sweepX=b.x;b._sweepY=b.y}b.x+=b.vx*h;b.y+=b.vy*h;b.angle+=b.spin*h;b.spin*=Math.exp(-.4*h);
 if(b.y+b.r>FLOOR){b.y=FLOOR-b.r;if(b.vy>45){b.vy=-b.vy*(g.config.weather==='snow'?.62:.74);if(Math.abs(b.vy)>90&&g.bounceCD<=0){sound.play('bounce');g.bounceCD=.1}}else b.vy=0;b.vx*=Math.exp(-(g.config.weather==='rain'?.25:1.15)*h);b.spin+=(b.vx/b.r-b.spin)*h*5}
 if(b.y-b.r<95){b.y=95+b.r;b.vy=Math.abs(b.vy)*.82}
 // Las paredes superiores y los postes cierran los bordes de la cancha.
 for(const side of [0,1]){const gx=side?W-GOALDEPTH:GOALDEPTH;
 if(b.y<GOALTOP){if(!side&&b.x-b.r<gx){b.x=gx+b.r;b.vx=Math.abs(b.vx)*.82}if(side&&b.x+b.r>gx){b.x=gx-b.r;b.vx=-Math.abs(b.vx)*.82}}
 this.circle(b,gx,GOALTOP,7,0,0,.86);
 if(g.goalIce[side]>0&&b.y>=GOALTOP){if(!side&&b.x-b.r<gx){b.x=gx+b.r;b.vx=Math.abs(b.vx)*1.05}if(side&&b.x+b.r>gx){b.x=gx-b.r;b.vx=-Math.abs(b.vx)*1.05}}
 }
 if(b.x-b.r<17){b.x=17+b.r;b.vx=Math.abs(b.vx)*.7}if(b.x+b.r>W-17){b.x=W-17-b.r;b.vx=-Math.abs(b.vx)*.7}
 for(const p of g.players){let hit=false;const hy=p.headY;
 if(typeof Cuerpo!=='undefined'&&(!settings.estiloClasico||p.profile.figureScale===.89)){
   if(!p.zonasContacto)p.zonasContacto=Contacto.zonas(p,settings.estiloClasico);
   hit=Contacto.resolver(this,b,p,p.zonasContacto);
 }else{
 hit=this.circle(b,p.x,hy,p.radius,p.vx,p.vy,.87)||hit;
 hit=this.segment(b,p.x,p.y-65,p.x,p.y-35,17,p.vx,p.vy)||hit;
 const stride=Math.sin(p.walk)*13,slide=p.slide>0?35:0;
 hit=this.segment(b,p.x-9,p.y-35,p.x-12-stride+slide*p.face,p.y-7,9,p.vx,p.vy)||hit;
 hit=this.segment(b,p.x+9,p.y-35,p.x+12+stride+slide*p.face,p.y-7,9,p.vx,p.vy)||hit;
 }
 if(p.effects.shield>0)hit=this.circle(b,p.x,p.y-65*(p.profile.figureScale===1?1:.89),83*(p.profile.figureScale===1?1:.89),p.vx,p.vy,1.1)||hit;
 if(hit&&g.elapsed-(g.touchTimes[p.i]??-1)>.13){g.touchTimes[p.i]=g.elapsed;p.hit=.28;p.energy=clamp(p.energy+8,0,100);p.stats.touches++;g.lastTouch=p.i;g.practiceTouches++;if(p.slide>0){b.vx=p.face*630;b.vy=-220}if(g.ball.vy<0&&Math.abs(p.vx)>100)b.vx+=p.face*40;}
 }
 if(g.config.mode==='cup')this.releaseCrowded(g,h);
 b.vx=clamp(b.vx,-1450,1450);b.vy=clamp(b.vy,-1300,1300);
 if(b.y-b.r>GOALTOP+3){if(b.x+b.r<GOALDEPTH){g.goal(1);return}if(b.x-b.r>W-GOALDEPTH){g.goal(0);return}}
 }
 b.curve=Math.max(0,(b.curve||0)-dt);b.ground=Math.max(0,(b.ground||0)-dt);b.precise=Math.max(0,(b.precise||0)-dt);b.fire=Math.max(0,b.fire-dt);b.heavy=Math.max(0,b.heavy-dt);b.fast=Math.max(0,b.fast-dt);
 // Anti-bloqueo: impulsa suavemente un balón inmóvil fuera del alcance del juego.
 if(Math.abs(b.vx)+Math.abs(b.vy)<12&&b.y<FLOOR-55)g.stuck+=dt;else g.stuck=0;if(g.stuck>1.3){b.vx=rand(-140,140);b.vy=-230;g.stuck=0}
 }
}
// ─── Flujo de partido, objetos, torneo y repetición de estados. ───
