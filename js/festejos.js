const Festejos={
 nombres:{salsa:'Salsa',cumbia:'Cumbia',champeta:'Champeta',robot:'Robot',moon:'Moonwalk',ballDance:'Baile con el balón',backflip:'Mortal hacia atrás',cartwheel:'Voltereta lateral',worm:'Gusano en el piso',longSlide:'Resbalón largo de rodillas',hush:'Silencio',listen:'Escuchar a la hinchada',flex:'Flexión de músculos',heart:'Corazón con las manos',fingers:'Pistolas con los dedos',cradle:'Mecer al bebé',salute:'Saludo militar',guitar:'Guitarra imaginaria',kiss:'Lanzar besos',corner:'Bandera del córner',statue:'Pose de estatua',sleep:'Fingir dormir',pairDance:'Baile sincronizado',chest:'Choque de pecho',hug:'Abrazo',pairJump:'Salto conjunto'},
 pares:['pairDance','chest','hug','pairJump'],
 bolsas:new Map(),
 sortear(id,opciones){let bolsa=this.bolsas.get(id);if(!bolsa?.lista.length){const lista=[...opciones];for(let n=lista.length-1;n>0;n--){const j=Math.floor(Math.random()*(n+1));[lista[j],lista[n]]=[lista[n],lista[j]]}if(lista.at(-1)===bolsa?.ultimo)lista.reverse();bolsa={lista};this.bolsas.set(id,bolsa)}return bolsa.ultimo=bolsa.lista.pop()},
 pose(tipo,t,pose){
  const a=Math.sin(t*10),b=Math.cos(t*10),z=Math.sin(Math.PI*Math.min(1,t/1.7)),s=pose;
  function brazos(x,y,u,v){s.hands=[[x,y],[u,v]]}
  function pies(x,y,u,v){s.feet=[[x,y],[u,v]]}
  switch(tipo){
   case 'salsa':case 'pairDance':brazos(-30+a*8,-72+b*11,32+a*10,-67-b*10);pies(-12+a*16,-7-Math.max(0,b)*8,12-a*11,-7-Math.max(0,-b)*10);s.angle=a*.09;break;
   case 'cumbia':brazos(-39,-56+a*8,34,-94+b*6);pies(-17+a*9,-8,13+b*12,-9);s.angle=b*.1;break;
   case 'champeta':brazos(-36,-85+a*13,37,-85-a*13);pies(-18-b*9,-11-Math.max(0,a)*25,18+b*9,-11-Math.max(0,-a)*25);break;
   case 'robot':{const k=Math.sign(a);brazos(-34,-63+k*14,39,-61-k*14);s.angle=k*.07;break}
   case 'moon':brazos(-32,-52,26,-61);pies(-13-a*14,-6,12+a*14,-9-Math.max(0,b)*8);break;
   case 'ballDance':brazos(-39,-69,35,-73);pies(-17,-8,24+4*a,-22+7*b);break;
   case 'cartwheel':brazos(-44,-96,44,-96);pies(-42,-8,40,-9);break;
   case 'backflip':brazos(-22,-78,22,-78);pies(-24,-26*z-8,22,-28*z-8);break;
   case 'worm':brazos(-30,-58+a*8,35,-65);pies(-21,-12+b*9,22,-12+b*9);break;
   case 'longSlide':brazos(-38,-95,38,-94);pies(-26,-21,25,-23);break;
   case 'hush':brazos(-30,-39,0,-91);break;
   case 'listen':brazos(-31,-98,41,-63);s.angle=-.09;break;
   case 'flex':brazos(-29,-88,29,-88);break;
   case 'heart':brazos(-4,-77,4,-77);break;
   case 'fingers':brazos(-44,-72,45,-74);break;
   case 'cradle':brazos(8+a*4,-58,-12+a*4,-58);s.angle=a*.06;break;
   case 'salute':brazos(-26,-37,18,-101);break;
   case 'guitar':brazos(-6,-54+a*5,31,-72);break;
   case 'kiss':brazos(-26,-41,7+22*(1+b)/2,-91+8*(1+b)/2);break;
   case 'corner':brazos(-24,-38,38,-80);break;
   case 'statue':brazos(-15,-69,27,-116);pies(-17,-6,23,-9);break;
   case 'sleep':brazos(23,-92,20,-88);s.angle=.11;break;
   case 'chest':brazos(-39,-68,40,-67);break;
   case 'hug':brazos(-40,-74,39,-76);break;
   case 'pairJump':brazos(-36,-107,36,-107);pies(-20,-19,20,-19);break;
  }
  return s
 },
 props(c,p,tipo,t,especial){
  const {el,linea,figura}=Vestuario.pincel(c);c.save();c.translate(p.x,p.y);
  if(tipo==='ballDance'){const x=24+Math.sin(t*10)*8,y=-12-Math.abs(Math.cos(t*10))*11;el(x,y,8,8,'#fff');el(x,y,3,3,'#26364c')}
  if(tipo==='corner'){linea([[38,-3],[38,-124]],'#f5e7be',3);figura('M 39 -124 L 66 -117 L 39 -107 Z',p.profile.shirt)}
  if(tipo==='guitar'){el(0,-59,12,8,'#be753b',-.3);el(0,-59,3,3,'#482e27');linea([[7,-62],[35,-80]],'#ab793e',4)}
  if(tipo==='heart'||tipo==='kiss'){c.save();if(tipo==='kiss')c.translate(26+t*9,-18-t*7);c.translate(0,-79);figura('M 0 6 Q -11 -1 -6 -6 Q -2 -9 0 -4 Q 4 -10 8 -5 Q 11 -1 0 6 Z','#ff6484');c.restore()}
  if(tipo==='hush'){el(0,-96,4,5,p.profile.skin);linea([[0,-95],[0,-104]],p.profile.skin,3)}
  if(tipo==='salute')linea([[14,-104],[21,-112],[11,-113]],p.profile.skin,4);
  if(tipo==='fingers')for(const d of [-1,1])linea([[d*44,-80],[d*53,-81]],p.profile.skin,3);
  if(tipo==='sleep'){c.font='bold 13px system-ui';c.fillStyle='#fff';c.fillText('z Z',28,-111)}
  if(especial){const n=PersonalidadVisual.reduced()||settings.quality==='low'?4:16;
   for(let i=0;i<n;i++){const a=i*2*Math.PI/n+t*.5;el(Math.cos(a)*70,-84+Math.sin(a)*55,2+i%3,2,i%2?'#fff8bc':'#edbc45')}
   c.font='bold 14px system-ui';c.textAlign='center';c.strokeStyle='#342a1b';c.lineWidth=3;c.strokeText(especial,0,15);c.fillStyle='#ffe79d';c.fillText(especial,0,15)}
  c.restore()
 }
};
