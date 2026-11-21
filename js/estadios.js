class Stadiums{
 static venues=[
 ['daylight','Parque del Sol','day',['#63c2ef','#d5eddb','#468954','#3b7d49']],
 ['neon','Catedral de Neón','night',['#100b30','#394977','#23645e','#20584f']],
 ['coast','Bahía de Palmeras','beach',['#4abbd5','#d1e7de','#dfbc81','#ccaa70']],
 ['glacier','Cúpula Glacial','snow',['#4d77a5','#bddce6','#d4e5e8','#c3d6e1']],
 ['jungle','Templo de la Selva','day',['#1c625f','#7eaa87','#3c764c','#326940']],
 ['dunes','Dunas del Alba','beach',['#dc956d','#f1d7a2','#d2a66b','#c49b60']],
 ['volcano','Caldera Roja','night',['#2b1222','#853e35','#5b524b','#50453e']],
 ['lunar','Base Lunar','space',['#090e27','#3e415e','#737482','#626576']],
 ['golden','Palacio de la Gran Final','night',['#18142b','#8c7039','#436a42','#375c37']]
 ];
 static get(id){return this.venues.find(v=>v[0]===id)}
 static base(id){return this.get(id)?.[2]||id}
 static name(id){return this.get(id)?.[1]||({night:'Estadio Central',day:'Tarde de fútbol',beach:'Arena y mar',snow:'Estadio Polar',space:'Órbita cero'}[id]||id)}
 static decorate(r,g){const v=this.get(g.config.theme);if(!v)return;const c=r.c,id=v[0],time=g.demoTime;c.save();
 if(['jungle','coast','daylight'].includes(id)){for(const x of [25,95,1105,1175]){r.line(x,300,x+15,155,id==='jungle'?'#3b4f2b':'#866640',10);for(let j=0;j<5;j++){c.strokeStyle=id==='jungle'?'#3d9b62':'#398b70';c.lineWidth=13;c.beginPath();c.moveTo(x+15,155);c.quadraticCurveTo(x+Math.cos(j*1.3)*42,115,x+Math.cos(j*1.3)*68,160);c.stroke()}}}
 if(id==='dunes'||id==='volcano'||id==='glacier'){c.fillStyle=id==='volcano'?'#502528':id==='glacier'?'#c8eff2':'#d9b179';for(const x of [200,530,890]){c.beginPath();c.moveTo(x-160,220);c.lineTo(x,105);c.lineTo(x+190,220);c.fill();if(id==='volcano'){r.line(x-10,117,x+15,150,'#ff9d45',8);r.line(x+15,150,x+45,180,'#ff613d',5)}if(id==='glacier'){c.fillStyle='#f0fcff';c.beginPath();c.moveTo(x-36,130);c.lineTo(x,105);c.lineTo(x+40,130);c.fill()}}}
 if(id==='lunar'){r.circle(920,150,40,'#5885be');r.circle(909,138,16,'#71bfa9');c.strokeStyle='#bfd4fb88';c.lineWidth=3;c.beginPath();c.ellipse(600,300,480,160,0,Math.PI,Math.PI*2);c.stroke()}
 if(id==='neon'||id==='golden'){const gold=id==='golden';for(const x of [110,315,885,1090]){const grad=c.createLinearGradient(x,110,x,340);grad.addColorStop(0,gold?'#ffd76a77':'#aa82ff77');grad.addColorStop(1,'#ffffff00');c.fillStyle=grad;c.beginPath();c.moveTo(x,95);c.lineTo(x+Math.sin(time*.5+x)*120+90,350);c.lineTo(x+Math.sin(time*.5+x)*120-90,350);c.fill()}c.font='900 32px system-ui';c.textAlign='center';c.fillStyle=gold?'#ffe090':'#ccadff';c.fillText(gold?'★ LA GRAN FINAL ★':'NOCHE DE CAMPEONES',600,155)}
 // Nuevas sedes costeras también conservan gradas y aficionados.
 if(v[2]==='beach'){c.fillStyle='#182d4544';c.fillRect(0,245,W,100);for(const p of r.crowd)r.circle(p.x,p.y+20,p.r,p.color)}
 c.strokeStyle=id==='golden'?'#ffe090':'#d2f0e655';c.lineWidth=id==='golden'?4:2;c.beginPath();c.moveTo(10,340);c.lineTo(W-10,340);c.stroke();c.restore()}
}

// ─── Renderizador: estadio, muñecos articulados y efectos de cámara. ───
