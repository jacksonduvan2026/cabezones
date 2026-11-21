# Recursos y licencias

- `clasico.html` y lógica de `js/`: proyecto aportado por el usuario y sus modificaciones previas. Se conservan los derechos de su autor. Los escudos de clubes aportados por el usuario se documentan al final.
- `libs/phaser-3.90.0.min.js`: Phaser 3.90.0, Phaser Studio Inc., licencia MIT. Descarga de la distribución oficial del paquete Phaser en jsDelivr. https://github.com/phaserjs/phaser/tree/v3.90.0 . Texto completo en `libs/PHASER-LICENSE.txt`. La obligación de conservar el aviso MIT corresponde a la librería, no a los recursos artísticos.
- `img/cuerpos.png`: atlas original generado para este proyecto mediante dibujo de formas y siete poses, 2026. Dedicación CC0 1.0 de las aportaciones originales de esta entrega.
- `img/balon.png`, `img/ciudad.png`, `img/icon-192.png`, `img/icon-512.png`: dibujos originales generados para este proyecto, CC0 1.0.
- `audio/kick`, `head`, `post`, `net`, `whistle`, `goal`, `crowd`, `power`, `click`, `countdown` en MP3 y OGG: síntesis original de osciladores y ruido con semilla fija, CC0 1.0. No contienen muestras de terceros.
- `audio/menu` y `audio/partido` en MP3 y OGG: secuencias originales sintetizadas con percusión, bajo y melodía, CC0 1.0. No reproducen canciones comerciales. En esta entrega ambas pistas comparten la secuencia musical.
- Fuentes: tipografías de sistema del dispositivo, sin archivos redistribuidos.
- Fotos: aportadas por cada jugador, almacenadas solo en su navegador. Sus derechos pertenecen a sus titulares.

CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/ . Los nombres de los equipos se usan como datos de texto. No se incluyen escudos oficiales, patrocinadores ni grabaciones comerciales.

## Escudos de clubes aportados por el usuario

Las 17 imágenes de `img/escudos/` proceden de `escudos.zip`, aportado por el usuario. Los escudos pertenecen a sus respectivos clubes y se usan únicamente como ilustración, sin fines comerciales, en la interfaz del juego, sin incorporarse a los uniformes. No están cubiertos por la dedicación CC0 de los recursos originales del proyecto. Su inclusión no supone una licencia otorgada por los clubes. Las imágenes se han reducido a 128 × 128 px y comprimido en WebP, conservando el canal alfa existente. Se eliminó el fondo conectado a los bordes y se normalizó el contenido con un margen transparente. La variante PNG corregida de Nacional tiene prioridad sobre el JPG duplicado.

`escudos.json` relaciona los identificadores de los 32 equipos con rutas relativas o `null`. Para añadir o sustituir una imagen PNG, WebP o SVG, guárdala en `img/escudos/`, cambia la ruta de su equipo en el JSON y añade el recurso a `sw.js`, cambiando también CACHE. Los equipos sin archivo conservan el dibujo estilizado como respaldo.

## Actualización de escudos y estadios

Las imágenes corregidas y las nuevas imágenes de Cúcuta y Llaneros fueron aportadas por el usuario en su segundo ZIP. La limpieza de píxeles de fondo conectados a los bordes, el recorte del espacio vacío, la reducción proporcional y la compresión WebP se realizaron localmente. La función compartida `Clubs.badge` conserva el dibujo anterior cuando falta un archivo o no se puede cargar. Las miniaturas de estadio reutilizan el renderizador original del proyecto.

## Pitazos, hinchada, interfaz y mezcla

Los 38 sonidos añadidos en esta actualización son síntesis original creada mediante código para este proyecto, con semilla independiente y sin muestras de terceros. Se dedican a CC0 1.0. Los nombres, duraciones y pesos de ambos formatos se detallan individualmente en `SONIDOS.md`. Cada recurso se distribuye en MP3 y OGG, mono, a 22.050 Hz y 40 kbps nominales. El bucle de estadio usa componentes periódicos y fundidos de ganancia. Las voces de multitud, decepción y «uuuy» son aproximaciones sintéticas y son los recursos de menor realismo. Los recursos anteriores conservan sus créditos y licencias.

## Celebraciones, caras originales, accesorios y perfiles

Las animaciones corporales, expresiones y accesorios se dibujaron expresamente para este proyecto mediante Canvas 2D y código original, sin recursos gráficos de terceros. Estas aportaciones originales se dedican a CC0 1.0. Las fotos de los jugadores conservan los derechos de sus titulares y se muestran sin expresiones ni accesorios. `perfiles-ia.json` contiene asignaciones ficticias de estilo para variedad de juego, editables, y no pretende describir el rendimiento o estilo deportivo real de los clubes.

## Actualización del cuerpo y movimiento

Ilustración original por piezas para Canvas 2D en js/cuerpo.js: cuello, uniforme, brazos, manos, piernas, medias, botines y sombra. Poses y paleta de piel creadas para este proyecto. No se añadieron imágenes ni recursos de terceros. Los patrones, expresiones, accesorios y créditos previos pertenecen a la versión de partida.

## Vestidor y festejos

Las 67 opciones de vestuario, las poses de las 26 celebraciones nuevas, los gestos en pareja y los adornos de gol se dibujan mediante código Canvas 2D propio. Los trazos, coreografías y combinaciones originales de esta actualización se dedican a CC0 1.0. Las fotos permanecen en el navegador del jugador. Los accesorios de cuello y cuerpo se dibujan también al usar foto.

## Integración en línea sobre el commit de57094

PeerJS 1.5.5, PeerJS Contributors, licencia MIT. Distribución local en libs/peerjs-1.5.5.min.js y licencia completa en libs/peerjs-license.txt. Fuente https://github.com/peers/peerjs/tree/v1.5.5 . La señalización pública se proporciona mediante PeerJS Cloud; los servicios STUN se configuran en js/red-config.js. El arte del cuerpo, cuello, proporciones, vestuario, expresiones y festejos se conserva íntegramente del commit de57094b125b1644f150a0ee9079b46199ad74c9.

## Revisión de interfaz y tamaño

La nueva interfaz reutiliza las piezas Canvas originales para sus miniaturas. Se añadió código propio de distribución, selección, borradores y sincronización de perfiles. No se añadieron imágenes, fuentes ni sonidos de terceros. Las licencias de los recursos existentes se mantienen.
