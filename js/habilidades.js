const SKILLS=[
 {id:'precise',icon:'⌖',name:'Tiro preciso',cost:55,cd:8,desc:'Guía balística durante medio segundo y disparo al punto del arco elegido.'},
 {id:'power',icon:'ϟ',name:'Tiro muy potente',cost:80,cd:12,desc:'Disparo a máxima velocidad, con estela de fuego. Necesitas el balón cerca.'},
 {id:'curve',icon:'↪',name:'Tiro con efecto',cost:60,cd:9,desc:'Remate elevado que curva con fuerza y desciende hacia la portería.'},
 {id:'lob',icon:'⌒',name:'Globito',cost:50,cd:8,desc:'Parábola alta por encima de la defensa hacia el arco rival.'},
 {id:'ground',icon:'➜',name:'Misil rasante',cost:65,cd:10,desc:'Remate muy rápido junto al piso durante el primer segundo.'},
 {id:'jump',icon:'↑↑',name:'Súper salto',cost:45,cd:8,desc:'Salto especial y un segundo salto en el aire. Dispara en el aire para una chilena.'},
 {id:'magnet',icon:'∩',name:'Imán',cost:55,cd:11,desc:'Atrae el balón cercano durante 4 segundos.'},
 {id:'wall',icon:'▥',name:'Muro',cost:65,cd:14,desc:'Protege tu portería con un escudo durante 3 segundos.'},
 {id:'freeze',icon:'❄',name:'Congelar rival',cost:65,cd:13,desc:'Inmoviliza 2 segundos al rival más cercano, a un máximo de 250 px.'},
 {id:'giant',icon:'⬤',name:'Cabezota gigante',cost:55,cd:12,desc:'Cabeza y área de golpeo mayores durante 5 segundos.'},
 {id:'slow',icon:'◷',name:'Cámara lenta',cost:80,cd:17,desc:'Ralentiza el balón y a los demás durante 3 segundos. Tú conservas tu velocidad.'}
];
class Skills{
 static get(id){const key=String(id||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();return SKILLS.find(s=>s.id===key||s.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()===key)||SKILLS[0]}
 static near(p,g){return Math.hypot(g.ball.x-p.x,g.ball.y-(p.y-65*(p.profile.figureScale===1?1:.89)))<=p.radius/(p.profile.figureScale===1?1:.89)+112}
 static target(p){return p.team===0?W-GOALDEPTH-3:GOALDEPTH+3}
 static ready(p){const s=this.get(p.profile.skill);return p.energy>=s.cost&&!(p.skillCD>0)&&!p.aiming}
 static use(p,g){const s=this.get(p.profile.skill);if(!this.ready(p)){if(p.human!==null)UI.toast(p.skillCD>0?'Habilidad recargando: '+Math.ceil(p.skillCD)+' s':'Necesitas '+s.cost+' de energía');return false}
 const shots=['precise','power','curve','lob','ground'];const rival=g.players.filter(q=>q.team!==p.team).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
 if(shots.includes(s.id)&&!this.near(p,g)){if(p.human!==null)UI.toast('Acércate al balón para usar '+s.name);return false}
 if(s.id==='freeze'&&(!rival||Math.hypot(rival.x-p.x,rival.y-p.y)>250)){if(p.human!==null)UI.toast('No hay un rival a menos de 250 px');return false}
 p.energy-=s.cost;p.skillCD=s.cd;p.stats.powers++;p.skillFlash=1;g.burst(p.x,p.headY,22,'#c8ff5f',220);sound.play('power');
 if(s.id==='precise'){p.aiming=.55;}
 else if(shots.includes(s.id))this.fire(p,g,s.id);
 else if(s.id==='jump'){p.vy=-830;p.grounded=false;p.effects.doubleJump=5;p.airJump=true}
 else if(s.id==='magnet')p.effects.magnet=4;
 else if(s.id==='wall')g.goalIce[p.team]=3;
 else if(s.id==='freeze')rival.effects.stasis=2;
 else if(s.id==='giant')p.effects.giant=5;
 else if(s.id==='slow')g.timeSkill={owner:p.i,remaining:3};
 return true}
 static trajectory(p,g){const b=g.ball,dx=this.target(p)-b.x;const time=clamp(Math.abs(dx)/900,.12,1.1),targetY=clamp(Number(p.profile.aim)||414,410,510);return{vx:dx/time,vy:(targetY-b.y)/time-.5*g.gravity*.86*time,time}}
 static fire(p,g,id){if(!this.near(p,g))return;const b=g.ball,dir=p.team===0?1:-1,dx=this.target(p)-b.x;p.kick=.32;p.stats.shots++;p.stats.touches++;g.lastTouch=p.i;g.practiceTouches++;g.lastShotTime=g.elapsed;g.lastShotAir=!p.grounded;
 b.curve=0;b.ground=0;b.precise=0;b.fire=0;
 if(id==='precise'){const a=this.trajectory(p,g);b.vx=a.vx;b.vy=a.vy;b.spin=0;b.precise=a.time;}
 if(id==='power'){b.vx=dir*1450;b.vy=-285;b.spin=-dir*13;b.fire=1.5;g.cameraShake=10}
 if(id==='curve'){b.vx=dir*820;b.vy=-570;b.spin=dir*65;b.curve=1.5}
 if(id==='lob'){const t=clamp(Math.abs(dx)/440,.75,1.3);b.vx=dx/t;b.vy=(460-b.y)/t-.5*g.gravity*.86*t;b.spin=dir*4}
 if(id==='ground'){b.x=clamp(p.x+dir*(p.radius+28),100,1100);b.y=FLOOR-b.r;b.vx=dir*1380;b.vy=0;b.spin=dir*45;b.ground=1;b.fire=.8}
 sound.play('kick');g.burst(b.x,b.y,18,id==='power'?'#ffb951':'#9aeaff',260)}
 static update(p,g,dt){p.skillCD=Math.max(0,(p.skillCD||0)-dt);p.skillFlash=Math.max(0,(p.skillFlash||0)-dt);p.energy=clamp(p.energy+dt*7,0,100);if(p.aiming>0){p.aiming-=dt;if(p.aiming<=0)this.fire(p,g,'precise')}}
 static ai(p,g){if(!this.ready(p))return false;const id=this.get(p.profile.skill).id,b=g.ball,near=this.near(p,g),own=p.team===0?b.x<330:b.x>870;switch(id){case'wall':return own&&b.vx*(p.team===0?-1:1)>80;case'freeze':return g.players.some(q=>q.team!==p.team&&Math.abs(q.x-p.x)<180)&&Math.abs(b.x-p.x)<230;case'magnet':return Math.abs(b.x-p.x)<210;case'giant':return Math.abs(b.x-p.x)<150;case'jump':return Math.abs(b.x-p.x)<160&&b.y<p.headY-30;case'slow':return near||own;default:return near&&b.y>p.headY-70}}
 static draw(r,g){const c=r.c;for(const p of g.players){if(p.aiming>0&&this.near(p,g)){const a=this.trajectory(p,g);c.save();c.setLineDash([7,7]);c.strokeStyle='#dcff85';c.lineWidth=2;c.beginPath();for(let i=0;i<=32;i++){const t=a.time*i/32,x=g.ball.x+a.vx*t,y=g.ball.y+a.vy*t+.5*g.gravity*.86*t*t;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.restore()}const skill=this.get(p.profile.skill);if(p.skillFlash>0||p.skillCD>0){c.font='bold 12px system-ui';c.textAlign='center';c.fillStyle=p.team?'#ff9bae':'#d6ff8d';c.fillText(skill.icon+' '+(p.skillCD>0?Math.ceil(p.skillCD)+' s':'LISTA'),p.x,p.headY-p.radius-34)}if(p.effects.stasis>0){c.fillStyle='#9de6ff88';c.fillRect(p.x-47,p.y-145,94,145)}}if(g.timeSkill?.remaining>0){c.strokeStyle='#d4b5ff';c.lineWidth=7;c.strokeRect(4,4,W-8,H-8)}}
 static choose(config,opponent,callback){UI.hideAll();UI.open('skillsModal');input.clear();this.pending=callback;this.previewIndex=0;const count=config.mode==='local'||(config.mode==='cup'&&config.humans===2)?2:1;const box=$('skillChoices');box.replaceChildren();for(let i=0;i<count;i++){const col=document.createElement('section');col.className='profile';const h=document.createElement('h3');h.textContent='J'+(i+1)+' · '+profiles[i].name;col.append(h);const cards=document.createElement('div');cards.className='skillcards';for(const s of SKILLS){const btn=document.createElement('button');btn.className='skillcard'+(this.get(profiles[i].skill).id===s.id?' selected':'');btn.innerHTML=`<strong>${s.icon} ${s.name}</strong><span>${s.desc}</span><small>${s.cost} energía · ${s.cd} s de recarga</small>`;btn.type='button';btn.dataset.skill=s.id;btn.setAttribute('aria-pressed',String(this.get(profiles[i].skill).id===s.id));btn.onclick=()=>{profiles[i].skill=s.id;this.previewIndex=i;persist();cards.querySelectorAll('button').forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))})};cards.append(btn)}col.append(cards);const label=document.createElement('label');label.textContent='PUNTO DE TIRO PRECISO';const select=document.createElement('select');for(const [value,text] of [[414,'Ángulo superior'],[456,'Media altura'],[510,'Ángulo inferior']]){const o=document.createElement('option');o.value=value;o.textContent=text;select.append(o)}select.value=profiles[i].aim||414;select.onchange=()=>{profiles[i].aim=+select.value;persist()};label.append(select);col.append(label);box.append(col)}$('skillStart').onclick=()=>{UI.close('skillsModal');persist();const next=this.pending;this.pending=null;next()};$('skillCancel').onclick=()=>{this.pending=null;UI.close('skillsModal');if(config.mode==='cup'&&typeof Cup!=='undefined')Cup.show();else if(game.tournament)UI.showBracket();else game.menu()}}
 static preview(time){if($('skillsModal').classList.contains('hidden'))return;const c=$('skillPreview').getContext('2d'),w=720,h=150,t=(time%2)/2,id=this.get(profiles[this.previewIndex||0].skill).id;c.clearRect(0,0,w,h);c.fillStyle='#0b1524';c.fillRect(0,0,w,h);c.fillStyle='#4f9471';c.fillRect(0,126,w,24);c.strokeStyle='#fff';c.lineWidth=3;c.strokeRect(650,62,45,64);let x=100,y=100;if(['precise','power','curve','lob','ground'].includes(id)){x=100+550*t;y=id==='ground'?117:id==='lob'?110-Math.sin(t*Math.PI)*95:id==='curve'?100-Math.sin(t*Math.PI)*70:100-30*t;c.strokeStyle=id==='power'?'#ffb951':'#c8ff5f';c.beginPath();c.moveTo(x-35,y);c.lineTo(x,y);c.stroke()}else{x=180+Math.sin(t*6.28)*20;y=id==='jump'?110-Math.sin(t*Math.PI)*80:100;c.fillStyle='#b9e4ff55';c.fillRect(id==='wall'?55:x-35,45,70,80);c.fillStyle='#c8ff5f';c.font='32px system-ui';c.fillText(this.get(id).icon,350,90)}c.fillStyle='#fff';c.beginPath();c.arc(x,y,id==='giant'?15+20*t:9,0,Math.PI*2);c.fill();c.font='12px system-ui';c.fillStyle='#b9cce0';c.fillText('VISTA PREVIA J'+((this.previewIndex||0)+1)+' · '+this.get(id).name.toUpperCase(),16,22)}
}

// ─── Entrada: teclado remapeable, mandos y multitáctil. ───
