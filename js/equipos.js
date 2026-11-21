const kit=(base,accent,pattern='plain',shorts=base,socks=base,third=accent)=>({base,accent,pattern,shorts,socks,third});
const CLUBS=[
 ['nacional','Atlético Nacional','Verdolagas','Medellín',['#00874a','#ffffff'],kit('#00874a','#ffffff','stripes','#ffffff','#ffffff','#162623'),kit('#ffffff','#00874a','trim','#00874a','#ffffff')],
 ['millonarios','Millonarios','Embajadores','Bogotá',['#1748bb','#ffffff'],kit('#1748bb','#ffffff','trim','#ffffff','#1748bb'),kit('#a5d9ef','#7966ac','graphic','#a5d9ef','#a5d9ef')],
 ['america','América de Cali','Diablos Rojos','Cali',['#cf202c','#ffffff'],kit('#cf202c','#b31d29','pinstripes','#cf202c','#cf202c','#ffffff'),kit('#ffffff','#cf202c','pinstripes','#ffffff','#ffffff')],
 ['cali','Deportivo Cali','Azucareros','Cali',['#007f62','#ffffff'],kit('#007f62','#ffffff','sleeves','#ffffff','#ffffff'),kit('#ffffff','#007f62','sleeves','#007f62','#ffffff')],
 ['junior','Junior','Tiburones','Barranquilla',['#d92332','#ffffff','#15264c'],kit('#d92332','#ffffff','stripes','#15264c','#ffffff','#15264c'),kit('#15264c','#dc293d','pinstripes','#15264c','#15264c','#ffffff')],
 ['santafe','Independiente Santa Fe','Cardenales','Bogotá',['#dc1e32','#ffffff'],kit('#dc1e32','#ffffff','sides','#ffffff','#dc1e32'),kit('#ffffff','#dc1e32','sleeves','#ffffff','#ffffff')],
 ['medellin','Independiente Medellín','Poderoso de la Montaña','Medellín',['#d72330','#142c63'],kit('#d72330','#142c63','sides','#142c63','#d72330'),kit('#ffffff','#142c63','sleeves','#ffffff','#ffffff','#d72330')],
 ['tolima','Deportes Tolima','Pijaos','Ibagué',['#7b1938','#d7ab41'],kit('#7b1938','#d7ab41','trim','#7b1938','#7b1938'),kit('#f6f0e4','#7b1938','trim','#f6f0e4','#f6f0e4')],
 ['bucaramanga','Atlético Bucaramanga','Leopardos','Bucaramanga',['#f4cb25','#007c45'],kit('#f4cb25','#007c45','trim','#007c45','#f4cb25'),kit('#007c45','#f4cb25','pinstripes','#007c45','#007c45')],
 ['once','Once Caldas','Blanco Blanco','Manizales',['#ffffff','#171c21','#12824b','#d72a30'],kit('#ffffff','#12824b','sides','#ffffff','#ffffff','#d72a30'),kit('#171c21','#ffffff','stripes','#171c21','#171c21')],
 ['pereira','Deportivo Pereira','Matecañas','Pereira',['#e6b72c','#c52332'],kit('#c52332','#e6b72c','stripes','#c52332','#e6b72c'),kit('#e99eb7','#cf7197','graphic','#171c21','#e99eb7')],
 ['pasto','Deportivo Pasto','Volcánicos','Pasto',['#cd2535','#204dac','#f1d043'],kit('#cd2535','#f1d043','sleeves','#204dac','#cd2535','#204dac'),kit('#204dac','#cd2535','sleeves','#204dac','#204dac','#f1d043')],
 ['aguilas','Águilas Doradas','Dorados','Rionegro',['#c5a04c','#181818'],kit('#c5a04c','#181818','trim','#181818','#c5a04c'),kit('#ffffff','#c5a04c','trim','#ffffff','#ffffff')],
 ['alianza','Alianza Valledupar','Vallenatos','Valledupar',['#162c54','#ffffff','#cf2534'],kit('#162c54','#ffffff','pinstripes','#162c54','#162c54'),kit('#ffffff','#162c54','sleeves','#ffffff','#ffffff','#cf2534')],
 ['chico','Boyacá Chicó','Ajedrezados','Tunja',['#142c58','#eb8c38','#5da4dc'],kit('#142c58','#eb8c38','checks','#142c58','#142c58','#5da4dc'),kit('#ffffff','#5da4dc','hoops','#ffffff','#ffffff','#142c58')],
 ['fortaleza','Fortaleza FC','Amix','Bogotá',['#ffffff','#182c54'],kit('#ffffff','#182c54','trim','#ffffff','#ffffff'),kit('#ef8b9e','#6554a9','gradient','#6554a9','#6554a9')],
 ['llaneros','Llaneros FC','Indomables','Villavicencio',['#ffffff','#17191b','#c6a752'],kit('#ffffff','#17191b','sleeves','#17191b','#ffffff','#c6a752'),kit('#17191b','#c6a752','trim','#17191b','#17191b')],
 ['interbogota','Internacional de Bogotá','Cóndores','Bogotá',['#ffffff','#151515','#b99b50'],kit('#ffffff','#151515','doubleband','#151515','#ffffff','#b99b50'),kit('#151515','#d5b13f','trim','#151515','#151515','#c32232')],
 ['cucuta','Cúcuta Deportivo','Motilones','Cúcuta',['#d51e2f','#19191b'],kit('#d51e2f','#19191b','stripes','#19191b','#19191b','#ffffff'),kit('#ffffff','#d51e2f','trim','#ffffff','#ffffff','#19191b')],
 ['jaguares','Jaguares de Córdoba','Felinos','Montería',['#459dd2','#1558a0','#d3b34c'],kit('#1558a0','#79c6e6','gradient','#1558a0','#459dd2','#d3b34c'),kit('#b1e1ef','#ffffff','gradient','#ffffff','#ffffff','#d3b34c')],
 ['boca','Boca Juniors','Xeneizes','Buenos Aires',['#15366d','#f4c92d'],kit('#15366d','#f4c92d','band','#15366d','#15366d'),kit('#ffffff','#15366d','doubleband','#ffffff','#ffffff','#f4c92d')],
 ['river','River Plate','Millonarios','Buenos Aires',['#ffffff','#d52232'],kit('#ffffff','#d52232','sash','#171b24','#ffffff'),kit('#d52232','#ffffff','sash','#d52232','#d52232')],
 ['racing','Racing Club','La Academia','Avellaneda',['#7fc4e5','#ffffff'],kit('#7fc4e5','#ffffff','stripes','#171b24','#ffffff'),kit('#142a4b','#7fc4e5','trim','#142a4b','#142a4b')],
 ['independiente','Independiente','Rey de Copas','Avellaneda',['#d52232','#ffffff'],kit('#d52232','#ffffff','trim','#d52232','#d52232'),kit('#ffffff','#d52232','trim','#ffffff','#ffffff')],
 ['sanlorenzo','San Lorenzo','Cuervos','Buenos Aires',['#172a61','#bc2439'],kit('#172a61','#bc2439','stripes','#172a61','#172a61'),kit('#ffffff','#bc2439','band','#ffffff','#ffffff')],
 ['estudiantes','Estudiantes de La Plata','Pincharratas','La Plata',['#d31f30','#ffffff'],kit('#d31f30','#ffffff','stripes','#171b24','#171b24'),kit('#171b24','#d31f30','trim','#171b24','#171b24')],
 ['flamengo','Flamengo','Mengão','Río de Janeiro',['#c91e2b','#17191c'],kit('#c91e2b','#17191c','hoops','#ffffff','#c91e2b'),kit('#ffffff','#c91e2b','doubleband','#17191c','#ffffff','#17191c')],
 ['fluminense','Fluminense','Tricolor','Río de Janeiro',['#7b243d','#1c6748','#ffffff'],kit('#7b243d','#1c6748','stripes','#ffffff','#ffffff','#ffffff'),kit('#ffffff','#7b243d','trim','#ffffff','#ffffff','#1c6748')],
 ['palmeiras','Palmeiras','Verdão','São Paulo',['#11623c','#ffffff'],kit('#11623c','#ffffff','trim','#ffffff','#11623c'),kit('#ffffff','#11623c','trim','#11623c','#ffffff')],
 ['santos','Santos','Peixe','Santos',['#ffffff','#17191c'],kit('#ffffff','#17191c','trim','#ffffff','#ffffff'),kit('#17191c','#ffffff','stripes','#17191c','#17191c')],
 ['penarol','Peñarol','Carboneros','Montevideo',['#ecc328','#17191c'],kit('#ecc328','#17191c','stripes','#17191c','#17191c'),kit('#55595c','#ecc328','trim','#55595c','#55595c')],
 ['nacionaluy','Nacional de Uruguay','Bolsos','Montevideo',['#ffffff','#243b81','#d32332'],kit('#ffffff','#d32332','trim','#243b81','#ffffff'),kit('#d32332','#243b81','trim','#243b81','#d32332')]
].map(([id,name,nickname,city,colors,home,away],i)=>({id,name,nickname,city,colors,home,away,league:i<20?'Liga BetPlay 2026':'Invitado sudamericano'}));
const Clubs={
 get(id){return CLUBS.find(c=>c.id===id)||CLUBS[0]},
 selected(){return Array.isArray(settings.clubSelection)?settings.clubSelection:['nacional','millonarios']},
 cupTeams(){const selected=this.get(this.selected()[0]);return [selected,...CLUBS.filter(c=>c.id!==selected.id)].map((c,id)=>({id,clubId:c.id,name:c.name,color:c.colors[0],power:rand(.7,1.3)}))},
 migrateCup(d){if(!d||![2,3].includes(d.version)||d.teams?.length!==32||d.groups?.length!==8)return null;if(d.version===2){const selected=this.get(this.selected()[0]),order=[selected,...CLUBS.filter(c=>c.id!==selected.id)];d.teams=d.teams.map((t,i)=>({...t,legacyName:t.name,clubId:order[i].id,name:order[i].name,color:order[i].colors[0]}));d.version=3;d.catalog='betplay-2026';}return d},
 // Distancia de color y proporciones del patrón; la visita cambia sin afectar al equipo local.
 rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16))},
 distance(a,b){const x=this.rgb(a),y=this.rgb(b);return Math.hypot(...x.map((v,i)=>v-y[i]))},
 clash(a,b){const patterned=k=>['stripes','checks','hoops','halves'].includes(k.pattern);if(this.distance(a.base,b.base)<115)return true;if(patterned(a)&&this.distance(a.accent,b.base)<90)return true;if(patterned(b)&&this.distance(a.base,b.accent)<90)return true;return false},
 pair(a,b){const home=this.get(a).home,club=this.get(b);return [home,this.clash(home,club.home)?club.away:club.home]},
 dress(profile,id,k){const c=this.get(id);return {...profile,clubId:c.id,kit:k||c.home,shirt:(k||c.home).base,shorts:(k||c.home).shorts,socks:(k||c.home).socks}},
 matchIds(config,opponent){if(config.mode==='cup')return [Cup.team(0).clubId,Cup.team(config.opponentId).clubId];return [config.clubIds?.[0]||this.selected()[0],opponent?.clubId||config.clubIds?.[1]||this.selected()[1]]},
 apply(g,opponent){const ids=this.matchIds(g.config,opponent),kits=this.pair(...ids);g.config.clubIds=ids;g.players.forEach(p=>p.profile=this.dress(p.profile,ids[p.team],kits[p.team]));},
 swatch(id){const el=document.createElement('span');el.className='clubcolors';const c=this.get(id);el.title=c.colors.join(' / ');el.setAttribute('aria-label','Colores de '+c.name);el.style.background='linear-gradient(90deg,'+c.colors.map((v,i)=>v+' '+(100*i/c.colors.length)+'% '+(100*(i+1)/c.colors.length)+'%').join(',')+')';return el},
 label(el,id,text){el.replaceChildren(this.swatch(id),document.createTextNode(text||this.get(id).name))},
 crest(canvas,id){const c=canvas.getContext('2d'),club=this.get(id);c.clearRect(0,0,128,128);c.save();c.beginPath();c.moveTo(18,16);c.lineTo(110,16);c.lineTo(106,76);c.quadraticCurveTo(100,102,64,118);c.quadraticCurveTo(28,102,22,76);c.closePath();c.fillStyle=club.colors[0];c.fill();c.clip();club.colors.forEach((v,i)=>{c.fillStyle=v;c.fillRect(18+i*92/club.colors.length,16,92/club.colors.length,105)});c.fillStyle='#101923d9';c.beginPath();c.arc(64,61,28,0,7);c.fill();c.fillStyle='#fff';c.font='900 36px system-ui';c.textAlign='center';c.fillText(club.name[0],64,74);c.restore();c.strokeStyle='#c2cedc';c.lineWidth=3;c.stroke()},
 // Real badges are restricted to selector cards. All other callers keep crest().
 crestFiles: null,
 crestImages: new Map(),
 loadCrestFiles() {
  if (this.crestFiles) return this.crestFiles;
  this.crestFiles = fetch(new URL('escudos.json',document.baseURI),{cache:'no-cache'}).then(response => {
   if (!response.ok) throw new Error('Escudos no disponibles');
   return response.json();
  }).catch(error => {console.warn('No se pudo cargar el catálogo de escudos:',new URL('escudos.json',document.baseURI).href,error);return {}});
  return this.crestFiles;
 },
 async selectorCrest(canvas, id) {
  this.crest(canvas, id);
  if (!CLUBS.slice(0, 20).some(club => club.id === id)) return;
  const files = await this.loadCrestFiles();
  const path = files[id];
  if (typeof path !== 'string' || !/^img\/escudos\/[^?#]+\.(png|webp|svg|jpe?g)$/i.test(path)) return;
  if (!this.crestImages.has(path)) {
   this.crestImages.set(path, new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {console.warn('No se pudo cargar el escudo:',image.src);resolve(null)};
    image.src = path;
   }));
  }
  const image = await this.crestImages.get(path);
  if (!image || !canvas.isConnected || !canvas.closest('#clubGrid')) return;
  const context = canvas.getContext('2d');
  const scale = Math.min(128 / image.naturalWidth, 128 / image.naturalHeight);
  const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
  context.clearRect(0, 0, 128, 128);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, (128 - width) / 2, (128 - height) / 2, width, height);
  canvas.setAttribute('aria-label', 'Escudo de ' + this.get(id).name);
 },
 // Se dibuja sobre el torso original, sin modificar articulaciones ni colisiones.
 shirt(c,k){c.save();c.clip();c.fillStyle=k.accent;if(k.pattern==='stripes'||k.pattern==='pinstripes'){const w=k.pattern==='stripes'?9:1.5;for(let x=-24;x<24;x+=k.pattern==='stripes'?18:8){c.fillRect(x,-80,w,40);if(k.pattern==='stripes'&&k.third!==k.accent){c.fillStyle=k.third;c.fillRect(x,-80,1,40);c.fillStyle=k.accent}}}else if(k.pattern==='checks'){for(let x=0;x<6;x++)for(let y=0;y<5;y++)if((x+y)%2===0){c.fillStyle=y%2?k.third:k.accent;c.fillRect(-24+x*8,-80+y*8,8,8)}}else if(k.pattern==='hoops'){for(let y=-76;y<-40;y+=14)c.fillRect(-25,y,50,6)}else if(k.pattern==='band'||k.pattern==='doubleband'){c.fillRect(-25,-68,50,10);if(k.pattern==='doubleband'){c.fillStyle=k.third;c.fillRect(-25,-56,50,3)}}else if(k.pattern==='sash'){c.beginPath();c.moveTo(-25,-80);c.lineTo(-12,-80);c.lineTo(25,-43);c.lineTo(12,-43);c.fill()}else if(k.pattern==='halves')c.fillRect(0,-80,25,40);else if(k.pattern==='gradient'){let gr=c.createLinearGradient(0,-78,0,-43);gr.addColorStop(0,k.base);gr.addColorStop(1,k.accent);c.fillStyle=gr;c.fillRect(-25,-80,50,40)}else if(k.pattern==='sides'||k.pattern==='sleeves'){c.fillRect(-25,-80,k.pattern==='sides'?9:12,40);c.fillStyle=k.third;c.fillRect(16,-80,10,40)}else if(k.pattern==='graphic'){c.globalAlpha=.25;for(let x=-25;x<25;x+=10){c.beginPath();c.moveTo(x,-78);c.lineTo(x+8,-60);c.lineTo(x,-43);c.strokeStyle=k.accent;c.lineWidth=2;c.stroke()}}c.globalAlpha=1;c.fillStyle=k.third;c.fillRect(-11,-80,22,5);c.restore()},
 select(mode,done){this.selectMode=mode;this.selection=[...this.selected()];this.activeSlot=0;this.afterSelect=done;$('clubSearch').value='';$('clubCity').replaceChildren(new Option('Todas las ciudades',''),...[...new Set(CLUBS.slice(0,20).map(c=>c.city))].sort().map(c=>new Option(c,c)));$('clubSecond').classList.toggle('hidden',mode==='cup'||mode==='practice'||mode==='tournament');this.renderSelector();UI.open('clubModal')},
 renderSelector(){const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),q=fold($('clubSearch').value),city=$('clubCity').value;const list=CLUBS.slice(0,20).filter(c=>(!city||city===c.city)&&fold(c.name+' '+c.nickname+' '+c.city).includes(q));$('clubFirst').textContent=(this.selectMode==='cup'?'J1 + J2': 'J1')+' · '+this.get(this.selection[0]).name;$('clubSecond').textContent='J2 / rival · '+this.get(this.selection[1]).name;$('clubFirst').classList.toggle('primary',this.activeSlot===0);$('clubSecond').classList.toggle('primary',this.activeSlot===1);$('clubGrid').replaceChildren();for(const club of list){const b=document.createElement('button');b.className='clubcard';b.classList.toggle('selected',this.selection[this.activeSlot]===club.id);b.setAttribute('aria-pressed',String(this.selection[this.activeSlot]===club.id));const cv=document.createElement('canvas');cv.width=cv.height=128;cv.setAttribute('aria-label','Escudo estilizado de '+club.name);const name=document.createElement('strong');name.textContent=club.name;const city=document.createElement('small');city.textContent=club.city+' · '+club.nickname;b.append(cv,name,city,this.swatch(club.id));b.onclick=()=>{this.selection[this.activeSlot]=club.id;this.renderSelector()};$('clubGrid').append(b);this.selectorCrest(cv,club.id)}if(!list.length){const p=document.createElement('p');p.textContent='No hay equipos que coincidan.';$('clubGrid').append(p)}},
 confirm(){settings.clubSelection=[...this.selection];persist();UI.close('clubModal');const done=this.afterSelect;this.afterSelect=null;done?.()},
 preview(config,opponent,done){const ids=this.matchIds(config,opponent),kits=this.pair(...ids);$('clubPreview').replaceChildren();for(let i=0;i<(config.mode==='practice'?1:2);i++){const club=this.get(ids[i]),section=document.createElement('section'),crest=document.createElement('canvas'),avatar=document.createElement('canvas'),name=document.createElement('h3'),note=document.createElement('p');crest.width=crest.height=128;crest.className='crest';avatar.width=190;avatar.height=230;name.textContent=club.name;note.className='hint';note.textContent=club.city+' · '+(i===1&&kits[1]===club.away?'Uniforme visitante por contraste':'Uniforme local');section.append(crest,name,avatar,note);$('clubPreview').append(section);this.crest(crest,club.id);const p=new Player(i,this.dress(profiles[i],ids[i],kits[i]));p.x=95;p.y=214;renderer.player(p,{state:'menu',demoTime:0},avatar.getContext('2d'))}this.afterPreview=done;UI.open('clubPreviewModal')},
 hud(){const ids=game.config.clubIds;if(!ids)return;for(let i=0;i<2;i++){if(i===1&&game.config.mode==='practice')continue;this.label($('name'+i),ids[i])}},
 install(){const choose=Skills.choose.bind(Skills);Skills.choose=(config,opponent,done)=>this.preview(config,opponent,()=>choose(config,opponent,done));const start=Game.prototype.start;Game.prototype.start=function(config,opponent){start.call(this,config,opponent);Clubs.apply(this,opponent);UI.updateHUD()};const hud=UI.updateHUD.bind(UI);UI.updateHUD=()=>{hud();this.hud()};const results=UI.results.bind(UI);UI.results=(...args)=>{results(...args);const ids=game.config.clubIds;if(ids)ids.forEach((id,i)=>this.label($('resultName'+i),id))};const cr=Cup.results.bind(Cup);Cup.results=g=>{cr(g);this.label($('resultName0'),Cup.team(0).clubId);this.label($('resultName1'),Cup.team(g.config.opponentId).clubId)};
 $('clubSearch').oninput=$('clubCity').onchange=()=>this.renderSelector();$('clubFirst').onclick=()=>{this.activeSlot=0;this.renderSelector()};$('clubSecond').onclick=()=>{this.activeSlot=1;this.renderSelector()};$('clubConfirm').onclick=()=>this.confirm();$('clubPreviewGo').onclick=()=>{UI.close('clubPreviewModal');const fn=this.afterPreview;this.afterPreview=null;fn?.()};
 $('playBtn').onclick=()=>{sound.init();const conf=UI.config();if(conf.mode==='cup'){game.tournament=null;if(Cup.load()){Cup.show();return}this.select('cup',()=>Cup.create(+$('cupHumans').value,$('rules').value));return}this.select(conf.mode,()=>{conf.clubIds=[...this.selected()];if(conf.mode==='tournament')game.beginTournament(conf);else{game.tournament=null;Skills.choose(conf,null,()=>game.start(conf))}})};persist();}
};

// Ambiente colombiano. Sedes comprobadas en programación Dimayor II-2026,
// fechas 18/19, y fuentes locales, 12/11/2026. La estética nunca cambia config.theme.
