const SEDES={
 nacional:['Atanasio Girardot','Medellín','metro','bowl'],medellin:['Atanasio Girardot','Medellín','metro','bowl'],
 millonarios:['Nemesio Camacho El Campín','Bogotá','monserrate','roof'],santafe:['Nemesio Camacho El Campín','Bogotá','monserrate','roof'],
 america:['Olímpico Pascual Guerrero','Cali','cali','canopy'],cali:['Deportivo Cali (Palmaseca)','Palmira','valley','canopy'],
 junior:['Romelio Martínez','Barranquilla','caribe','deco'],tolima:['Manuel Murillo Toro','Ibagué','mountains','open'],
 bucaramanga:['Américo Montanini','Bucaramanga','mountains','roof'],once:['Palogrande','Manizales','coffee','roof'],
 pereira:['Santiago de las Atalayas','Yopal · sede alterna','plains','open'],pasto:['Departamental Libertad','Pasto','volcano','open'],
 aguilas:['Cincuentenario','Medellín · sede alterna','metro','open'],alianza:['Armando Maestre Pavajeau','Valledupar','caribe','canopy'],
 chico:['La Independencia','Tunja','mountains','roof'],fortaleza:['Metropolitano de Techo','Bogotá','monserrate','open'],
 llaneros:['Bello Horizonte – Rey Pelé','Villavicencio','plains','canopy'],interbogota:['Metropolitano de Techo','Bogotá','monserrate','open'],
 cucuta:['General Santander','Cúcuta','warm','bowl'],jaguares:['Jaraguay','Montería','river','canopy'],
 boca:['Alberto J. Armando (La Bombonera)','Buenos Aires','city','bowl'],river:['Más Monumental','Buenos Aires','city','bowl'],
 racing:['Presidente Perón','Avellaneda','city','bowl'],independiente:['Libertadores de América – Ricardo E. Bochini','Avellaneda','city','roof'],
 sanlorenzo:['Pedro Bidegain','Buenos Aires','city','open'],estudiantes:['Jorge Luis Hirschi','La Plata','city','roof'],
 flamengo:['Maracanã','Río de Janeiro','mountains','bowl'],fluminense:['Maracanã','Río de Janeiro','mountains','bowl'],
 palmeiras:['Allianz Parque','São Paulo','city','roof'],santos:['Urbano Caldeira','Santos','city','open'],
 penarol:['Campeón del Siglo','Montevideo','city','bowl'],nacionaluy:['Gran Parque Central','Montevideo','city','roof']
};
const Ambiente={
 colors:['#f8ce39','#174f9c','#d53140'],clock:0,pulse:0,seed:87321,
 noise(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296},
 venue(config=game.config,opponent){let id=Clubs.matchIds(config,opponent)[0];if(config.mode==='cup'&&Cup.data){const m=Cup.current();if(m===Cup.data.final)return {name:'Palacio Dorado de Colombia',city:'Gran final de la copa',land:'gold',arch:'gold',club:id,gold:true};if(m)id=Cup.team(m.a).clubId}const a=SEDES[id]||SEDES.nacional;return {name:a[0],city:a[1],land:a[2],arch:a[3],club:id}},
 current(){return game.config.venue||this.venue()},
 speak(text){if(!settings.narrator||settings.muted||!('speechSynthesis'in window))return;const voices=speechSynthesis.getVoices();const voice=voices.find(v=>v.localService&&v.lang.toLowerCase()==='es-co')||voices.find(v=>v.localService&&/^es/i.test(v.lang));if(!voice)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.voice=voice;u.lang=voice.lang;u.rate=1.05;u.pitch=1.05;u.volume=settings.narratorVolume??.8;speechSynthesis.speak(u)},
 sync(){const enabled='speechSynthesis'in window;$('narratorBtn').disabled=!enabled;$('narratorBtn').textContent=enabled?'🎙 Narrador: '+(settings.narrator?'activo':'apagado'):'🎙 Voz no disponible';$('musicBtn').textContent='♫ Música: '+(settings.music?'activa':'apagada');if(!settings.narrator||settings.muted)window.speechSynthesis?.cancel()},
 instrument(freq,dur,gain,type='triangle',end){if(!sound.ctx||settings.muted)return;const t=sound.ctx.currentTime,o=sound.ctx.createOscillator(),g=sound.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(end)o.frequency.exponentialRampToValueAtTime(end,t+dur);g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(Math.max(.001,gain),t+.012);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(sound.master);o.start();o.stop(t+dur+.02)},
 shaker(dur=.055,gain=.015){if(!sound.ctx||settings.muted)return;const b=sound.ctx.createBuffer(1,Math.ceil(sound.ctx.sampleRate*dur),sound.ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(this.noise()*2-1)*(1-i/a.length);let s=sound.ctx.createBufferSource(),g=sound.ctx.createGain(),f=sound.ctx.createBiquadFilter();s.buffer=b;f.type='highpass';f.frequency.value=3200;g.gain.value=gain;s.connect(f);f.connect(g);g.connect(sound.master);s.start()},
 // Patrón original de cumbia: guacharaca, tambora, bajo a contratiempo y acordeón.
 beat(){let n=this.pulse++%32,menu=!game.active;const vol=settings.musicVolume,melody=[392,494,587,494,440,392,330,392,349,440,523,440,392,349,294,349];if(settings.music){this.shaker(.055,.03*vol);if(n%4===0)this.instrument(100,.2,.18*vol,'sine',38);if(n%4===2)this.instrument(175,.12,.07*vol,'triangle',95);if(n%4===3)this.instrument(n<16?98:87.3,.16,.1*vol,'triangle');if(n%2===0){let f=melody[Math.floor(n/2)];this.instrument(f,menu?.19:.12,.035*vol,'sawtooth');this.instrument(f*1.004,.19,.025*vol,'triangle')}}if(settings.crowd&&game.active&&game.state==='playing'){if(n%4===0)this.instrument(85,.18,.09,'sine',42);if(n%8===6)this.instrument(540,.23,.018,'sawtooth');if(n%16===8){[220,277,330].forEach(f=>this.instrument(f,.5,.014,'triangle'))}}},
 tick(dt){if(!sound.ctx||document.hidden||['paused','result'].includes(game.state))return;this.clock+=Math.min(dt,.06);if(this.clock>=.14){this.clock-=.14;this.beat()}},
 landscape(r,v,t){let c=r.c,warm=['caribe','river','warm','plains','valley'].includes(v.land);const gr=c.createLinearGradient(0,0,0,350);gr.addColorStop(0,v.gold?'#161b3c':warm?'#efac78':'#608fb8');gr.addColorStop(1,v.gold?'#a17b38':warm?'#ffe6ae':'#c5e6db');c.fillStyle=gr;c.fillRect(0,0,1200,358);r.circle(1000,95,30,v.gold?'#ffd778':'#ffe5ac');
 if(!['city','caribe','river','plains','gold'].includes(v.land)){for(let row=0;row<3;row++){c.fillStyle=['#557d87','#3d6a6c','#305854'][row];c.beginPath();c.moveTo(0,235+row*25);for(let x=0;x<=1250;x+=70)c.lineTo(x,145+row*27+Math.sin(x*.009+row)*42+Math.cos(x*.024)*17);c.lineTo(1200,360);c.lineTo(0,360);c.fill()}}
 if(v.land==='metro'){r.line(130,98,490,184,'#263d54',2);for(let i=0;i<6;i++){let x=130+((t*12+i*60)%360),y=98+(x-130)*86/360;r.line(x,y,x,y+10,'#253c51',2);c.fillStyle='#e5d130';c.fillRect(x-9,y+9,18,12)}}
 if(v.land==='monserrate'){c.fillStyle='#f3e5cf';c.fillRect(320,127,32,18);c.fillRect(328,115,7,30);c.fillRect(342,115,7,30);r.line(338,104,338,120,'#f5eddb',2);r.line(333,109,343,109,'#f5eddb',2)}
 if(v.land==='volcano'){c.fillStyle='#e5e7dc';c.beginPath();c.moveTo(475,156);c.lineTo(550,62);c.lineTo(635,156);c.fill();c.fillStyle='#789fa9';c.beginPath();c.moveTo(430,210);c.lineTo(550,99);c.lineTo(682,210);c.fill()}
 if(v.land==='coffee'){for(let i=0;i<10;i++)r.line(i*140,240,i*140+90,280,'#8eaf69',3);for(let i=0;i<5;i++){c.fillStyle='#f4e6c5';c.fillRect(i*220+70,205,40,23);c.fillStyle='#be5348';c.beginPath();c.moveTo(i*220+62,205);c.lineTo(i*220+90,188);c.lineTo(i*220+118,205);c.fill()}}
 if(['caribe','river','plains','valley'].includes(v.land)){for(let x of [60,170,1050,1150]){r.line(x,240,x+7,125,'#706244',6);for(let j=0;j<5;j++){c.strokeStyle='#4e805c';c.lineWidth=6;c.beginPath();c.moveTo(x+7,125);c.quadraticCurveTo(x+Math.cos(j*1.4)*30,95,x+Math.cos(j*1.4)*47,132);c.stroke()}}if(v.land==='river'){c.fillStyle='#83b8b4';c.fillRect(0,230,1200,20)}}
 for(let i=0;i<30;i++){c.fillStyle=i%2?'#344d6060':'#728d9870';let x=i*43;c.fillRect(x,208-(i*17%50),25+(i%3)*5,65)}
 },
 stands(r,g){const v=this.current(),c=r.c,t=g.demoTime||0,club=Clubs.get(v.club),colors=v.gold?['#efc558','#fff0b8']:club.colors;this.landscape(r,v,t);c.fillStyle='#182d43';c.beginPath();c.moveTo(0,227);c.quadraticCurveTo(600,v.arch==='bowl'?295:258,1200,227);c.lineTo(1200,358);c.lineTo(0,358);c.fill();
 for(let y=255;y<356;y+=22){r.line(0,y,1200,y,'#9ab5b344',2);for(let x=0;x<1200;x+=17){c.fillStyle=colors[(Math.floor(x/120)+Math.floor(y/22))%colors.length];c.globalAlpha=.4;c.fillRect(x,y+3,10,7)}}c.globalAlpha=1;
 if(['roof','canopy','gold','bowl'].includes(v.arch)){const roof=v.arch==='canopy'?52:28;c.fillStyle=v.gold?'#c6a34f':'#c4d5d5';c.beginPath();c.moveTo(0,216);c.quadraticCurveTo(600,roof+200,1200,216);c.lineTo(1200,235);c.quadraticCurveTo(600,roof+217,0,235);c.fill();for(let x=0;x<=1200;x+=100)r.line(x,216,x+30,237,'#526f7a',2)}
 if(v.arch==='deco'){for(let x=40;x<1200;x+=160){c.fillStyle='#e5c69d';c.fillRect(x,215,110,40);c.fillRect(x+15,204,80,12);for(let i=0;i<4;i++){c.fillStyle='#315677';c.fillRect(x+12+i*24,229,12,22)}}}
 for(let i=0;i<r.crowd.length;i++){const p=r.crowd[i],bounce=g.state==='goal'?Math.abs(Math.sin(t*13+p.phase))*12:Math.sin(t*2+p.phase);const y=272+(p.y-190)*.55-bounce;r.circle(p.x,y,p.r*.75,colors[i%colors.length]);r.line(p.x,y+4,p.x,y+9,colors[i%colors.length],3)}
 for(let i=0;i<(g.staticVenue?0:9);i++){const x=40+i*140,wave=Math.sin(t*4+i)*6;r.line(x,320,x,264,'#c1c6c0',2);c.fillStyle=colors[i%colors.length];c.beginPath();c.moveTo(x,264);c.quadraticCurveTo(x+20,253+wave,x+48,264+wave);c.lineTo(x+48,289+wave);c.quadraticCurveTo(x+20,278+wave,x,289);c.fill()}

 if(!g.staticVenue&&settings.quality!=='off'){const goal=g.state==='goal';for(let i=0;i<(settings.quality==='low'?8:20);i++){let x=(i%2?1090:80)+Math.sin(t*.6+i)*38,y=320-((t*(goal?70:18)+i*19)%110);c.globalAlpha=(goal?.13:.035)*(1-(320-y)/150);r.circle(x,y,15+(320-y)*.25,colors[i%colors.length])}c.globalAlpha=1}
 },
 confetti(r,g){if(g.state!=='goal'||settings.quality==='off')return;const c=r.c,colors=Clubs.get(this.current().club).colors,t=1.3-g.goalTimer;for(let i=0;i<(settings.quality==='low'?25:90);i++){let x=(i*137+t*(i%2?65:-65)+1200)%1200,y=70+(i*43%230)+t*150;c.fillStyle=i%3===0?'#fff8dc':colors[i%colors.length];c.save();c.translate(x,y);c.rotate(t*4+i);c.fillRect(-3,-2,6,4);c.restore()}},
 install(){settings.narrator??=true;settings.musicVolume??=.55;settings.crowd??=true;this.sync();const originalStadium=Renderer.prototype.stadium;Renderer.prototype.stadium=function(g){originalStadium.call(this,g);this.c.save();this.c.beginPath();this.c.rect(0,0,1200,358);this.c.clip();Ambiente.stands(this,g);this.c.restore()};const draw=Renderer.prototype.draw;Renderer.prototype.draw=function(g){draw.call(this,g);Ambiente.confetti(this,g)};
 const oldStart=Game.prototype.start;Game.prototype.start=function(config,opponent){const v=Ambiente.venue(config,opponent);oldStart.call(this,{...config,venue:v},opponent);Ambiente.speak('¡Qué más, mi gente! Rueda el balón en el estadio '+v.name+'. '+Clubs.get(this.config.clubIds[0]).name+' sale a la cancha.');UI.updateHUD()};
 const goal=Game.prototype.goal;Game.prototype.goal=function(team){const before=this.state;goal.call(this,team);if(before==='playing'&&this.state==='goal'){Ambiente.speak('¡Gooooool de '+Clubs.get(this.config.clubIds[team]).name+'! ¡Qué golazo, mi gente!');if(settings.crowd)[330,440,554,660].forEach((f,i)=>setTimeout(()=>Ambiente.instrument(f,.4,.06,'sawtooth'),i*110))}};
 const finish=Game.prototype.finish;Game.prototype.finish=function(){const committed=this.resultCommitted;finish.call(this);if(!committed)Ambiente.speak('¡Se acabó el partido! '+this.score[0]+' a '+this.score[1]+'. ¡Gracias por acompañarnos, parceros!')};
 const hud=UI.updateHUD.bind(UI);UI.updateHUD=()=>{hud();document.querySelector('.arenaBadge').textContent='● '+this.current().name.toUpperCase()};
 const preview=Clubs.preview.bind(Clubs);Clubs.preview=(config,opponent,done)=>{preview(config,opponent,done);const v=this.venue(config,opponent),p=document.createElement('p');p.className='venueNotice';p.textContent='📍 '+v.name+' · '+v.city;$('clubPreview').prepend(p)};
 const oldSettings=UI.settings.bind(UI);UI.settings=()=>{oldSettings();$('musicVolume').value=settings.musicVolume;$('crowdSound').checked=settings.crowd};
 $('narratorBtn').onclick=()=>{settings.narrator=!settings.narrator;this.sync();persist()};$('musicBtn').onclick=()=>{sound.init();settings.music=!settings.music;$('music').checked=settings.music;this.sync();persist()};$('musicVolume').oninput=()=>{settings.musicVolume=+$('musicVolume').value;persist()};$('crowdSound').onchange=()=>{settings.crowd=$('crowdSound').checked;persist()};const sync=sound.sync.bind(sound);sound.sync=()=>{sync();this.sync()};
 // Leemos reloj de audio real: nunca se añade un paso a la simulación del partido.
 GameAudio.prototype.update=function(){};let last=performance.now();const audioLoop=now=>{this.tick((now-last)/1000);last=now;requestAnimationFrame(audioLoop)};requestAnimationFrame(audioLoop);document.addEventListener('pointerdown',()=>sound.init(),{once:true});document.addEventListener('keydown',()=>sound.init(),{once:true});window.addEventListener('blur',()=>window.speechSynthesis?.cancel());document.addEventListener('visibilitychange',()=>{if(document.hidden)window.speechSynthesis?.cancel()});
 const musicInput=$('music').oninput;$('music').oninput=()=>{musicInput();this.sync()};persist();
 }
};

// Adaptación móvil por capas; el motor anterior se conserva para modo clásico.


Ambiente.carteles=function(r){
 const c=r.c,club=Clubs.get(this.current().club);
 c.save();c.font='900 13px system-ui';c.textAlign='center';
 for(const [x,mensaje] of [[325,'¡VAMOS, '+club.nickname.toUpperCase()+'!'],[875,'ESTA HINCHADA NO ABANDONA']]){
  const width=Math.min(510,Math.max(180,c.measureText(mensaje).width+28));
  c.fillStyle=club.colors[0];c.fillRect(x-width/2,229,width,23);
  c.strokeStyle='#ffffffab';c.strokeRect(x-width/2,229,width,23);
  c.strokeStyle='#101824';c.lineWidth=3;c.strokeText(mensaje,x,246,width-16);
  c.fillStyle='#fff';c.fillText(mensaje,x,246,width-16);
 }
 c.restore()
};
