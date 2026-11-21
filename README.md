# Cabezones Colombia

## Probar en computador

1. Extrae el ZIP. La carpeta contiene index.html, clasico.html, libs, js, img y audio.
2. Sirve esa carpeta con un servidor estático. Con Python instalado, abre una terminal dentro de la carpeta y ejecuta `python -m http.server 8000`.
3. Abre http://localhost:8000. Para probar la PWA usa localhost o HTTPS.
4. El enlace «Versión clásica» abre la copia exacta del HTML anterior.

## Subir desde la web de GitHub

1. Abre tu repositorio cabezones en GitHub e inicia sesión.
2. Selecciona Add file → Upload files.
3. Arrastra **el contenido** de la carpeta extraída. index.html debe quedar en la raíz del repositorio, junto a las carpetas js, libs, img y audio. No subas solo el ZIP.
4. Pulsa Commit changes.
5. En Settings → Pages, selecciona Deploy from a branch, rama main y carpeta / (root). Guarda.
6. Espera a que termine la publicación en Actions. El enlace esperado es https://jacksonduvan2026.github.io/cabezones/.

## Android

Abre el enlace HTTPS en Chrome. Toca Jugar, gira el teléfono y comprueba movimiento y tiro simultáneos. Toca pausa y desplaza los ajustes. Puedes cambiar el tamaño y la separación lateral de los controles. Instala desde el menú del navegador. Tras la primera carga completa, cierra el juego, activa modo avión y vuelve a abrirlo.

## iPhone

Abre el enlace en Safari, toca Compartir → Añadir a pantalla de inicio y abre el icono. Gira el teléfono. El primer toque activa el audio. La pantalla completa simulada respeta las áreas seguras. La orientación, vibración y Wake Lock dependen del soporte del navegador. Comprueba pausa, deslizamiento de ajustes y dos dedos simultáneos.

## Actualizaciones

Mantén el mismo dominio y ruta para conservar los datos locales. Sustituye los archivos y cambia la constante CACHE de sw.js por un nombre nuevo en cada publicación. Cierra todas las ventanas del juego y vuelve a abrirlo para activar una actualización pendiente. La caché anterior se borra al activarse la nueva. La instalación de caché es completa antes de activarse. Las fotos y partidas se guardan en localStorage y no se envían a la red. La versión clásica comparte esos datos.

## Estructura y comportamiento

Los scripts ordenados comparten las variables del juego original. Los archivos de física, jugadores, habilidades, copa y bucle conservan las instrucciones anteriores. Phaser 3.90.0 presenta el canvas del motor mediante una textura y gestiona siete escenas visuales en archivos independientes. La interfaz y la entrada mantienen sus componentes DOM. No requiere compilación.

Los cuerpos usan un atlas PNG original con siete poses y cuatro fotogramas por pose. Los patrones de equipo y las fotos se componen encima. Se conserva la arquitectura de los estadios y se añade una capa de ciudad con movimiento suave. Los efectos existentes de red, humo y multitud continúan activos.

## Límites de esta entrega

El arte generado es sencillo, con variaciones pequeñas entre algunos fotogramas. Los estadios siguen usando gran parte del dibujo procedural existente. Conviene sustituir después el atlas de cuerpos y las capas de fondo por ilustraciones propias más detalladas. La hinchada y los instrumentos de la música son sintetizados y tienen menor realismo que una grabación. Los efectos se entregan en MP3 y OGG, y el reproductor usa MP3 por compatibilidad. Las pistas duran ocho segundos y se repiten.

La resolución está limitada y la calidad automática anterior continúa disponible. Los 60 FPS y las API móviles requieren verificación en teléfonos físicos. El entorno de pruebas de escritorio no certifica el rendimiento de un celular de gama media ni el permiso de pantalla completa nativa. El narrador requiere una voz española local instalada.

## Corrección de rutas y escala móvil

