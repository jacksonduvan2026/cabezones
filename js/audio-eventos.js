(function () {
 const audio=StadiumAudio;
 audio.stage=3;
 let restarting=false,lastCount=null,lastReadyCheck=-1,reactionAt=0,previousBall=null;
 const start=game.start.bind(game);
 game.start=function(...args){
  audio.session++;audio.stopEffects();audio.clearVoice();audio.pendingIntro=null;
  restarting=false;lastCount=null;lastReadyCheck=-1;previousBall=null;
  for(const p of this.players)p._audioReady=false;
  const result=start(...args);audio.syncLoops();return result;
 };
 const menu=game.menu.bind(game);
 game.menu=function(...args){audio.session++;audio.stopEffects();audio.clearVoice();audio.pendingIntro=null;const result=menu(...args);audio.syncLoops();return result};
 const pause=game.pause.bind(game);
 game.pause=function(...args){const result=pause(...args);audio.stopEffects();audio.clearVoice();audio.syncLoops();return result};
 const resume=game.resume.bind(game);
 game.resume=function(...args){const result=resume(...args);audio.unlock();audio.syncLoops();return result};
 const afterGoal=game.afterGoal.bind(game);
 game.afterGoal=function(...args){restarting=true;lastCount=null;return afterGoal(...args)};
 const update=game.update.bind(game);
 game.update=function(dt){
  const state=this.state;
  if(state==='countdown'){
   const number=this.countdown>.4?Math.ceil(this.countdown-.4):0;
   if(number!==lastCount){lastCount=number;if(number>=1&&number<=3)audio.fx('count-'+number,{gain:.7,cooldown:200});else if(number===0)audio.fx('count-go',{gain:.7,cooldown:500})}
  }
  update(dt);
  if(state==='countdown'&&this.state==='playing'){
   audio.whistle(restarting?'restart':'start');
   if(audio.pendingIntro){const text=audio.pendingIntro;audio.pendingIntro=null;audio.say(text)}
  }
  if(this.state!=='playing'||this.elapsed-lastReadyCheck<.1)return;
  lastReadyCheck=this.elapsed;
  for(const p of this.players){const ready=Skills.ready(p);if(ready&&!p._audioReady&&p.human!==null)audio.fx('energy-ready',{gain:.55,cooldown:2200});p._audioReady=ready}
  const ball=this.ball,now=performance.now();
  if(previousBall&&now>reactionAt&&Math.abs(previousBall.vx)>260&&this.elapsed>=(this.lastShotTime??-10)&&this.elapsed-(this.lastShotTime??-10)<2){
   const nearPost=ball.x<145||ball.x>1055;
   const reversing=Math.sign(ball.vx)!==Math.sign(previousBall.vx);
   const overBar=ball.y<GOALTOP-ball.r&&ball.y>GOALTOP-130;
   if(nearPost&&(reversing||overBar)){audio.fx(overBar?'crowd-miss':'crowd-near',{bus:'crowd',gain:.8,cooldown:2400});reactionAt=now+2400}
  }
  previousBall={x:ball.x,y:ball.y,vx:ball.vx};
 };
 const use=Skills.use.bind(Skills);
 Skills.use=function(p,g){audio.skillContext=Skills.get(p.profile.skill).id;try{return use(p,g)}finally{audio.skillContext=null}};
 const apply=game.applyPower.bind(game);
 game.applyPower=function(p,type){const result=apply(p,type);audio.fx(type[0]==='freeze'?'skill-freeze':'item-pickup',{gain:.8});return result};
 const penalties=Penalties.start.bind(Penalties);
 Penalties.start=function(g){penalties(g);audio.whistle('shootout');audio.syncLoops()};
 const decide=Penalties.decide.bind(Penalties);
 Penalties.decide=function(lane){if(this.data?.phase==='choose')audio.whistle('penalty');return decide(lane)};
 const finish=game.finish.bind(game);
 game.finish=function(...args){
  const committed=this.resultCommitted;const result=finish(...args);
  if(!committed&&this.resultCommitted){
   const winner=this.penaltyWinner??(this.score[0]===this.score[1]?null:this.score[0]>this.score[1]?0:1);
   audio.fx(winner===null?'result-draw':winner===0?'result-win':'result-lose',{delay:2.4,gain:.7,cooldown:1000});
   if(this.config.mode==='cup'&&Cup.data?.done&&Cup.data.champion===0)audio.fx('cup-champion',{delay:3.8,gain:.8,cooldown:3000});
  }
  audio.syncLoops();return result;
 };
 document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||button.disabled)return;
  if(button.closest('#touch'))return;
  const back=button.matches('[data-close]')||/cancel|back|exit|menu/i.test(button.id);
  const select=button.closest('.clubcard,.stadiumChoice')||button.matches('[data-mode]');
  audio.fx(back?'ui-back':select?'ui-select':button.classList.contains('primary')?'ui-accept':'ui-tap',{gain:.45,cooldown:70});
 },true);
 let lastAdjust=0;
 for(const type of ['input','change'])document.addEventListener(type,event=>{
  if(!event.target.matches('input,select')||performance.now()-lastAdjust<110)return;
  lastAdjust=performance.now();audio.fx('ui-adjust',{gain:.3,cooldown:110});
 });
})();
