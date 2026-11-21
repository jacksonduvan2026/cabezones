/* Fixed presentation scale and viewport diagnostics. */
(function () {
 const visualViewport=window.visualViewport;
 function resetCamera(){
  for(const scene of Presentation.engine.scene.getScenes(true)){
   const camera=scene.cameras?.main;if(!camera)continue;
   scene.tweens?.killTweensOf(camera);camera.zoomEffect?.reset();camera.setZoom(1);
  }
 }
 function resize(){
  const viewport=window.visualViewport;
  const width=Math.max(1,Math.round(viewport?.width||innerWidth));
  const height=Math.max(1,Math.round(viewport?.height||innerHeight));
  document.documentElement.style.setProperty('--viewWidth',width+'px');
  document.documentElement.style.setProperty('--viewHeight',height+'px');
  Mobile.scale();
  const host=document.getElementById('phaserView'),bounds=host.getBoundingClientRect();
  Presentation.engine.scale.setParentSize(bounds.width,bounds.height);
  Presentation.engine.scale.refresh();
  // Explicit CSS fit also covers Safari's changing browser bars.
  const fit=Math.min(bounds.width/W,bounds.height/H),canvas=Presentation.engine.canvas;
  Object.assign(canvas.style,{width:W*fit+'px',height:H*fit+'px',marginLeft:(bounds.width-W*fit)/2+'px',marginTop:(bounds.height-H*fit)/2+'px'});
  resetCamera();
 }
 let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;resize()})}
 const layout=Mobile.layout.bind(Mobile);Mobile.layout=function(){layout();schedule()};
 const enter=Mobile.enter.bind(Mobile);Mobile.enter=function(){const result=enter();schedule();return result};
 const style=document.createElement('style');style.textContent='.mobile-session.live{width:var(--viewWidth,100dvw);height:var(--viewHeight,100dvh)}.mobile-session.live .arena,#phaserView,#pitch{touch-action:none}input,textarea,select,[contenteditable=true]{font-size:16px!important}';document.head.append(style);
 for(const event of ['resize','orientationchange','pageshow'])window.addEventListener(event,schedule);
 document.addEventListener('fullscreenchange',schedule);window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);
 for(const name of ['start','resume','menu','skipReplay']){
  const original=game[name].bind(game);game[name]=function(...args){resetCamera();const result=original(...args);schedule();return result};
 }
 const draw=renderer.draw.bind(renderer);let lastState,lastSlow;
 renderer.draw=function(g){draw(g);if(g.state!==lastState||!!g.slow!==lastSlow){resetCamera();lastState=g.state;lastSlow=!!g.slow}};
 function editable(target){return !!target?.closest?.('input,textarea,select,[contenteditable=true]')}
 for(const event of ['gesturestart','gesturechange','gestureend','dblclick'])document.addEventListener(event,e=>{if(!editable(e.target))e.preventDefault()},{passive:false});
 document.addEventListener('touchmove',e=>{if(e.touches.length>1&&!editable(e.target))e.preventDefault()},{passive:false});
 schedule();
 if(new URLSearchParams(location.search).get('debug')==='1'){
  const debug=document.createElement('pre');debug.id='scaleDebug';debug.style.cssText='position:fixed;left:4px;top:4px;z-index:999999;pointer-events:none;margin:0;padding:5px;background:#001d;color:#fff;font:10px/1.3 monospace;white-space:pre-wrap;max-width:90vw';document.body.append(debug);
  setInterval(()=>{const canvas=Presentation.engine.canvas,rect=canvas.getBoundingClientRect(),camera=Presentation.engine.scene.getScenes(true)[0]?.cameras?.main;debug.textContent=`inner ${innerWidth} × ${innerHeight}\nviewport ${visualViewport?.width||innerWidth} × ${visualViewport?.height||innerHeight} (scale ${visualViewport?.scale||1})\nDPR ${devicePixelRatio}\nsource ${$('pitch').width} × ${$('pitch').height}\nPhaser ${canvas.width} × ${canvas.height}\nCSS ${Math.round(rect.width)} × ${Math.round(rect.height)}\nzoom ${camera?.zoom??1} · FIT · CENTER_BOTH`;},250);
 }
 // Apply updates at the menu. During a match retain the current document.
 let previousController=!!navigator.serviceWorker?.controller;
 navigator.serviceWorker?.addEventListener('controllerchange',()=>{
  if(!previousController){previousController=true;return}
  if(!game.active)location.reload();else UI.toast('Actualización lista. Cierra y vuelve a abrir el juego al terminar el partido.');
 });
})();
