// Piezas articuladas en coordenadas del jugador. La cabeza se dibuja por separado.
const Cuerpo = {
  tonos: ['#f4d2b7','#e9b991','#d59b75','#bd815a','#9d674c','#80503b','#603d32','#442f29'],
  sombras:new Map(),
  sombra(color){
    if(!this.sombras.has(color)){
      const n=parseInt(color.slice(1),16);
      this.sombras.set(color,'rgb('+[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.round(v*.72)).join(',')+')');
    }
    return this.sombras.get(color);
  },
  forma(c, d, color, borde = true) {
    c.fillStyle = color;
    const path = typeof color==='string'?Vestuario.trazo(d):new Path2D(d);
    c.fill(path);
    if (borde) { c.strokeStyle = '#162231ab'; c.lineWidth = 1.15; c.stroke(path); }
    return path;
  },
  pieza(c, a, b, ancho, punta, color) {
    const dx=b[0]-a[0], dy=b[1]-a[1], largo=Math.max(1,Math.hypot(dx,dy));
    c.save(); c.translate(...a); c.rotate(Math.atan2(dy,dx)-Math.PI/2);
    const pintura=c.createLinearGradient(-ancho,0,ancho,0);
    pintura.addColorStop(0,color); pintura.addColorStop(.52,color); pintura.addColorStop(1,Cuerpo.sombra(color));
    this.forma(c,'M '+(-ancho*.65)+' 0 Q '+(-ancho*1.25)+' '+largo*.37+' '+(-punta)+' '+largo+' Q 0 '+(largo+punta*.6)+' '+punta+' '+largo+' Q '+ancho*1.3+' '+largo*.38+' '+ancho*.65+' 0 Z',pintura);
    c.strokeStyle='#fff5'; c.lineWidth=1; c.beginPath(); c.moveTo(-ancho*.65,2); c.quadraticCurveTo(-ancho*.93,largo*.42,-punta*.8,largo*.78); c.stroke();
    c.restore();
  },
  bota(c, x,y,dir,p) {
    c.save(); c.translate(x,y); c.scale(dir,1);
    this.forma(c,'M -7 -8 Q -3 -6 2 -8 Q 5 -4 13 -3 Q 18 -2 16 1 Q 9 4 -8 2 Z',p.shoe==='white'?'#f1f2dd':p.shoe==='neon'?(p.kit?.accent||p.socks):p.shorts);
    this.forma(c,'M -7 1 Q 3 3 16 0 L 16 3 L 11 4 L 10 6 L 8 6 L 8 4 L -2 4 L -3 6 L -5 6 L -5 3 Z','#233241',false);
    c.strokeStyle='#faf8d9'; c.lineWidth=1.2; c.beginPath(); c.moveTo(1,-6); c.lineTo(5,-4); c.moveTo(4,-5); c.lineTo(8,-3); c.stroke(); c.restore();
  },
  pose(p,g={},type=null,time=0,defeated=false) {
    const phase=p.walk||0, speed=Math.min(1,Math.abs(p.vx||0)/280);
    const stride=Math.sin(phase)*13*speed, face=p.face||1, air=p.grounded===false;
    const slide=p.slide>0?35*face:0, dip=Math.min(4,(p.squash||0)*12);
    const feet=[[-12-stride+slide,-7],[12+stride+slide,-7]];
    const hands=[[-29+stride*.65,-42],[29-stride*.65,-42]];
    const lean=clamp((p.vx||0)*.012+(p.inclinacion||0)+face*(p.hit||0)*12,-7,7);
    let angle=0;
    for(let i=0;i<2;i++){
      feet[i][1]-=air?(i===0?8:4):Math.max(0,Math.cos(phase)*(i===0?1:-1))*6*speed;
      hands[i][1]-=air?7:Math.abs(stride)*.15;
    }
    if(p.kick>0){
      // Contacto al soltar el tiro, breve extensión y retorno sin salto de pose.
      const swing=Math.min(1,p.kick/.16),foot=feet[face>0?1:0];
      foot[0]+=face*26*swing;foot[1]-=(air?23:15)*swing;
    }
    const wave=type&&!PersonalidadVisual.reduced()?Math.sin(time*9):0;
    if(defeated){hands[0]=[-24,-27];hands[1]=[24,-27];angle=(.09+.035*Math.sin(time*5))*face;hands[p.i%2]=[face*(16+5*Math.sin(time*4)),-74]}
    else if(type){
      const gestures={run:[[-33,-113],[31,-113]],knees:[[-38,-98],[38,-98]],
        dance:[[-42,-68+wave*18],[42,-68-wave*18]],flip:[[-28,-83],[28,-83]],
        plane:[[-52,-66],[52,-66]],ears:[[-32,-94],[32,-94]],bow:[[-24,-38],[24,-38]]};
      const arms=gestures[type]||gestures.run;hands[0]=arms[0];hands[1]=arms[1];
      if(type==='run'){feet[0][0]-=wave*11;feet[1][0]+=wave*11}
      if(type==='knees'){feet[0]=[-23,-19];feet[1]=[23,-19]}
      if(type==='dance'||type==='plane')angle=wave*.09;
      if(type==='bow')angle=.27*face*Math.sin(Math.PI*clamp(time/1.7,0,1));
      if(type==='flip'&&!PersonalidadVisual.reduced())angle=2*Math.PI*clamp(time/1.2,0,1);
    }
    const drop=dip+(p.slide>0?12:0);
    for(const foot of feet)foot[1]-=drop;
    const pose={lean,drop,hands,feet,angle};return type&&!defeated?Festejos.pose(type,time,pose):pose;
  },
  draw(c,p,g,type,time,defeated) {
    const kit=p.profile, pose=this.pose(p,g,type,time,defeated),skin=kit.skin;
    c.save(); c.translate(p.x,p.y); c.lineCap='round'; c.lineJoin='round';
    const lift=clamp((FLOOR-p.y)/220,0,1);
    c.fillStyle='rgba(5,17,23,'+(.24-.13*lift)+')'; c.beginPath(); c.ellipse(0,FLOOR-p.y+1,29-10*lift,5-2*lift,0,0,Math.PI*2); c.fill();
    if(p.effects.shield>0||p.effects.magnet>0){c.beginPath();c.arc(0,-65,p.effects.shield>0?84:105,0,Math.PI*2);c.strokeStyle='#91ffe780';c.lineWidth=2;c.stroke()}
    c.scale(1,1.085); c.translate(0,-39); c.rotate(pose.angle); c.translate(0,39+pose.drop);
    for (const [i,side] of [-1,1].entries()) {
      const foot=pose.feet[i], hip=[side*9,-34], knee=[(hip[0]+foot[0])*.5+p.face*2,(hip[1]+foot[1])*.5-2];
      this.pieza(c,hip,knee,7.5,5.4,skin);
      this.pieza(c,knee,[foot[0],foot[1]-3],5.4,3.6,kit.socks);
      c.fillStyle='#ffffff65'; c.fillRect(knee[0]-4,knee[1]+2,8,1.4);
      this.bota(c,...foot,p.face,kit);
      const shoulder=[side*16+pose.lean,-65], hand=pose.hands[i], elbow=[(shoulder[0]+hand[0])*.5+side*4,(shoulder[1]+hand[1])*.5+4];
      this.pieza(c,shoulder,elbow,5.7,4.2,skin); this.pieza(c,elbow,hand,4.5,3,skin);
      c.fillStyle=skin;c.beginPath();c.ellipse(...hand,3.8,5.3,-side*.28,0,Math.PI*2);c.fill();
    }
    this.forma(c,'M -16 -44 Q 0 -46 16 -44 L 20 -28 L 4 -27 L 0 -33 L -4 -27 L -20 -28 Z',kit.shorts);
    c.save();c.translate(pose.lean,0);
    this.forma(c,'M -6 -84 L 6 -84 L 8 -69 Q 0 -62 -8 -69 Z',skin);
    const sombraCuello=c.createLinearGradient(0,-80,0,-69);sombraCuello.addColorStop(0,'#28203077');sombraCuello.addColorStop(1,'#28203000');c.fillStyle=sombraCuello;c.fillRect(-6,-80,12,11);
    const d='M -8 -72 Q -17 -75 -21 -69 L -25 -58 L -17 -54 L -14 -59 Q -12 -52 -16 -43 Q 0 -39 16 -43 L 14 -59 L 18 -54 L 25 -58 L 20 -69 Q 14 -74 8 -72 Q 0 -65 -8 -72 Z';
    const jersey=this.forma(c,d,kit.shirt);
    c.save();c.clip(jersey);if(kit.kit){c.beginPath();c.rect(-27,-80,54,44);Clubs.shirt(c,kit.kit)}
    const shade=c.createLinearGradient(-20,-70,16,-44);shade.addColorStop(0,'#ffffff45');shade.addColorStop(.43,'#ffffff00');shade.addColorStop(1,'#111b315c');c.fillStyle=shade;c.fillRect(-26,-80,52,42);c.restore();
    this.forma(c,'M -9 -73 L 0 -69 L 9 -73 L 7 -68 L 0 -65 L -7 -68 Z',kit.kit?.accent||kit.socks,false);
    c.strokeStyle='#ffffff54';c.lineWidth=1;c.beginPath();c.moveTo(-12,-46);c.lineTo(-5,-45);c.moveTo(14,-50);c.lineTo(9,-49);c.stroke();
    c.font='bold 13px system-ui';c.textAlign='center';c.strokeStyle='#162234';c.lineWidth=2.7;c.strokeText(kit.number,0,-47);c.fillStyle='#fff';c.fillText(kit.number,0,-47);c.restore();
    Vestuario.cuerpo(c,p,pose);
    if(p.effects.freeze>0){c.fillStyle='#84daff55';c.fillRect(-32,-82,64,82)}
    if(p.charge>0){c.fillStyle='#142033';c.fillRect(-25,9,50,4);c.fillStyle='#ffe38a';c.fillRect(-25,9,50*p.charge/1.25,4)}
    c.restore();
  },
  paleta(){
    for(const input of document.querySelectorAll('#profiles [data-field="skin"]')){
      const group=document.createElement('div');group.className='tonos';group.setAttribute('role','group');group.setAttribute('aria-label','Tonos de piel');
      for(const [i,color] of this.tonos.entries()){
        const b=document.createElement('button');b.type='button';b.style.background=color;b.setAttribute('aria-label','Tono de piel '+(i+1));
        b.onclick=()=>{input.value=color;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))};group.append(b);
      }
      input.parentElement.append(group);
    }
  }
};
