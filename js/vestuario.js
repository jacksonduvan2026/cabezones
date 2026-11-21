// Catálogo y piezas originales en un espacio común de 72 × 72 alrededor de la cara.
const Vestuario = {
 nombres:{hat:'Sombreros',hair:'Cabello',glasses:'Gafas y ojos',moustache:'Vello facial',paint:'Pintura',mouth:'Boca y nariz',body:'Cuello y cuerpo'},
 piezas:{
 hat:{cap:'Gorra',side:'Gorra de lado',back:'Gorra hacia atrás',visor:'Visera',knit:'Gorro de lana',beret:'Boina',vueltiao:'Sombrero vueltiao',aguadero:'Sombrero aguadeño',cowboy:'Sombrero de vaquero',top:'Sombrero de copa',crown:'Corona',tricolor:'Diadema tricolor',bandana:'Bandana',captain:'Cinta de capitán',cat:'Orejas de gato',horn:'Cuernos',halo:'Aureola',headband:'Diadema',wig:'Peluca clásica'},
 hair:{afro:'Afro',curly:'Rizada',straight:'Larga lacia',mohawk:'Mohicano',high:'Corte alto',shave:'Rapado con raya',braids:'Trenzas',tail:'Coleta',tufts:'Calvo con mechones'},
 glasses:{round:'Redondas',glasses:'Cuadradas',sun:'De sol',aviator:'Aviador',sport:'Deportivas',stereo:'3D',mono:'Monóculo',pirate:'Parche de pirata',mask:'Antifaz'},
 moustache:{moustache:'Bigote clásico',handle:'Manubrio',walrus:'De morsa',soul:'Mosca',goatee:'Candado',chin:'Chivita',short:'Barba corta',long:'Barba larga',sideburn:'Patillas',lumber:'Barba de leñador',brows:'Cejas gruesas'},
 paint:{flag:'Bandera de Colombia',stripes:'Rayas del equipo',scar:'Cicatriz',freckles:'Pecas',moles:'Lunares',bandage:'Curita',tear:'Lágrima'},
 mouth:{clown:'Nariz de payaso',pacifier:'Chupo',bunny:'Dientes de conejo',gold:'Diente de oro',tongue:'Lengua afuera',stick:'Palillo'},
 body:{scarf:'Bufanda',chain:'Cadena',armband:'Brazalete de capitán',wrist:'Muñequeras',gloves:'Guantes',tape:'Cinta en la rodilla'}
 },
 color(k,valor,p){const defecto=({flag:"#f6cd44",stripes:p.kit?.base||p.shirt,tear:"#66c7ee",gold:"#efc347",bunny:"#fff8ed",stick:"#b78c57",tricolor:"#f4cb40"})[valor];return p.colors?.[k]||defecto||this.colores[k]},
 colores:{hat:'#d6a452',hair:'#382621',glasses:'#17344d',moustache:'#472d24',paint:'#e39c65',mouth:'#ed635d',body:'#efbb4e'},
 paleta:{Negro:'#252129','Castaño':'#6f442d',Rubio:'#e8c65f',Pelirrojo:'#ae4026',Gris:'#a6abb0',Verde:'#41915c',Rosado:'#db78a5',Azul:'#5487ce',Tricolor:'tricolor'},
 looks:{'El Pirata':{hat:'bandana',glasses:'pirate',moustache:'handle',body:'chain'},'El Vaquero':{hat:'cowboy',moustache:'walrus',mouth:'stick',body:'scarf'},'El Profe':{hat:'beret',glasses:'round',hair:'shave'},'El Mago':{hat:'top',moustache:'long',body:'gloves'},'El Rockero':{hair:'mohawk',glasses:'sun',body:'wrist'},'Hincha total':{hat:'tricolor',paint:'flag',body:'scarf'},'El Elegante':{hat:'top',glasses:'mono',moustache:'handle',body:'chain'},'El Payaso':{hair:'curly',mouth:'clown',paint:'freckles',body:'gloves'}},
 altura(a){let h=({top:2.02,halo:1.94,horn:1.83,cat:1.81,crown:1.75,cowboy:1.63,aguadero:1.6,vueltiao:1.55,knit:1.58,wig:1.57})[a.hat]||(a.hat&&a.hat!=='none'?1.42:1.09);return Math.max(h,({mohawk:1.65,afro:1.55,high:1.44})[a.hair]||1.15)},
 pincel(c){
  // Helpers limitados al contexto actual: ni imágenes ni fuentes externas.
  return {
   el:(x,y,rx,ry,col,rot=0)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,rot,0,Math.PI*2);c.fill()},
   linea:(pts,col,w=2)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=col;c.lineWidth=w;c.stroke()},
   figura:(d,col,borde='#202335')=>{const p=Vestuario.trazo(d);c.fillStyle=col;c.fill(p);if(borde){c.strokeStyle=borde;c.lineWidth=1.1;c.stroke(p)}},
   rect:(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)}
  }
 },
 trazos:new Map(),
 trazo(d){if(!this.trazos.has(d))this.trazos.set(d,new Path2D(d));return this.trazos.get(d)},
 cabeza(c,p,r){
  const a=p.profile.accessories||{},colors=p.profile.colors||{};
  c.save();c.scale(r/36,r/36);c.lineCap='round';c.lineJoin='round';
  const {el,linea,figura,rect}=this.pincel(c);
  let h=colors.hair||this.colores.hair;
  if(h==='tricolor'){h=c.createLinearGradient(-34,0,34,0);['#f5cc42','#285ba3','#ce474b'].forEach((col,i)=>{h.addColorStop(i/3,col);h.addColorStop((i+1)/3,col)})}
  if(a.hair&&a.hair!=='none'){
   if(['afro','curly'].includes(a.hair))for(let i=0;i<11;i++){const t=Math.PI+i*Math.PI/10;el(30*Math.cos(t),-11+28*Math.sin(t),a.hair==='afro'?13:8,10,h)}
   else if(a.hair==='mohawk')figura('M -12 -26 L -9 -51 L -3 -44 L 1 -56 L 7 -44 L 13 -49 L 14 -28 Z',h);
   else if(a.hair==='high')figura('M -26 -23 L -22 -45 Q 0 -53 21 -46 L 26 -23 Z',h);
   else if(a.hair==='tufts'){el(-28,-18,6,11,h,-.4);el(28,-18,6,11,h,.4);el(0,-24,23,11,p.profile.skin)}
   else{figura('M -32 -6 Q -37 -42 0 -38 Q 34 -40 34 -7 L 23 -20 Q 7 -16 -6 -28 L -22 -18 Z',h);
    if(a.hair==='straight')for(const s of [-1,1])el(s*30,0,5,24,h);
    if(a.hair==='shave')linea([[-25,-17],[-11,-28]],'#dfbd91',2);
    if(a.hair==='braids')for(const s of [-1,1])for(let j=0;j<6;j++)el(s*(30+j%2),-8+j*5,4,4,h);
    if(a.hair==='tail'){el(32,-20,6,6,colors.hat||this.colores.hat);el(38,-13,7,17,h,-.45)}
   }
  }
  const k=a.hat,col=this.color("hat",k,p.profile);
  if(['cap','side','back','visor'].includes(k)){
   if(k!=='visor')figura('M -32 -22 Q -28 -49 2 -43 Q 27 -44 32 -22 Z',col);
   linea([[-30,-22],[30,-22]],col,7);const s=k==='back'?-1:1;
   linea([[s*5,-24],[s*(k==='side'?49:42),k==='side'?-15:-20]],col,6);
  }else if(k==='vueltiao'||k==='aguadero'||k==='cowboy'||k==='top'){
   const top=k==='top';figura(top?'M -20 -29 L -24 -64 Q 0 -69 24 -64 L 20 -29 Z':k==='cowboy'?'M -25 -30 Q -23 -61 -9 -48 Q 0 -38 10 -49 Q 23 -59 26 -30 Z':'M -24 -29 Q -19 -60 0 -49 Q 19 -57 24 -29 Z',col);
   if(k==='cowboy')figura('M -47 -40 Q -29 -27 0 -32 Q 29 -26 47 -40 Q 39 -15 0 -24 Q -40 -14 -47 -40 Z',col);
   else el(0,-29,top?34:47,7,col);
   linea([[-20,-32],[20,-32]],'#30282b',4);
   if(k==='vueltiao')for(const y of [-43,-38,-28])linea([[-18,y],[0,y+2],[18,y]],'#35302a',2)
  }else if(k==='crown')figura('M -30 -23 L -33 -49 L -17 -37 L 0 -55 L 16 -37 L 32 -49 L 29 -23 Z',col);
  else if(k==='cat'||k==='horn'){for(const s of [-1,1]){c.save();c.scale(s,1);figura(k==='cat'?'M 8 -29 L 27 -56 L 34 -17 Z':'M 14 -29 Q 32 -41 26 -59 Q 46 -39 29 -21 Z',col);c.restore()}}
  else if(k==='halo'){el(0,-56,27,5,col);el(0,-57,20,2,'#fff7bd')}
  else if(k==='knit'||k==='beret'){el(k==='beret'?-5:0,-28,33,k==='beret'?11:18,col);if(k==='knit')el(0,-47,6,6,col);linea([[-27,-21],[26,-21]],col,7)}
  else if(k==='wig'){for(let i=0;i<7;i++)el(-29+10*i,-26-12*Math.sin(i*Math.PI/6),11,12,col)}
  else if(k&&k!=='none'){rect(-33,-23,66,8,col);if(k==='tricolor'){rect(-33,-20,66,3,'#2650a2');rect(-33,-17,66,3,'#d84240')}if(k==='bandana')figura('M 25 -21 L 43 -9 L 33 -8 L 39 1 L 24 -15 Z',col);if(k==='captain'){c.fillStyle='#fff';c.font='bold 8px sans-serif';c.fillText('C',17,-16)}}
  const g=a.glasses,gc=colors.glasses||this.colores.glasses;
  if(g==='pirate'){linea([[-30,-10],[27,8]],gc,3);el(13,0,11,8,gc)}
  else if(g==='sport'){figura('M -32 -5 L -8 -7 L 0 -3 L 8 -7 L 32 -5 L 22 6 L 8 8 L 0 2 L -9 8 L -24 5 Z',gc)}
  else if(g==='mask'){figura('M -31 -8 Q 0 -3 31 -8 L 25 8 Q 13 16 4 5 L -4 5 Q -18 18 -26 7 Z',gc);linea([[-22,-1],[-11,0]],'#cfeeff',2);linea([[12,0],[22,-1]],'#cfeeff',2)}
  else if(g&&g!=='none'){for(const s of g==='mono'?[1]:[-1,1]){c.save();c.translate(s*14,1);c.beginPath();if(g==='glasses'||g==='stereo')c.roundRect(-11,-7,22,15,3);else c.ellipse(0,0,g==='aviator'?12:10,g==='round'||g==='mono'?10:8,0,0,7);c.fillStyle=g==='stereo'?(s<0?'#e54b59':'#4eb5dd'):g==='sun'||g==='aviator'?'#182b3ae8':'#b5e8ff55';c.fill();c.strokeStyle=gc;c.lineWidth=3;c.stroke();c.restore()}if(g==='mono')linea([[24,4],[26,16],[29,20]],gc,1);else linea([[-4,0],[4,0]],gc,3)}
  const f=a.moustache,fc=colors.moustache||this.colores.moustache;
  if(a.beard==='beard'||['short','long','lumber','goatee','chin'].includes(f)){
    if(f==='goatee'){linea([[-12,14],[-11,24],[0,28],[11,24],[12,14]],fc,5)}
    else if(f==='chin')figura('M -8 22 Q 0 27 8 22 L 1 39 Z',fc);
    else figura(f==='long'?'M -24 15 Q 0 35 24 15 Q 17 42 0 52 Q -20 42 -24 15 Z':f==='lumber'?'M -27 11 Q 0 31 27 11 L 22 37 L 5 44 L -20 38 Z':'M -25 14 Q 0 34 25 14 Q 17 42 -4 33 Q -20 29 -25 14 Z',fc)
  }
  if(['moustache','handle','walrus','goatee'].includes(f)){for(const s of [-1,1])el(s*7,13,f==='walrus'?12:9,f==='walrus'?5:3.5,fc,s*.15);if(f==='handle')linea([[-23,8],[-20,14],[-10,15],[0,11],[12,15],[20,14],[23,8]],fc,3)}
  if(f==='sideburn')for(const s of [-1,1])el(s*29,3,4,13,fc);
  if(f==='brows')for(const s of [-1,1])linea([[s*22,-11],[s*7,-9]],fc,5);
  if(f==='soul')figura('M -4 21 L 4 21 L 0 28 Z',fc);
  const paint=a.paint,pc=this.color("paint",paint,p.profile);
  for(const s of [-1,1]){if(paint==='flag'){rect(s*21-5,10,10,3,pc);rect(s*21-5,13,10,2,'#3260bd');rect(s*21-5,15,10,2,'#d83e44')}
   if(paint==='stripes')for(const y of [10,15])linea([[s*18,y],[s*27,y-2]],pc,2);
   if(paint==='freckles')for(let i=0;i<5;i++)el(s*(17+i*2),10+i%3*2,1,1,pc)}
  if(paint==='scar')linea([[19,7],[23,12],[20,15],[26,21]],pc,2);
  if(paint==='moles'){el(22,13,2,2,pc);el(-17,19,1.5,1.5,pc)}
  if(paint==='bandage'){el(22,14,8,4,pc,-.5);linea([[20,14],[23,12]],'#fff',2)}
  if(paint==='tear')figura('M -19 8 Q -29 23 -21 23 Q -14 23 -19 8 Z',pc);
  const m=a.mouth,mc=this.color("mouth",m,p.profile);
  if(m==='clown'){el(0,7,8,7,mc);el(-2,4,2,1.5,'#fff9')}
  if(m==='pacifier'){el(0,18,10,6,mc);el(0,22,5,4,'#e7e6d4');el(0,22,2,2,mc)}
  if(m==='bunny'||m==='gold'){rect(-4,15,4,6,mc);if(m==='bunny')rect(1,15,4,6,mc)}
  if(m==='tongue')el(4,19,4,6,mc,-.25);
  if(m==='stick')linea([[7,15],[26,11]],mc,2);c.restore()
 },
 cuerpo(c,p,pose){
  const b=p.profile.accessories?.body;if(!b||b==='none')return;
  const col=p.profile.colors?.body||this.colores.body,{el,linea,figura}=this.pincel(c);
  if(b==='scarf'){figura('M -12 -75 Q 0 -70 12 -75 L 10 -69 L 14 -54 L 7 -56 L 4 -68 Q -3 -65 -12 -69 Z',col)}
  if(b==='chain')linea([[-9,-72],[-6,-65],[0,-62],[7,-65],[9,-72]],col,2.5);
  if(b==='armband')linea([[18+pose.lean,-64],[24+pose.lean,-61]],col,5);
  if(b==='gloves'||b==='wrist')for(const [x,y] of pose.hands)el(x,y-(b==='wrist'?4:0),b==='wrist'?4:5,b==='wrist'?2.5:6,col);
  if(b==='tape'){const pt=pose.feet[0];linea([[(pt[0]-9)/2-4,(pt[1]-34)/2],[(pt[0]-9)/2+5,(pt[1]-34)/2+1]],col,4)}
 }
};
