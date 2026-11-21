// Cápsulas locales: [x1,y1,x2,y2,radio,restitución,color].
const Contacto = {
  debug:new URLSearchParams(location.search).get('hitbox')==='1',
  zonas(p,clasico=false){
    const perfil=p.profile, r=36*perfil.head*(p.effects.giant>0?1.45:1);
    const zonas=[[0,-99+(p.slide>0?27:0),0,-99+(p.slide>0?27:0),r,.87,'#ffcf59']];
    if(clasico){
      const z=Math.sin(p.walk)*13,s=p.slide>0?35*p.face:0;
      return zonas.concat([[0,-65,0,-35,17,.52,'#69daff'],[-9,-35,-12-z+s,-7,9,.7,'#b9ff6b'],[9,-35,12+z+s,-7,9,.7,'#b9ff6b']]);
    }
    const pose=Cuerpo.pose(p), offset=pose.drop;
    zonas.push([pose.lean,-65+offset,0,-35+offset,17,.52,'#69daff']);
    for(let i=0;i<2;i++){
      const side=i?1:-1, foot=pose.feet[i],active=p.kick>0&&side===p.face;
      zonas.push([side*9,-35+offset,foot[0],foot[1]+offset-4,8,active?.82:.69,active?'#ff8f63':'#c5abff']);
      zonas.push([foot[0]-p.face*2,foot[1]+offset,foot[0]+p.face*6,foot[1]+offset,6,.73,'#adff74']);
    }
    return zonas;
  },
  resolver(physics,b,p,zonas){
    let hit=false;
    for(const [x,y,endX,endY,r,restitution] of zonas){
      const ax=p.x+x,ay=p.y+y,dx=endX-x,dy=endY-y,len=dx*dx+dy*dy;
      const t=len?clamp(((b.x-ax)*dx+(b.y-ay)*dy)/len,0,1):0;
      // El primer impacto a lo largo del subpaso puede ser en el lateral de la
      // cápsula, no en su centro más cercano al final de la trayectoria.
      if(len&&Number.isFinite(b._sweepX)){
        const length=Math.sqrt(len),nx=-dy/length,ny=dx/length;
        const d0=(b._sweepX-ax)*nx+(b._sweepY-ay)*ny,d1=(b.x-ax)*nx+(b.y-ay)*ny;
        const R=b.r+r,sg=Math.sign(d0);
        if(Math.abs(d0)>R&&d1*sg<R){
          const tHit=(sg*R-d0)/(d1-d0),px=b._sweepX+(b.x-b._sweepX)*tHit,py=b._sweepY+(b.y-b._sweepY)*tHit;
          const along=((px-ax)*dx+(py-ay)*dy)/len;
          if(along>=0&&along<=1){b.x=px-nx*sg*.01;b.y=py-ny*sg*.01;
            hit=physics.circle(b,ax+dx*along,ay+dy*along,r,p.vx,p.vy,restitution)||hit;continue}
        }
      }
      hit=physics.circle(b,ax+t*dx,ay+t*dy,r,p.vx,p.vy,restitution)||hit;
    }
    return hit;
  },
  dibujar(c,players,ball){
    if(!this.debug)return;
    c.save();c.lineCap='round';
    for(const p of players)for(const [x,y,bx,by,r,,color] of this.zonas(p,settings.estiloClasico)){
      c.beginPath();c.strokeStyle=color;c.fillStyle=color;c.globalAlpha=.32;
      if(x===bx&&y===by){c.arc(p.x+x,p.y+y,r,0,Math.PI*2);c.fill();c.lineWidth=1;c.globalAlpha=1;c.stroke()}
      else{c.lineWidth=2*r;c.moveTo(p.x+x,p.y+y);c.lineTo(p.x+bx,p.y+by);c.stroke();c.globalAlpha=1;c.lineWidth=1;c.stroke()}
    }
    c.globalAlpha=1;c.lineWidth=2;c.strokeStyle='#fff';c.beginPath();c.arc(ball.x,ball.y,ball.r,0,Math.PI*2);c.stroke();c.restore();
  }
};
