
'use strict';
// ─── Utilidades y persistencia. El archivo no realiza peticiones de red. ───
const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rand=(a,b)=>a+Math.random()*(b-a), W=1200,H=650,FLOOR=553,GOALTOP=378,GOALDEPTH=74,DT=1/120;
const DEFAULT_KEYS=[{left:'KeyA',right:'KeyD',jump:'KeyW',kick:'KeyS',special:'KeyF',tackle:'KeyE'},{left:'ArrowLeft',right:'ArrowRight',jump:'ArrowUp',kick:'ArrowDown',special:'Period',tackle:'Slash'}];
const actionNames={left:'Izquierda',right:'Derecha',jump:'Saltar',kick:'Cargar tiro',special:'Habilidad',tackle:'Barrida'};
const defaults={volume:.35,quality:'high',showfps:false,music:false,replays:true,shake:true,muted:false,keys:structuredClone(DEFAULT_KEYS)};
const baseProfiles=[{name:'TU NOMBRE',shirt:'#b9f34b',shorts:'#192b31',socks:'#b9f34b',skin:'#d59669',number:10,shoe:'classic',head:1,photo:null},{name:'LA MÁQUINA',shirt:'#f0758c',shorts:'#222638',socks:'#f0758c',skin:'#b87950',number:7,shoe:'neon',head:1,photo:null}];
let saved={};try{saved=JSON.parse((localStorage.getItem('cabezaEstadio.v6')||localStorage.getItem('cabezaEstadio.v5')||localStorage.getItem('cabezaEstadio.v4')||localStorage.getItem('cabezaEstadio.v3')||localStorage.getItem('cabezaEstadio.v2')||localStorage.getItem('cabezaEstadio.v1'))||'{}')||{}}catch(e){}
let settings={...defaults,...saved.settings};if(!Array.isArray(settings.keys)||settings.keys.length!==2)settings.keys=structuredClone(DEFAULT_KEYS);
// Reject invalid presentation preferences without changing profiles or saved cups.
if (!['low','medium','high','off'].includes(settings.quality)) settings.quality='medium';
for (const [key,min,max,fallback] of [['touchScale',.8,1.4,1],['touchInset',0,80,12],['volume',0,1,.35],['musicVolume',0,1,.55],['effectsVolume',0,1,.85],['crowdVolume',0,1,.45],['narratorVolume',0,1,.8]]) {
 if (typeof settings[key]!=='number'||!Number.isFinite(settings[key])||settings[key]<min||settings[key]>max) settings[key]=fallback;
}
for (const key of ['muted','music','narrator','crowd']) {if(typeof settings[key]!=='boolean')settings[key]=key==='narrator'||key==='crowd'}
for (const key of ['scale','zoom','cameraZoom','pixelRatio','resolution']) delete settings[key];
if(typeof settings.estiloClasico!=='boolean')settings.estiloClasico=settings.classic===true;
let profiles=baseProfiles.map((p,i)=>({...p,...saved.profiles?.[i]}));let records={games:0,wins:0,goals:0,cups:0,bestPractice:0,achievements:[],...saved.records};
let storageWarning=false;function persist(){try{localStorage.setItem('cabezaEstadio.v6',JSON.stringify({...saved,version:9,settings,profiles,records}))}catch(e){if(!storageWarning){storageWarning=true;UI.toast('El navegador no permite guardar más datos. El juego sigue funcionando.')}}}
const photoCache=new Map();function photoImage(src){if(!src)return null;if(!photoCache.has(src)){const img=new Image();img.src=src;photoCache.set(src,img)}const im=photoCache.get(src);return im.complete&&im.naturalWidth?im:null}profiles.forEach(p=>photoImage(p.photo));
function unlock(id){if(records.achievements.includes(id))return;records.achievements.push(id);persist();UI.toast('★ Logro desbloqueado: '+id)}
// ─── Audio: sintetizador, percusión y ambiente sin archivos. ───
