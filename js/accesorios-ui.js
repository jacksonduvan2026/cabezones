(function(){
 const visual=PersonalidadVisual,actores=new WeakMap();
 const visible=canvas=>{const rect=canvas.getBoundingClientRect();return rect.bottom>0&&rect.top<innerHeight};
 const companeros=new WeakMap(),opciones=Object.keys(visual.celebrations).slice(1);
 function actor(canvas,profile,index,state='menu',team=index){
  const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);c.save();
  let p=actores.get(canvas);if(!p){p=new Player(index,profile);actores.set(canvas,p)}p.profile=profile;p.x=canvas.width/2;p.y=canvas.height-22;p.team=team;p.walk=game.demoTime;p.vx=0;
  const g={...game,state,demoTime:game.demoTime,visualTime:game.demoTime%1.7};g.players=[p];g.preview=true;if(state==='goal')g.goalTeam=team;g.visualChoice=profile.celebration==='random'?opciones[Math.floor(game.demoTime/1.7)%opciones.length]:profile.celebration;
  if(canvas.dataset.dance!==undefined&&Festejos.pares.includes(g.visualChoice)){
   let mate=companeros.get(canvas);if(!mate){mate=new Player(1-index,profiles[1-index]);companeros.set(canvas,mate)}
   mate.team=team;mate.profile=profiles[1-index];mate.y=p.y;
   const cerca=g.visualChoice==='hug'||g.visualChoice==='chest',arc=visual.reduced()?1:Math.sin(Math.PI*g.visualTime/1.7);
   const offset=52-(cerca?31:14)*arc;p.x-=offset;mate.x=canvas.width/2+offset;renderer.player(mate,g,c)
  }
  renderer.player(p,g,c);c.restore();
 }
 const original=UI.renderProfiles.bind(UI);
 UI.renderProfiles=function(){
  original();
  document.querySelectorAll('#profiles .profile').forEach((section,index)=>{
   Vestidor.montar(section,profiles[index],index);
  });
 };
 const resultActors=document.createElement('div');resultActors.className='row';resultActors.style.justifyContent='center';
 for(let i=0;i<2;i++){const canvas=document.createElement('canvas');canvas.width=190;canvas.height=240;canvas.style.cssText='width:min(150px,40%);height:auto';resultActors.append(canvas)}
 $('resultStats').before(resultActors);
 const champion=document.createElement('canvas');champion.width=190;champion.height=240;champion.style.cssText='display:block;width:150px;height:auto;margin:auto';$('cupContent').before(champion);
 let last=-1;
 const draw=renderer.draw.bind(renderer);
 renderer.draw=function(g){
  draw(g);const rate=(settings.quality==='low'||visual.reduced()) ? .1 : 1/30;if(g.demoTime-last<rate)return;last=g.demoTime;
  if(!$('customModal').classList.contains('hidden')){
   document.querySelectorAll('[data-dance]').forEach(canvas=>{const i=+canvas.dataset.dance;if(visible(canvas))actor(canvas,profiles[i],i,'goal',i)});
   document.querySelectorAll('[data-visual-preview]').forEach(canvas=>{const i=+canvas.dataset.visualPreview;if(visible(canvas))actor(canvas,profiles[i],i);document.querySelector('[data-accessory-notice="'+i+'"]').classList.toggle('hidden',!profiles[i].photo)});
  }
  if(!$('resultsModal').classList.contains('hidden')){
   [...resultActors.children].forEach((canvas,i)=>{const p=g.players.find(p=>p.team===i);if(p)actor(canvas,p.profile,i,'result',i)});
  }
  const won=Cup.data?.done&&Cup.data.champion===0;champion.classList.toggle('hidden',!won);
  if(won&&!$('cupModal').classList.contains('hidden'))actor(champion,profiles[0],0,'goal',0);
 };
 const style=document.createElement('style');style.textContent='.visualOptions{margin-top:18px;padding-top:12px;border-top:1px solid #435369}.visualOptions>label{display:grid;gap:6px;margin:9px 0}.visualOptions select{min-height:44px}';document.head.append(style);
})();

{
 const perfilesPrevios=UI.renderProfiles.bind(UI);
 UI.renderProfiles=function(){const result=perfilesPrevios();Cuerpo.paleta();return result};
}

{
 const label=document.createElement('label');
 label.className='check';
 const control=document.createElement('input');
 control.id='estiloClasico';control.type='checkbox';control.checked=settings.estiloClasico;
 label.append(control,' Estilo y física clásicos');
 const anterior=$('classicMode'), fila=anterior.parentElement;
 fila.before(label);
 function mostrar(){control.checked=settings.estiloClasico;fila.classList.toggle('hidden',!settings.estiloClasico)}
 control.onchange=()=>{
   settings.estiloClasico=control.checked;
   if(control.checked)settings.classic=settings.fisicaHistorica===true;
   else{settings.fisicaHistorica=settings.classic===true;settings.classic=false}
   anterior.checked=settings.classic;
   game.players.forEach(p=>{p.zonasContacto=null;p.inclinacion=0;p.jumpGrace=p.jumpBuffer=p.kickBuffer=0});
   Fluidez.anterior=new WeakMap();Fluidez.camara=0;game.hitStop=0;
   mostrar();persist();
 };
 mostrar();
}