La publicación revisada tenía los archivos de las subcarpetas mezclados en la raíz. Para publicar esta carpeta, arrastra las carpetas completas `audio`, `css`, `img`, `js` y `libs` junto a los archivos de la raíz. Dentro del repositorio deben existir `js/carga.js`, `img/escudos/millonarios.webp` y `libs/phaser-3.90.0.min.js`. Respeta sus nombres exactos. Los archivos con sufijos como “(1)” no sustituyen la ruta original.

Después de subir la actualización y completar la publicación en Actions, cierra todas las pestañas del juego y la aplicación instalada y vuelve a abrirla. No borres los datos del sitio. La caché usa una versión nueva y toma el control al completar su descarga.

Abre `?debug=1` al final de la URL para ver el diagnóstico. El modo debe ser FIT, el zoom de cámara 1, y ambos canvas 1200 × 650. El tamaño CSS cambia con la ventana y el teléfono. En computador cambia el tamaño de ventana y prueba pausa, continuar y reiniciar. En celular prueba girar, iniciar un partido, pausar, continuar, reiniciar y esperar una repetición o efecto. Mueve las barras del navegador y comprueba que se siguen viendo ambos arcos. Para informar de un problema, envía una captura con el diagnóstico visible.

Los nombres exactos de las 17 imágenes se encuentran en `escudos.json`. Si falla una imagen, se mantiene el dibujo estilizado y se informa su URL exacta con `console.warn`. Las pruebas realizadas usaron Chrome de escritorio y emulación táctil con DPR 3, bajo la ruta `/cabezones/`. La validación física en Safari/iPhone y Android queda pendiente.

## Probar pitazos, ambiente y transiciones

1. En computador o celular, toca o pulsa una tecla para activar el audio. Empieza un partido y escucha los tonos 3-2-1, «¡Ya!» y el pitazo inicial. La narración entra después del silbato si hay una voz española local disponible. Tras un gol, escucha la reanudación corta. Al finalizar suenan tres silbidos. El juego conserva su estructura de períodos y usa el pitazo distinto al entrar al gol de oro. La tanda y cada penal usan señales cortas.
2. En ajustes activa la hinchada y baja la música para escuchar el bucle. Acerca el balón a un arco, remata al poste y marca. Compara un gol del local y otro del visitante. Con empate o diferencia de un gol, escucha los últimos diez segundos.
3. Navega por equipos, estadios, pausa y resultados. Escucha aceptar, volver y cambios de ajustes. Carga energía y activa las habilidades. Los sonidos no consumen energía ni modifican reglas.
4. Durante un fundido toca pausa o los controles. Deben responder de inmediato. Activa «Reducir movimiento» en los ajustes del dispositivo y comprueba que las transiciones usen opacidad sin desplazamiento.
5. Cambia los cinco volúmenes y Silenciar todo, recarga y comprueba que se conservan. Cambia de pestaña o bloquea el teléfono. El juego y el audio se pausan. Al regresar toca Continuar. Si el navegador vuelve a exigir un gesto, ese toque reactiva el contexto de audio. No es posible eludir los permisos de reproducción del navegador.

Los efectos pequeños se precargan y los bucles se cargan cuando se necesitan. El sistema selecciona OGG o MP3 y prueba el otro formato ante un fallo. La narración y los silbatos reducen suavemente música e hinchada. La lista de los 38 sonidos nuevos, sus tamaños y licencias está en `SONIDOS.md`. El peso añadido de audio es aproximadamente 446 KB.

## Celebraciones, caras y accesorios

En Personalizar, cada jugador puede elegir Aleatoria, brazos arriba corriendo, rodillas, baile, voltereta corta, avioncito, manos en la oreja o reverencia. Los accesorios se agrupan en cabeza (gorra, peluca, sombrero vueltiao, diadema o bandana tricolor), gafas, bigote y barba. Cada grupo permite Ninguno. Las preferencias se guardan por jugador en `cabezaEstadio.v6`; se migran automáticamente las versiones anteriores y se conservan sus claves.

