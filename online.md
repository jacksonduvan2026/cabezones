# Jugar en línea con un amigo

## Empezar

1. Publica el contenido de esta carpeta en GitHub Pages conservando las subcarpetas. Espera a que termine Actions y cierra las pestañas antiguas para actualizar la caché.
2. Abre Jugar en línea (1 vs 1). El anfitrión pulsa Crear partida. Puede escribir un código propio de cinco caracteres o dejarlo vacío para generarlo.
3. Comparte el código o usa Compartir link. Los códigos aceptan minúsculas y espacios y se normalizan. Se excluyen 0, O, 1, I y L. El código se reserva en el servicio público de señalización; no se sobrescribe una sala ocupada.
4. El invitado pulsa Unirse, o abre el enlace con `#sala=CODIGO`. El enlace conecta automáticamente.
5. Cada uno escoge su equipo y habilidad. Mi personalización abre las opciones propias de nombre, foto, accesorios y celebración. El anfitrión elige uno de los dos estadios y 30, 60 o 90 segundos.
6. Ambos pulsan Listo. Aparece la presentación con los escudos y el estadio, seguida de la cuenta regresiva normal.

Cada dispositivo usa sus controles J1 habituales para su propio jugador: en computador, el teclado configurado para J1; en celular, los botones táctiles. El anfitrión juega a la izquierda y el invitado a la derecha. El indicador de conexión recuerda el lado del invitado. La pausa, la vibración, las áreas seguras y la pantalla completa usan la adaptación móvil existente.

## Pausa y salida

La pausa de cualquiera de los dos detiene la simulación del anfitrión. La persona que pausó o el anfitrión puede continuar. Se muestra el nombre de quien pausó. Cambiar de pestaña o girar el celular puede activar la pausa existente y comunicarla al otro jugador.

Al perderse el canal, ambos conservan el estado en memoria y se ofrece Reintentar durante una ventana de 20 segundos. El anfitrión mantiene la sala y la simulación queda pausada. Si vuelve el mismo invitado a tiempo, recibe el estado conservado. La recuperación cubre un corte de conexión con las pestañas abiertas. Recargar o cerrar la pestaña del anfitrión destruye la simulación y requiere crear otra sala.

Los resultados incluyen Revancha, que necesita la aceptación de ambos, Cambiar equipos y Salir. Salir cierra el canal y avisa al amigo. No se habilita conexión en copa, torneo ni práctica.

## Red y coste

El sitio sigue siendo estático. PeerJS 1.5.5 se distribuye localmente. Solo al abrir o unirse a una sala se contacta con PeerJS Cloud para la señalización y con STUN para descubrir la ruta directa. La documentación de PeerJS describe su señalización pública gratuita en https://peerjs.com/client/faq . No hay cuentas del juego, chat, ranking ni servidor propio.

El modo en línea necesita internet. Los modos anteriores siguen disponibles sin conexión después de llenar la caché. El service worker guarda archivos del sitio, incluida la librería local, y deja pasar las solicitudes de otros orígenes. No intercepta WebSocket, WebRTC ni STUN y no guarda mensajes de partidas.

No hay TURN configurado. Algunas combinaciones de redes móviles, Wi-Fi restringidas y NAT simétricos pueden impedir la conexión directa. En ese caso prueba otra red. Para añadir un servicio TURN, edita `iceServers` en `js/red-config.js` con las URL y credenciales de tu proveedor. La disponibilidad o las cuotas de los servicios públicos dependen de sus operadores; el proyecto no contrata ningún servicio de pago.

## Sincronización y privacidad

El anfitrión ejecuta el duelo local con su bucle fijo original y recibe las acciones del invitado. Envía estados aproximadamente 30 veces por segundo. El invitado no ejecuta Physics.step: interpola los estados y usa una predicción visual ligera de su muñeco. Con ping alto se pueden notar correcciones. El indicador cambia de verde a amarillo o rojo según la latencia.

Los perfiles se validan y las fotos se reducen proporcionalmente a 128 px y se comprimen antes de enviarse por el canal de datos. No pasan por el servidor de señalización ni se escriben en el guardado del otro jugador. La foto se envía una vez por sesión, salvo que el usuario elija otra. Los estados del partido no contienen fotos. Los perfiles recibidos y su caché de imagen se eliminan al salir. Los ajustes propios de audio, narrador y calidad no se envían.

## Pruebas recomendadas en teléfonos

Prueba primero ambos dispositivos en la misma Wi-Fi y después uno con datos móviles. Comprueba crear, entrar por enlace, rechazar un tercero, cambiar de equipo, elegir habilidad, marcar, pausar desde cada lado, revancha y salida. Desactiva y reactiva brevemente la red del invitado con la pestaña abierta y usa Reintentar antes de 20 segundos. En iPhone puede ser necesario tocar Listo o Continuar para desbloquear audio o pantalla completa.

Las pruebas automatizadas del proyecto usan navegadores Chrome independientes y conexiones WebRTC reales a través de la señalización pública. La validación en teléfonos físicos y redes móviles distintas queda pendiente.

## Base exacta conservada

Esta integración parte del commit de57094b125b1644f150a0ee9079b46199ad74c9 aportado por el usuario. Se conservaron idénticos 177 de sus 180 archivos. Solo se modificaron js/carga.js, sw.js y CREDITS.md; los archivos de red y PeerJS se añadieron aparte.

El catálogo mantiene 67 piezas seleccionables: 19 sombreros, 9 cabellos, 9 gafas/ojos, 11 de vello facial, 7 pinturas, 6 de boca/nariz y 6 de cuello/cuerpo. Además se mantiene la barba clásica por compatibilidad con perfiles anteriores. Hay 33 celebraciones y la opción Aleatoria. Los ocho looks predefinidos y los tres espacios para looks de cada jugador pertenecen a la base y se conservan.

El perfil en línea incluye las selecciones actuales de todas las categorías, sus colores, el tono de piel y la celebración. Los looks guardados siguen siendo privados y locales. El renderizador de la base decide qué se muestra: con una foto, los accesorios de cara se omiten y los de cuello y cuerpo siguen visibles. Se sincroniza la celebración elegida por el anfitrión para que los sorteos de festejos coincidan entre ambos dispositivos.

Pruebas de esta integración: secuencia local de 1800 pasos idéntica a la base, 67 piezas y 33 celebraciones presentes, foto estática y cuerpo con foto verificados, perfiles completos enviados, controles de teclado/táctiles entre navegadores, goles, resultados, pausa compartida, reconexión, revancha y entrada por enlace. Sin errores de ejecución. Falta comprobar teléfonos físicos y redes móviles distintas.
