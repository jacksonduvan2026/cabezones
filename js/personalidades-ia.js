const PersonalidadesIA={
 data:null,
 ready:null,
 profile(id){const style=this.data?.teams?.[id]||'equilibrado';return {style,...this.data?.styles?.[style]}},
 install(){
  this.ready=fetch('perfiles-ia.json').then(response=>{if(!response.ok)throw Error('perfiles-ia.json');return response.json()}).then(data=>{
   for(const style of Object.values(data.styles||{}))for(const key of ['attack','line','skills'])if(!Number.isFinite(style[key])||style[key]<0||style[key]>1)throw Error('Perfil fuera de rango');
   this.data=data;this.label();return data;
  }).catch(error=>{console.warn('Perfiles de IA no disponibles:',error);return null});
  const apply=(p,g,dt,read)=>{
   const charge=p.aiCharge,a=read(p,g,dt);if(settings.classic||p.human!==null||!this.data)return a;
   const profile=this.profile(p.profile.clubId),dir=p.team===0?1:-1,score=g.score[p.team]-g.score[1-p.team];
   const reaction=score>0?clamp(profile.winning||0,-.3,.3):score<0?clamp(profile.losing||0,-.3,.3):0;
   const attack=clamp((profile.attack??.6)+reaction,.25,.95),line=profile.line??.5;
   const offset=(p.smartRole==='support'?(line-.5)*100:(attack-.6)*90)*dir;
   const target=clamp((p.aimX??p.x)+offset,115,1085),mate=g.players.find(q=>q.team===p.team&&q!==p&&Math.abs(q.x-g.ball.x)<Math.abs(p.x-g.ball.x));
   const difficulty=g.config.mode==='cup'?(g.config.aiLevel||.8):({easy:.5,medium:.78,hard:1}[g.config.difficulty]||.78),dead=9+(1-difficulty)*23;
   if(!(mate&&Math.abs(mate.x-p.x)<110)){a.left=p.x>target+dead;a.right=p.x<target-dead}
   const distance=Math.abs(g.ball.x-p.x);
   if(profile.shot==='cabeza'&&p.grounded&&distance<105&&g.ball.y<p.headY-16&&g.ball.vy>0&&p.aiCooldown<=0)a.jumpPressed=true;
   if(profile.shot==='rasante'&&g.ball.y>p.y-105)a.jumpPressed=false;
   if(charge<=0&&p.aiCharge>0){const factor=profile.shot==='potente'?1.2:profile.shot==='rapido'?.8:1;p.aiCharge=clamp(p.aiCharge*factor,.05,.6)}
   if(a.specialPressed&&(profile.skills??.75)<.7&&!g.players.some(q=>q.team!==p.team&&Math.abs(q.x-p.x)<140))a.specialPressed=false;
   return a;
  };
  const solo=AI.read,team=TeamAI.read;AI.read=(p,g,dt)=>apply(p,g,dt,solo);TeamAI.read=(p,g,dt)=>apply(p,g,dt,team);
  const preview=Clubs.preview.bind(Clubs);Clubs.preview=(...args)=>{const result=preview(...args);this.label();return result};
  $('stadiumContinue').addEventListener('click',()=>this.label());
 },
 label(){
  if(!$('clubPreview')?.children.length)return;
  const section=$('clubPreview').querySelector('section:last-child');if(!section)return;
  const name=section.querySelector('h3')?.textContent;const club=CLUBS.find(c=>c.name===name);if(!club)return;
  let label=section.querySelector('.aiStyle');if(!label){label=document.createElement('p');label.className='hint aiStyle';section.append(label)}
  const style=this.profile(club.id).style;const text='Estilo: '+({fisico:'físico',tecnico:'técnico'}[style]||style);if(label.textContent!==text)label.textContent=text;
 }
};
PersonalidadesIA.install();
new MutationObserver(()=>PersonalidadesIA.label()).observe($('clubPreview'),{childList:true,subtree:true});
