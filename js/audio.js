class GameAudio{
 constructor(){this.ctx=null;this.beat=0;this.musicClock=0}
 init(){try{if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination)}this.ctx.resume().catch(()=>{});this.sync()}catch(e){}}
 sync(){if(this.master)this.master.gain.value=settings.muted?0:settings.volume*.45;$('soundBtn').textContent=settings.muted?'♪ Silenciado':'♪ Sonido'}
 tone(freq,duration=.1,type='sine',gain=.25,end=null){if(!this.ctx||settings.muted)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(end)o.frequency.exponentialRampToValueAtTime(end,t+duration);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration)}
 noise(duration=.15,gain=.2){if(!this.ctx||settings.muted)return;const b=this.ctx.createBuffer(1,this.ctx.sampleRate*duration,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);const s=this.ctx.createBufferSource(),g=this.ctx.createGain(),f=this.ctx.createBiquadFilter();s.buffer=b;f.type='lowpass';f.frequency.value=1800;g.gain.value=gain;s.connect(f);f.connect(g);g.connect(this.master);s.start()}
 play(type){if(type==='kick'){this.tone(160,.12,'triangle',.45,40);this.noise(.07,.15)}else if(type==='bounce')this.tone(130,.06,'sine',.16,65);else if(type==='goal'){[392,494,587,784].forEach((f,i)=>setTimeout(()=>this.tone(f,.35,'triangle',.3),i*90));this.noise(1.6,.6)}else if(type==='whistle')this.tone(1950,.3,'sine',.13,2100);else if(type==='power'){this.tone(260,.4,'sawtooth',.13,1100)}else this.tone(500,.08,'triangle',.1)}
 update(dt){if(!settings.music)return;this.musicClock+=dt;if(this.musicClock>.3){this.musicClock=0;const notes=[130.81,130.81,164.81,196,110,110,146.83,196];this.tone(notes[this.beat++%8],.22,'triangle',.07)}}
}
const sound=new GameAudio();
// ─── Habilidades: estados aislados; el disparo normal conserva su física. ───
