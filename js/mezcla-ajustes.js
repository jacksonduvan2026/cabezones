(function () {
 const mixer=StadiumAudio,grid=document.querySelector('#settingsModal .settingsgrid');
 mixer.stage=5;
 for(const [id,title,key,initial] of [
  ['effectsVolume','EFECTOS','effectsVolume',.85],
  ['crowdVolume','HINCHADA','crowdVolume',.45]
 ]){
  if(typeof settings[key]!=='number'||!Number.isFinite(settings[key])||settings[key]<0||settings[key]>1)settings[key]=initial;
  const label=document.createElement('label');label.textContent=title;
  const range=document.createElement('input');Object.assign(range,{id,type:'range',min:'0',max:'1',step:'.01',value:String(settings[key])});
  range.oninput=()=>{settings[key]=+range.value;mixer.mix();persist()};label.append(range);grid.append(label);
 }
 $('volume').closest('label').firstChild.nodeValue='VOLUMEN GENERAL';
 const label=document.createElement('label');label.className='check';label.innerHTML='<input id="muteAll" type="checkbox"> Silenciar todo';grid.append(label);
 $('muteAll').onchange=()=>{settings.muted=$('muteAll').checked;if(settings.muted){mixer.stopEffects();mixer.clearVoice()}sound.sync();persist()};
 const settingsUI=UI.settings.bind(UI);
 UI.settings=()=>{settingsUI();$('effectsVolume').value=settings.effectsVolume;$('crowdVolume').value=settings.crowdVolume;$('muteAll').checked=settings.muted};
 for(const id of ['volume','musicVolume'])$(id).addEventListener('input',()=>{if(settings.volume===0)mixer.clearVoice();mixer.mix()});
 persist();
})();
