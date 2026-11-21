# Revisión del juego y guía de prueba

La carpeta parte del repositorio publicado, commit ae9b15be14c243b9e58cace3414ff7648bc6ad56, que ya incluye el modo en línea. La copia anterior se conserva. El archivo nuevo js/revision-online.js integra los ajustes con los módulos existentes.

## Habilidades

En js/red-interfaz.js, renderLobby declaraba una variable local llamada profiles que ocultaba los perfiles persistentes. Al cambiar la habilidad, el evento escribía en esa lista temporal. updateLocal volvía a leer el perfil persistente, por lo que enviaba la selección anterior. En el invitado, el índice cero de la lista temporal correspondía además al anfitrión.

Se renombró la lista de la sala, se escribe en el perfil propio y se espera la actualización antes de enviar el estado de la sala. La validación admite los identificadores y los nombres de habilidades, ignorando mayúsculas y tildes. El guardado se mantiene en cabezaEstadio.v6 con versión interna 9. Los campos previos de los perfiles se conservan.

En local no se reprodujo una pérdida del identificador en las pruebas. Sí faltaba una regla visual para skillcard.selected. Ahora se ve un borde verde, un fondo diferenciado y el estado accesible aria-pressed. El selector permanece editable hasta iniciar. La cuenta regresiva muestra los nombres de las habilidades de los jugadores y la presentación en línea también los incluye.

Con ?debug=1 se muestran, por jugador, el identificador elegido, el recibido por la simulación, la última habilidad activada y la escala. En red, la activación confirmada por el anfitrión se comunica al invitado.

| Habilidad | Duelo local | Amistoso CPU | Copa 2 humanos | En línea |
| --- | --- | --- | --- | --- |
| Tiro preciso | Pasa | Pasa | Pasa | Pasa |
| Tiro muy potente | Pasa | Pasa | Pasa | Pasa |
| Tiro con efecto | Pasa | Pasa | Pasa | Pasa |
| Globito | Pasa | Pasa | Pasa | Pasa |
| Misil rasante | Pasa | Pasa | Pasa | Pasa |
| Súper salto | Pasa | Pasa | Pasa | Pasa |
| Imán | Pasa | Pasa | Pasa | Pasa |
| Muro | Pasa | Pasa | Pasa | Pasa |
| Congelar rival | Pasa | Pasa | Pasa | Pasa |
| Cabezota gigante | Pasa | Pasa | Pasa | Pasa |
| Cámara lenta | Pasa | Pasa | Pasa | Pasa |

Las pruebas prepararon energía y proximidad suficientes para cada activación. En práctica se probaron también los efectos, añadiendo un rival únicamente al banco de pruebas para comprobar Congelar. El juego de práctica conserva su funcionamiento habitual.

La prueba de red conectó dos contextos independientes de Chrome mediante PeerJS real. El invitado envió el control de habilidad al anfitrión, que ejecutó cada habilidad y devolvió su confirmación. Se comprobó también la activación del anfitrión y la coincidencia de escala y radio base.

## Personalización

Se conserva el catálogo completo y los controles originales de fotos, ropa, piel y celebraciones. La interfaz coloca una vista previa a la izquierda y una zona de opciones con desplazamiento propio a la derecha. Las pestañas dan acceso a ropa, gorros, cabello, gafas, vello, pintura, boca, cuerpo, festejos y looks.

Las miniaturas permiten elegir una pieza. La paleta ofrece colores rápidos y restablecimiento. Las celebraciones conservan su vista previa animada. Cada jugador dispone de tres looks con nombre editable. Guardar confirma el conjunto actual. Deshacer recupera los cambios anteriores de la sesión. Volver solicita confirmación si hay cambios pendientes.

La foto mantiene la regla anterior de accesorios faciales. Los de cuerpo siguen visibles. En la sala, abrir la personalización quita el estado Listo y comunica que el jugador está editando. La partida espera a que ambos terminen y vuelvan a pulsar Listo.

## Tamaño y contacto

| Medida estándar | Antes | Ahora |
| --- | --- | --- |
| Escala del muñeco | 1 | 0,89 |
| Radio físico de cabeza | 36 | 32,04 |
| Centro físico sobre los pies | 99 | 88,11 |
| Radio visible de cabeza moderna | 31,5 | 28,035 |

