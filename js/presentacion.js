/* Presentation owns pixels only. Simulation continues in inicio.js at 120 Hz. */
const Presentation = {
 scene: null,
 install() {
  const arena=document.querySelector('.arena');
  const host=document.createElement('div');host.id='phaserView';arena.prepend(host);
  const style=document.createElement('style');
  style.textContent='#phaserView{position:absolute;inset:0;pointer-events:none;z-index:0}#phaserView canvas{display:block;object-fit:contain}#pitch{opacity:0}.arena{position:relative}.hud,.arenaActions,.energy,#banner,#touch{z-index:9}';document.head.append(style);
  const scenes=[CargaScene,MenuScene,SeleccionScene,PartidoScene,PausaScene,ResultadosScene,CopaScene];
  this.engine=new Phaser.Game({type:Phaser.CANVAS,width:1200,height:650,parent:host,resolution:1,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1200,height:650,zoom:1},transparent:true,audio:{noAudio:true},input:{mouse:false,touch:false,keyboard:false},scene:scenes,banner:false,fps:{target:60}});
  const draw=renderer.draw.bind(renderer);
  renderer.draw=g=>{
   draw(g);
   const key=g.state==='paused'?'pausa':g.state==='result'?'resultados':g.state==='bracket'?'copa':g.active?'partido':!$('clubModal').classList.contains('hidden')?'seleccion':'menu';
   if(this.engine.isBooted&&this.current!==key){for(const scene of this.engine.scene.getScenes(true))this.engine.scene.stop(scene.scene.key);this.engine.scene.start(key);this.current=key;}
  };
  const atlas=new Image();atlas.src='img/cuerpos.png';const ball=new Image();ball.src='img/balon.png';
  const originalPlayer=renderer.player.bind(renderer);
  renderer.player=function(p,g,context){
   const c=context||this.c;
   if(!atlas.complete||!atlas.naturalWidth||p.effects.freeze>0||p.effects.giant>0)return originalPlayer(p,g,context);
   // Body atlas uses seven poses. Team pattern stays in the original shirt renderer.
   const goal=g.state==='goal',pose=goal?(g.goalTeam===(p.team??p.i)?5:6):p.kick>0?3:p.hit>.1?4:!p.grounded?2:Math.abs(p.vx)>20?1:0;
   const frame=Math.floor((p.walk||g.demoTime)*2)%4;
   c.save();c.beginPath();c.rect(p.x-100,p.y-210,200,127);c.rect(p.x-100,p.y+10,200,50);c.clip();originalPlayer(p,g,context);c.restore();
   c.save();c.translate(p.x,p.y);c.scale(p.face===-1?-1:1,1);c.drawImage(atlas,(pose*4+frame)*160,0,160,110,-80,-90,160,110);
   c.fillStyle=p.profile.shorts;c.fillRect(-20,-43,40,17);c.fillStyle=p.profile.shirt;c.beginPath();c.moveTo(-19,-78);c.lineTo(19,-78);c.lineTo(24,-43);c.lineTo(-24,-43);c.fill();if(p.profile.kit)Clubs.shirt(c,p.profile.kit);c.fillStyle=p.profile.socks;c.fillRect(-19,-22,10,13);c.fillRect(10,-22,10,13);c.restore();
   c.save();c.beginPath();c.rect(p.x-100,p.y-220,200,158);c.clip();originalPlayer(p,g,context);c.restore();
  };
  const originalBall=renderer.ball.bind(renderer);renderer.ball=function(b){if(!ball.complete||!ball.naturalWidth||b.fire>0||b.fast>0)return originalBall(b);const c=this.c;c.save();c.translate(b.x,b.y);c.rotate(b.angle);c.drawImage(ball,-b.r,-b.r,b.r*2,b.r*2);c.restore()};
 }
};
Presentation.install();
(function () {
 const skyline=new Image();skyline.src='img/ciudad.png';
 const stadium=renderer.stadium.bind(renderer);
 renderer.stadium=function(g){stadium(g);if(skyline.complete&&skyline.naturalWidth){this.c.save();this.c.beginPath();this.c.rect(0,90,1200,100);this.c.clip();const offset=Math.sin(g.demoTime*.08)*7;this.c.drawImage(skyline,offset,0,1200,220);this.c.restore()}};
 const circle=Physics.circle;
 Physics.circle=function(b,x,y,r,vx,vy,restitution){const speed=Math.hypot(b.vx,b.vy);const hit=circle.call(this,b,x,y,r,vx,vy,restitution);if(hit&&speed>160&&performance.now()-(this.lastSound||0)>100){this.lastSound=performance.now();sound.play(r===7?'post':r>=28?'head':'bounce')}return hit};
 const goal=game.goal.bind(game);game.goal=function(team){const state=this.state;goal(team);if(state==='playing'&&this.state==='goal')sound.play('net')};
})();
