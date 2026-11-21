(async function () {
 const files = ["libs/phaser-3.90.0.min.js", "js/pantallas.js", "js/configuracion.js", "js/audio.js", "js/habilidades.js", "js/entradas.js", "js/jugadores.js", "js/copa.js", "js/ia-equipo.js", "js/penales.js", "js/ia.js", "js/contacto.js", "js/fisica.js", "js/partido.js", "js/estadios.js", "js/renderizador.js", "js/interfaz.js", "js/equipos.js", "js/ambiente.js", "js/movil.js", "js/mejoras.js", "js/fluidez.js", "js/vestuario.js", "js/festejos.js", "js/vestidor.js", "js/cuerpo.js", "js/inicio.js", "js/scenes/carga.js", "js/scenes/menu.js", "js/scenes/seleccion.js", "js/scenes/partido.js", "js/scenes/pausa.js", "js/scenes/resultados.js", "js/scenes/copa.js", "js/presentacion.js", "js/sonido-archivos.js", "js/ajustes-tactiles.js", "js/escudos-estadios.js", "js/correcciones.js", "js/audio-eventos.js", "js/transiciones.js", "js/mezcla-ajustes.js", "js/personalizacion-visual.js", "js/accesorios-ui.js", "js/personalidades-ia.js", "js/red-config.js", "js/red-amigos.js", "js/red-sincronizacion.js", "js/red-interfaz.js", "js/revision-online.js"];
 try {
  for (let i=0;i<files.length;i++) {
   await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=files[i];script.onload=resolve;script.onerror=reject;document.body.append(script)});
   document.getElementById('progreso').value=(i+1)/files.length*100;
  }
  document.getElementById('carga').remove();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(registration=>{registration.update().catch(console.warn);return registration}).catch(console.warn);
 } catch (error) { document.getElementById('cargaMensaje').textContent='No se pudo completar la carga. Puedes abrir la versión clásica.';console.error(error); }
})();