Con una foto, comprueba que la imagen se mantiene sin cambios de expresión, deformación o accesorios. Los accesorios elegidos quedan guardados para cuando retires la foto. Sin foto, la cara puede mostrar neutralidad, esfuerzo, golpe, alegría, tristeza, enojo y sorpresa. Las celebraciones de cuerpo funcionan en ambos casos.

La pausa visual tras el gol dura 1,7 segundos en total, con el reloj detenido; es 0,4 segundos mayor que la pausa anterior. Pulsa Saltar festejo o Espacio para abreviarla. La repetición y el narrador conservan su flujo posterior. Los desplazamientos de la celebración son solo de dibujo, y evitan acercarse al balón o a los rivales. Reducir movimiento y la calidad reducida simplifican las animaciones. Hay animaciones de resultado y campeón en sus pantallas.

Los 32 equipos tienen un perfil editable en `perfiles-ia.json`: ofensivo, defensivo, equilibrado, físico, técnico o contraatacante. Sus decisiones se adaptan al marcador y se combinan con la dificultad existente. El modo clásico conserva la IA anterior. Las velocidades, hitboxes y el motor de física no se sustituyen. La presentación muestra el estilo rival.

Para probar, elige accesorios y celebración, juega y marca; repite con una foto. Comprueba la pausa y la tecla Espacio durante el festejo. En celular usa Saltar festejo y los mandos táctiles. Recarga para comprobar el guardado y compara rivales de estilos distintos en la misma dificultad.

## Cuerpo articulado, controles y pruebas

En **Personalizar**, elige uno de los ocho tonos de piel o utiliza el selector de color. La vista previa muestra el tono, el número y el uniforme. Prueba la cara original con accesorios y después una foto: el cuerpo se articula debajo de la foto estática.

En **Ajustes**, activa **Estilo y física clásicos** para comparar con la versión anterior del proyecto. Dentro del estilo clásico también se conserva la opción de física e IA históricas de aquella versión. Desactiva el nuevo interruptor para volver al cuerpo articulado. Los ajustes, las fotos y los accesorios se conservan en el mismo registro local y la copa usa su clave anterior.

**Computador.** Abre el sitio con `?hitbox=1` al final de la dirección. En práctica, corre, frena, salta y suelta un tiro cargado. Amarillo marca cabeza, azul torso, violeta piernas, naranja la pierna en remate, verde pies y blanco balón. Alterna el estilo durante la pausa. Prueba también un gol y observa la celebración elegida.

**Celular.** Abre el sitio en horizontal, selecciona práctica, mueve con un dedo y pulsa salto o tiro con el otro. Prueba un salto justo antes de aterrizar, gira el equipo para verificar la pausa y vuelve a horizontal. En Ajustes activa el contador FPS y prueba calidad automática o elige la calidad manualmente. En copa, camina con ambos compañeros hacia el mismo poste. Para probar la caché, visita el juego con conexión, espera a que termine de cargar, recárgalo una vez y vuelve a abrir la misma dirección sin conexión.

**Alcance.** Se conservan el radio de cabeza y el alcance nominal de tiro. El tiro normal admite un margen de salida de hasta 3 unidades del campo durante 100 ms después de estar al alcance. Los contactos pasivos siguen ahora las piezas de piernas y botines y pueden diferir localmente de los del cuerpo antiguo. La patada activa tiene una restitución mayor que el torso; el salto y tiro mantienen el buffer de 100 ms. No hay imágenes nuevas que descargar para el jugador. El arte es una ilustración 2D y el rendimiento real depende del dispositivo.

**GitHub Pages.** Extrae el ZIP y sube el contenido a la raíz de la rama que publica el juego, manteniendo las carpetas `js`, `css`, `audio`, `img` y `libs` junto a `index.html` y `sw.js`. El proyecto se prueba por HTTP/HTTPS; este `index.html` carga el proyecto modular publicado. El service worker instala la nueva caché antes de retirar la anterior.
