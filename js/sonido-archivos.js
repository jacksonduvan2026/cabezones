/* File audio mixer. The legacy generator stays silent to preserve its RNG use. */
(function () {
 const fxNames = ['kick','head','post','net','goal','power','click',
  'whistle-start','whistle-restart','whistle-end','whistle-golden','whistle-penalty','whistle-shootout',
  'crowd-near','crowd-miss','crowd-goal','ui-tap','ui-accept','ui-back','ui-open','ui-close','ui-select','ui-adjust',
  'energy-ready','count-3','count-2','count-1','count-go','result-win','result-lose','result-draw','cup-champion','item-pickup',
  ...SKILLS.map(skill=>'skill-'+skill.id)];
 const probe=document.createElement('audio');
 const formats=probe.canPlayType('audio/ogg; codecs="vorbis"')?['ogg','mp3']:['mp3','ogg'];
 const legacyPlay=sound.play.bind(sound),legacyInit=sound.init.bind(sound),legacySync=sound.sync.bind(sound);
 const mixer=window.StadiumAudio={
  stage:1,ctx:null,buffers:new Map(),files:new Map(),loops:new Map(),sources:new Set(),events:[],
  lastFx:new Map(),duckUntil:0,whistleUntil:0,speaking:false,voiceTimer:null,pendingIntro:null,
  async bytes(name,format){
   const key=name+'.'+format;
   if(!this.files.has(key))this.files.set(key,fetch('audio/'+key).then(response=>{if(!response.ok)throw Error(key);return response.arrayBuffer()}));
   return this.files.get(key);
  },
  async buffer(name){
   if(!this.ctx)return null;
   if(!this.buffers.has(name))this.buffers.set(name,(async()=>{
    for(const format of formats){try{return await this.ctx.decodeAudioData((await this.bytes(name,format)).slice(0))}catch{}}
    console.warn('Audio no disponible en OGG ni MP3:',name);return null;
   })());
   return this.buffers.get(name);
  },
  unlock(){
   legacyInit();if(sound.master)sound.master.gain.value=0;
   if(!sound.ctx)return;
   if(!this.ctx){
    this.ctx=sound.ctx;this.master=this.ctx.createGain();this.limiter=this.ctx.createDynamicsCompressor();this.limiter.threshold.value=-8;this.limiter.ratio.value=4;this.limiter.knee.value=12;this.master.connect(this.limiter);this.limiter.connect(this.ctx.destination);
    this.buses={};for(const name of ['effects','crowd','music']){const gain=this.ctx.createGain();gain.connect(this.master);this.buses[name]=gain}
    for(const name of fxNames)this.buffer(name);
   }
   this.ctx.resume().catch(()=>{});this.mix();
  },
  ramp(node,value,time=.18){
   if(!node||!this.ctx)return;const now=this.ctx.currentTime;
   node.gain.cancelScheduledValues(now);node.gain.setTargetAtTime(Math.max(0,value),now,time);
  },
  mix(){
   if(!this.ctx)return;
   const hidden=document.hidden,paused=game.state==='paused';
   this.ramp(this.master,settings.muted||hidden?0:settings.volume,.04);
   const duck=(this.speaking&&settings.narrator&&!settings.muted)||performance.now()<this.duckUntil;
   this.ramp(this.buses.effects,settings.effectsVolume,.02);
   this.ramp(this.buses.music,settings.music&&!paused?settings.musicVolume*(duck?.1:.32):0,.22);
   const tight=game.active&&game.time<=10&&Math.abs(game.score[0]-game.score[1])<=1;
   const near=game.state==='playing'&&(game.ball.x<280||game.ball.x>920);
   this.ramp(this.buses.crowd,settings.crowd&&!paused&&game.active?settings.crowdVolume*(duck?.18:1)*(tight?1.25:1)*(near?1.15:1):0,.18);
  },
  fx(name,{gain=1,bus='effects',cooldown=50,delay=0}={}){
   if(!this.ctx||settings.muted||document.hidden)return;
   const now=performance.now();if(now-(this.lastFx.get(name)||-Infinity)<cooldown)return;this.lastFx.set(name,now);
   this.events.push(name);if(this.events.length>100)this.events.shift();
   const session=this.session;
   this.buffer(name).then(buffer=>{
    if(!buffer||document.hidden||settings.muted||session!==this.session||(game.state==='paused'&&!name.startsWith('ui-')))return;
    const source=this.ctx.createBufferSource(),level=this.ctx.createGain();source.buffer=buffer;level.gain.value=gain;
    source.connect(level);level.connect(this.buses[bus]);this.sources.add(source);
    source.onended=()=>{this.sources.delete(source);source.disconnect();level.disconnect()};source.start(this.ctx.currentTime+delay);
   });
  },
  whistle(kind){
   const durations={start:.6,restart:.22,end:2.25,golden:.95,penalty:.2,shootout:.45};
   this.whistleUntil=performance.now()+(durations[kind]||.3)*1000;
   this.duckUntil=this.whistleUntil+120;this.fx('whistle-'+kind,{cooldown:100});this.mix();
  },
  async loop(key,name,bus,gain=1){
   if(!this.ctx||this.loops.has(key))return;
   const entry={source:null,gain:null,loading:true};this.loops.set(key,entry);
   const buffer=await this.buffer(name);
   if(this.loops.get(key)!==entry)return;
   if(!buffer){this.loops.delete(key);return}
   const source=this.ctx.createBufferSource(),level=this.ctx.createGain();source.buffer=buffer;source.loop=true;if(bus==='crowd'){const venue=Ambiente.current().club||'';const variation=[...venue].reduce((sum,ch)=>sum+ch.charCodeAt(0),0)%5;source.playbackRate.value=.984+variation*.008}
   level.gain.value=0;source.connect(level);level.connect(this.buses[bus]);entry.source=source;entry.gain=level;entry.loading=false;
   source.start(this.ctx.currentTime,key==='away'?buffer.duration/2:0);this.ramp(level,gain,.3);
  },
  stopLoop(key){
   const entry=this.loops.get(key);if(!entry)return;this.loops.delete(key);
   if(entry.source){this.ramp(entry.gain,0,.12);const source=entry.source;source.onended=()=>{source.disconnect();entry.gain.disconnect()};try{source.stop(this.ctx.currentTime+.6)}catch{}}
  },
  syncLoops(){
   const active=this.ctx&&!document.hidden&&!['paused','result','bracket','penalties'].includes(game.state);
   const music=active&&settings.music?(game.active?'partido':'menu'):null;
   for(const key of ['menu','partido'])if(music===key)this.loop(key,key,'music');else this.stopLoop(key);
   const crowd=active&&game.active&&settings.crowd;
   if(crowd){this.loop('home','crowd-stadium','crowd',.65);this.loop('away','crowd-stadium','crowd',.28)}else{this.stopLoop('home');this.stopLoop('away')}
   this.mix();
  },
  stopEffects(){for(const source of this.sources){try{source.stop()}catch{}}this.sources.clear()},
  clearVoice(){clearTimeout(this.voiceTimer);this.voiceTimer=null;this.speaking=false;window.speechSynthesis?.cancel()},
  say(text){
   if(!settings.narrator||settings.muted||settings.narratorVolume<=0||settings.volume<=0||document.hidden||!this.ctx)return;
   if(game.state==='countdown'){this.pendingIntro=text;return}
   clearTimeout(this.voiceTimer);
   const session=this.session,wait=Math.max(0,this.whistleUntil-performance.now())+100;
   this.voiceTimer=setTimeout(()=>{
    if(session!==this.session||document.hidden||settings.muted||!settings.narrator||game.state==='paused')return;
    const synth=window.speechSynthesis;if(!synth)return;
    const voices=synth.getVoices(),voice=voices.find(v=>v.localService&&v.lang.toLowerCase()==='es-co')||voices.find(v=>v.localService&&/^es/i.test(v.lang));
    if(!voice)return;
    synth.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=1.05;utterance.volume=settings.volume*settings.narratorVolume;
    utterance.onstart=()=>{this.speaking=true;this.mix()};utterance.onend=utterance.onerror=()=>{this.speaking=false;this.mix()};synth.speak(utterance);
   },wait);
  },
  session:0
 };
 for(const name of fxNames)mixer.bytes(name==='bounce'?'head':name,formats[0]).catch(()=>{});
 sound.init=()=>mixer.unlock();
 sound.sync=()=>{legacySync();if(sound.master)sound.master.gain.value=0;mixer.syncLoops()};
 sound.play=type=>{
  legacyPlay(type);if(sound.master)sound.master.gain.value=0;
  if(type==='whistle'){
   if(game.state==='countdown')return;
   mixer.whistle(game.state==='result'?'end':game.overtime?'golden':'restart');return;
  }
  if(type==='power'&&mixer.skillContext){mixer.fx('skill-'+mixer.skillContext);return}
  if(type==='goal'){
   let home=0;if(game.config.mode==='cup'&&Cup.current()?.a!==0)home=1;
   const gain=game.goalTeam===home?1.15:.85;
   mixer.fx('crowd-goal',{bus:'crowd',gain:game.overtime?gain*1.2:gain});mixer.fx('goal',{gain:.5});return;
  }
  mixer.fx(type==='bounce'?'head':type);
  if(type==='post')mixer.fx('crowd-near',{bus:'crowd',cooldown:2200,gain:.8});
 };
 sound.update=()=>{};Ambiente.beat=()=>{};Ambiente.speak=text=>mixer.say(text);
 for(const event of ['pointerdown','keydown','touchstart'])document.addEventListener(event,()=>{if(!document.hidden)mixer.unlock()},{capture:true,passive:true});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){mixer.stopEffects();mixer.clearVoice();mixer.syncLoops();mixer.ctx?.suspend().catch(()=>{})}
  else{mixer.ctx?.resume().catch(()=>{});mixer.syncLoops()}
 });
 setInterval(()=>mixer.syncLoops(),120);
})();