Las cápsulas de cuerpo, piernas y pies se escalan en 0,89. Cabeza gigante conserva su multiplicador de 1,45. Se conserva la restitución del cabezazo en 0,87 y las velocidades, gravedad y potencia anteriores.

El centro de detección de tiro se ajusta de 65 a 57,85 unidades sobre los pies. Para compensar la reducción, se conserva la distancia máxima de activación anterior de tiros y habilidades mediante el radio anterior más su margen original. El contacto físico del balón usa las cápsulas reducidas. Esta compensación preserva la tolerancia de disparo, aunque el nuevo contacto geométrico requiere valoración jugando.

En Ajustes, Tamaño anterior del muñeco recupera la escala 1. Durante una partida en línea, el cambio se realiza antes de pulsar Listo. El tamaño viaja en el perfil y se aplica en ambos dispositivos. Las salas usan el prefijo de versión 2 para emparejar versiones compatibles. Ambos amigos deben cargar la actualización.

## Auditoría

Se corrigieron el perfil equivocado en la selección en línea, el envío sin esperar la actualización del perfil, la ausencia de resaltado local, la posibilidad de estar Listo mientras se edita el vestuario y la falta de habilidad visible en la presentación en línea. La caché incluye el módulo nuevo y tiene una versión propia.

Pasaron un partido completo contra CPU, el avance de siete partidos de copa con resultados preparados hasta campeón, el guardado de fotos y looks con nombre, las 300 trayectorias preparadas del balón y la presencia del módulo nuevo en la caché. Los resultados preparados de copa comprueban el avance y persistencia entre rondas.

Los archivos js/partido.js y js/scenes/partido.js cumplen funciones distintas, simulación y presentación Phaser. js/carga.js carga módulos, mientras js/scenes/carga.js define una escena. Las extensiones de audio, estadios y red envuelven funciones anteriores de forma deliberada. No se identificó un archivo completo que se pueda retirar con seguridad. Se conservaron todos.

Se conservaron reglas, modos, equipos, escudos, estadios, IA y recursos de sonido. Los cambios físicos se limitan al tamaño y a los ajustes de contacto solicitados. La interfaz reutiliza las funciones existentes de recorte, catálogo y selección. Los recursos visuales nuevos se dibujan con el código propio del proyecto.

## Cómo probar

1. Abre el juego actualizado en computador. Añade ?debug=1&hitbox=1 a la dirección. Elige una habilidad diferente, comprueba su borde verde, inicia el partido y compara los identificadores del diagnóstico.
2. En celular horizontal, cambia una habilidad por toque. En computador enfoca una tarjeta con Tab y actívala con Enter. Repite el cambio antes de iniciar.
3. Abre Personalizar. Cambia ropa, una pieza y su color. Prueba Deshacer, Guardar y Volver. Guarda un look, cambia su nombre y recarga. Comprueba que sigue disponible junto con la foto y los datos anteriores.
4. Compara el interruptor Tamaño anterior con el tamaño nuevo. Cabecea un balón que cae y remata a distintas distancias. Las zonas de hitbox deben seguir al muñeco.
5. Dos amigos con la actualización crean y se unen a una sala. Cada uno elige una habilidad distinta y verifica lo que ve el otro. Abre Mi personalización antes de Listo, cambia un accesorio y vuelve. Después jueguen y pausen.
6. Termina un partido, vuelve a la sala y juega una revancha. En copa, continúa un progreso guardado. Después de cargar completamente el juego, prueba los modos locales sin conexión.

Las pruebas automatizadas usaron Chrome de escritorio y emulación táctil. La conexión PeerJS se verificó entre dos sesiones en el mismo computador. Quedan por comprobar dispositivos físicos distintos, Safari/iOS, redes móviles diferentes y el rendimiento sostenido en celulares de gama media.

## Entrega y publicación

El ZIP contiene index.html en la raíz y el proyecto completo, sin la carpeta interna de Git. Extrae su contenido en una carpeta nueva. Para actualizar el repositorio existente, sube las carpetas js y css, sw.js y revision.md desde la raíz del repositorio. Los recursos anteriores ya están incluidos en el paquete para una instalación completa.

Después del despliegue de GitHub Pages, ambos jugadores deben cerrar las pestañas antiguas y abrir de nuevo la dirección. Esta entrega es una copia local lista para subir.

También pasaron las pruebas de toque en tarjetas, activación con Enter, selección de miniaturas, guardado y recarga sin conexión. La comprobación final de red terminó sin errores ni avisos de consola.
