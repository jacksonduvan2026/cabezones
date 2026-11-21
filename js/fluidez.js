// Se interpola una copia de presentación. El motor solo lee los estados a 120 Hz.
const Fluidez = {
  anterior:new WeakMap(),
  camara:0,
  capturar(g){
    if(settings.estiloClasico||g.state!=='playing')return;
    for(const p of g.players)this.guardar(p);
    this.guardar(g.ball);
  },
  guardar(obj){
    let prev=this.anterior.get(obj);
    if(!prev){prev={};this.anterior.set(obj,prev)}
    for(const k of ['x','y','angle','walk','kick','squash'])prev[k]=obj[k];
  },
  muestra(obj,a){
    const prev=this.anterior.get(obj);
    if(!prev||Math.abs(prev.x-obj.x)>90||Math.abs(prev.y-obj.y)>90)return obj;
    const copy=Object.create(obj);
    for(const k of ['x','y','angle','walk','kick','squash']){
      if(Number.isFinite(prev[k])&&Number.isFinite(obj[k]))copy[k]=prev[k]+(obj[k]-prev[k])*a;
    }
    return copy;
  },
  aplicarCamara(c,g){
    const seguir=g.active&&g.state==='playing'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    const objetivo=seguir?clamp((600-g.ball.x)*.009,-4,4):0;
    this.camara+=(objetivo-this.camara)*.09;
    if(!seguir)this.camara=0;
    const shake=seguir||g.state==='goal'?Math.min(g.cameraShake,3):0;
    const movimiento=settings.shake&&!matchMedia('(prefers-reduced-motion: reduce)').matches?shake:0;
    c.translate(this.camara+Math.sin(g.demoTime*81)*movimiento,Math.sin(g.demoTime*73)*movimiento*.45);
  }
};
