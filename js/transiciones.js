(function () {
 const audio=StadiumAudio;
 audio.stage=4;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function animate(element,keyframes,duration=260){
  if(!element||!element.animate)return;
  for(const animation of element.getAnimations())animation.cancel();
  element.animate(keyframes,{duration,easing:'cubic-bezier(.2,.7,.2,1)'});
 }
 function enter(id){
  const modal=$(id),dialog=modal?.querySelector('.dialog');
  animate(dialog,reduced()?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}]);
 }
 const open=UI.open.bind(UI);
 UI.open=function(id){const hidden=$(id)?.classList.contains('hidden');open(id);if(hidden){enter(id);audio.fx('ui-open',{gain:.3,cooldown:100})}};
 function exit(element){
  const dialog=element?.querySelector('.dialog');if(!dialog||!dialog.animate)return;
  const rect=dialog.getBoundingClientRect(),ghost=dialog.cloneNode(true);
  ghost.removeAttribute('id');ghost.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
  const originals=dialog.querySelectorAll('canvas');ghost.querySelectorAll('canvas').forEach((canvas,i)=>canvas.getContext('2d').drawImage(originals[i],0,0));
  ghost.setAttribute('aria-hidden','true');ghost.inert=true;
  ghost.style.cssText=`position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;max-height:none;pointer-events:none;z-index:200100;overflow:hidden;margin:0;`;
  document.body.append(ghost);
  const frames=reduced()?[{opacity:.8},{opacity:0}]:[{opacity:.8,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}];
  const animation=ghost.animate(frames,{duration:220,easing:'ease-out'});animation.finished.catch(()=>{}).finally(()=>ghost.remove());
 }
 const close=UI.close.bind(UI);
 UI.close=function(id){const element=$(id),visible=element&&!element.classList.contains('hidden');if(visible)exit(element);close(id);if(visible)audio.fx('ui-close',{gain:.3,cooldown:100})};
 const hideAll=UI.hideAll.bind(UI);
 UI.hideAll=function(){const visible=document.querySelectorAll('.modal:not(.hidden)');visible.forEach(exit);hideAll();if(visible.length)audio.fx('ui-close',{gain:.25,cooldown:100})};
 const banner=UI.banner.bind(UI);let lastBanner='';
 UI.banner=function(main,sub){banner(main,sub);if(main&&main!==lastBanner){animate($('banner'),reduced()?[{opacity:.3},{opacity:1}]:[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],220)}lastBanner=main};
 const start=game.start.bind(game);
 game.start=function(...args){const result=start(...args);for(const selector of ['.hud','.arenaActions','.energy'])document.querySelectorAll(selector).forEach(element=>animate(element,reduced()?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],280));return result};
 const finish=game.finish.bind(game);
 game.finish=function(...args){
  const committed=this.resultCommitted;const result=finish(...args);
  if(!committed&&this.resultCommitted&&document.body.animate){
   const fade=document.createElement('div');fade.setAttribute('aria-hidden','true');fade.style.cssText='position:fixed;inset:0;background:#000;pointer-events:none;z-index:200200';document.body.append(fade);
   const animation=fade.animate([{opacity:0},{opacity:.85,offset:.35},{opacity:0}],{duration:340,easing:'ease-in-out'});animation.finished.catch(()=>{}).finally(()=>fade.remove());
  }
  return result;
 };
 const menu=game.menu.bind(game);
 game.menu=function(...args){const result=menu(...args);animate(document.querySelector('.below'),reduced()?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],280);return result};
})();
