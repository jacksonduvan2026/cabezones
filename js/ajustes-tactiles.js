(function () {
 const grid=document.querySelector('#settingsModal .settingsgrid');
 for(const [key,title,min,max,step,initial] of [['touchScale','Tamaño de controles',.8,1.4,.05,1],['touchInset','Separación del borde',0,80,2,12],['narratorVolume','Volumen del narrador',0,1,.05,.8]]) {
  settings[key]??=initial;
  const label=document.createElement('label');label.textContent=title;
  const range=document.createElement('input');range.type='range';Object.assign(range,{min,max,step,value:settings[key]});
  range.oninput=()=>{settings[key]=+range.value;apply();persist()};label.append(range);grid.append(label);
 }
 const style=document.createElement('style');document.head.append(style);
 function apply(){style.textContent=`.touch .row{transform:scale(${settings.touchScale});transform-origin:bottom center}.touch{padding-left:${settings.touchInset}px!important;padding-right:${settings.touchInset}px!important}`;}
 apply();
})();
