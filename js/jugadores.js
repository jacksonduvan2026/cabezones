class Player{
 constructor(i,profile){this.i=i;this.team=i;this.human=i;this.skillCD=0;this.aiming=0;this.profile={...profile};this.energy=0;this.stats={goals:0,shots:0,touches:0,possession:0,powers:0};this.effects={};this.reset()}
 reset(){if(typeof Fluidez!=='undefined')Fluidez.anterior.delete(this);this.zonasContacto=null;this.inclinacion=0;this.ultimoAlcance=0;this.x=this.spawnX??(this.i?895:305);this.y=FLOOR;this.vx=0;this.vy=0;this.face=this.team===0?1:-1;this.grounded=true;this.charge=0;this.kick=0;this.slide=0;this.slideCD=0;this.squash=0;this.hit=0;this.walk=0;this.jumpHeld=false;this.aiCharge=0;this.aiCooldown=0;this.aiming=0;this.airJump=false}
 get radius(){return 36*this.profile.head*(this.effects.giant>0?1.45:1)*(this.profile.figureScale===1?1:.89)}
 get headY(){return this.y+(-99+(this.slide>0?27:0))*(this.profile.figureScale===1?1:.89)}
 update(dt,a,g){this.zonasContacto=null;
 if(!settings.estiloClasico)this.ultimoAlcance=Skills.near(this,g)?.1:Math.max(0,(this.ultimoAlcance||0)-dt);
 Skills.update(this,g,dt);if(this.effects.stasis>0){this.effects.stasis=Math.max(0,this.effects.stasis-dt);this.vx=0;this.vy=0;return}if(a.jumpPressed&&!this.grounded&&this.airJump&&this.effects.doubleJump>0){this.vy=-650;this.airJump=false;g.burst(this.x,this.y,12,"#c8ff5f",160)}for(const k in this.effects)this.effects[k]-=dt;this.kick=Math.max(0,this.kick-dt);this.slide=Math.max(0,this.slide-dt);this.slideCD=Math.max(0,this.slideCD-dt);this.hit=Math.max(0,this.hit-dt*3);this.squash=Math.max(0,this.squash-dt*4);if(this.effects.freeze>0){this.vx*=.8;a={}};
 const dir=(a.right?1:0)-(a.left?1:0);if(dir)this.face=dir;const speed=this.slide>0?580:280;this.vx+=(dir*speed-this.vx)*Math.min(1,dt*(this.grounded?(settings.estiloClasico?15:17):(settings.estiloClasico?5:4.6)));if(this.slide>0)this.vx=this.face*580;
 if(!settings.estiloClasico){const desired=clamp((dir*speed-this.vx)*.024,-4,4);this.inclinacion+= (desired-this.inclinacion)*Math.min(1,dt*18)}
 if(a.jumpPressed&&this.grounded){this.vy=this.effects.jump>0?-830:-650;this.grounded=false;if(Math.abs(g.ball.x-this.x)<160)this.energy=clamp(this.energy+4,0,100);g.burst(this.x,this.y,8,'#c4dcba',150)}
 if(a.tacklePressed&&this.grounded&&this.slideCD<=0){this.slide=.27;this.slideCD=1.1;g.burst(this.x,this.y-5,12,'#d2c9a1',170)}
 if(a.kick){this.charge=clamp(this.charge+dt,0,1.25)}if(a.kickReleased){g.shoot(this,false);this.charge=0}if(a.specialPressed){Skills.use(this,g)}
 this.vy+=g.gravity*dt;this.x=clamp(this.x+this.vx*dt,GOALDEPTH+22,W-GOALDEPTH-22);this.y+=this.vy*dt;if(this.y>=FLOOR){if(!this.grounded&&this.vy>220){this.squash=.3;g.burst(this.x,FLOOR,10,'#c5d0bd',170)}this.y=FLOOR;this.vy=0;this.grounded=true}else this.grounded=false;this.walk+=Math.abs(this.vx)*dt*.035;
 if(this.effects.magnet>0&&Math.hypot(g.ball.x-this.x,g.ball.y-this.headY)<220){g.ball.vx+=(this.x+this.face*42-g.ball.x)*dt*3;g.ball.vy+=(this.headY-g.ball.y)*dt*2}
 }
 snapshot(){return{x:this.x,y:this.y,vx:this.vx,vy:this.vy,face:this.face,walk:this.walk,kick:this.kick,slide:this.slide,squash:this.squash,hit:this.hit,charge:this.charge,energy:this.energy,effects:{...this.effects},i:this.i,team:this.team,profile:this.profile}}
}
// ─── Copa: calendario, tablas, llaves y puntos de guardado independientes. ───
