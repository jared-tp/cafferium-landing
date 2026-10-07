?# MEMORY.md - Cafferium Landing

Memoria del proyecto entre sesiones. Este archivo es el **estado**, no el manual: las reglas
permanentes viven en `AGENTS.md`. Si algo se repite, va allí.

## Estado Actual
- v7 funcionando: enlaces de WhatsApp, animaciones de scroll, i18n ES/EN, toggle de tema claro/oscuro.
- SEO técnico completo: canonical, JSON-LD con un nodo por sucursal, favicon, sitemap, robots.
- **Imágenes: no queda ni una hotlink de Google.** Todo local, con `srcset` + `sizes` + `alt`
  traducible. Se hicieron por tandas: hero, 4 de `#esencia`, 6 del menú, 2 de sucursales, 2 de
  Instagram y el logo. `public/img` tiene 35 archivos.
- Mosaico de `#esencia`: la caption ya no es una barra; en escritorio el texto va centrado sobre la
  foto. Sigue el patrón de `.branch-img-overlay`, que ya existía.
- **Modal del menú**: "Ver menú completo" ya no manda un WhatsApp, abre un modal con las 4 fotos
  del menú por pestañas (Desayunos / Comida y cena). Clona la estructura del drawer.
  `public/img/` ya traía esas 4 fotos **sin referenciar en ninguna parte**: se estaban publicando
  1.1 MB muertos en `dist/`.
  El enlace de "tamaño real" **dice "Abrir en una pestaña nueva" / "Open in a new tab"**, no
  "Ver a tamaño real": lo cambió el usuario a mano, no yo. Si alguna vez documentamos este
  texto, es ese.
- **Menú de especialidad: 4 de las 6 tarjetas renombradas** siguiendo el recetario nuevo. Los
  precios de los cuatro platillos suben a $225 y el Italiano queda en $195. **Dirty Chai y Café de
  Olla no se tocaron**, como se pidió.
  | Antes | Ahora | ES / EN | Precio |
  |---|---|---|---|
  | Ensalada César con Pollo | Ensalada de pollo y pasta | Chicken & Pasta Salad | 130 → 225 |
  | Banquete Brunch Cafferium | Huevos Cafferium | Cafferium Eggs | 290 → 225 |
  | French Toast de Frutos Rojos | Pan francés frutos rojos | **Berry French Toast** (el EN no cambió) | 145 → 225 |
  | Grilled Cheese Gourmet | Italiano | **Italian** | 135 → 195 |
  - Los **4 mensajes de WhatsApp** se actualizaron al nombre nuevo: el cliente ya no pide un plato
    que no existe.
  - **Los cuerpos de las 4 tarjetas de plato son TEXTO DEL USUARIO.** Ya se probó una reescritura
    propia y la rechazó: **cuando el cliente da el texto, ese texto gana.**
    - **Motivo del copy largo:** los ingredientes YA están en la línea `.menu-card-spec` de arriba,
      así que el cuerpo describe textura y forma en vez de repetir la lista.
    - Lo único que se tocó fue una errata de concordancia en el de la Ensalada: "un cremoso aderezo
      coronada" → **"coronado"**. El inglés es traducción del texto español, no literal.
    - El Café de Olla **sí lleva reformulación**, pero corta y de las suyas: "receta de casa y
      tueste propio, preparado en barro sinaloense con canela en raja, piloncillo y anís estrella".
      Precedió a esto una versión larga que NO se usó.
  - Se quitaron las **etiquetas del footer de las 6 tarjetas** ("Saludable", "Más vendido",
    "Crujiente", "2-3 Personas", "Tueste Medio", "100% Orgánico"). Por eso `.menu-card-footer`
    pasó de `justify-content: space-between` a **`center`**: con un solo hijo el `space-between`
    lo dejaba pegado a la izquierda con ~140px de aire a la derecha.
  - Se quitaron las **píldoras NUEVO**: ya ninguna tarjeta las lleva, así que `.menu-card-tag` vuelve
    a quedar sin usarse. **No borrar el CSS**, la invariante 9 explica por qué `.gold` estaba roto.

## Menú: la carta actual
- **Café Latte $80** (antes Dirty Chai) · **Café de Olla $55** · **Pan francés $225** ·
  **Chilaquiles Desde $175** · **Ensalada de pollo y pasta $225** · **Omelette de claras $185**.
- Chilaquiles tiene **precio variable por topping**. Se muestra `Desde $175` con el "Desde" dentro del
  `<small>MXN</small>`: `.menu-card-price` tiene `white-space: nowrap`, no se puede partir, y pegado
  al precio el texto largo se comía el ancho del título.
- **Los 6 `alt` se reescribieron**: los anteriores describían platos que ya no estaban (Grilled
  Cheese bajo "Italiano", banquete bajo "Huevos Cafferium").

## Modal del menú (decisiones)
- Las reglas de foco, click fuera y `prefers-reduced-motion`: **AGENTS.md invariante 10.**
- El idioma de las fotos va con **`data-img-es` / `data-img-en`**, un par nuevo que applyLanguage()
  aplica como `src` en `<img>` y como `href` en `<a>`. Motivo: solo se descarga la del idioma
  activo. Medido: **303 KB** al cargar (una sola foto); la otra baja al abrir su pestaña.
- Las fotos son **A4 verticales de 1132×1600**. Ajustadas a la altura del panel el cuerpo del texto
  sale a ~11px: se lee, pero justo. De ahí el enlace **"Ver a tamaño real"** debajo, que abre el
  JPEG completo en pestaña nueva. Decisión consciousa: se descartó hacer zoom con scroll por
  añadir estado y comportamiento en móvil.
- **El CTA de WhatsApp se quitó de este botón** (12 → 11 enlaces `data-wa-*`). El modal es solo de
  consulta por ahora. Ver pendientes.
- La pestaña inactiva da **4.49:1** en tema claro, con `#6e797a` (`--color-on-surface-muted`), un
  token que usa el sitio entero en 10+ sitios. No se tocó: arreglarlo es otra tarea.

## Imágenes locales (en curso)
- `public/img/` — patrón ya montado: variantes con `srcset` + `sizes`, `alt` traducible con
  `data-alt-es/en`, `loading="lazy"` y `decoding="async"` en todo menos el hero (LCP).
- **PRE-RECORTAR al proporção de la CAJA, no usar `object-position` cuando la foto es muy vertical.**
  Todo llega en retrato y las cajas son apaisadas. Medido por sección:
    - **Menú, 4:3** (`.menu-card-img-wrap`): los maestros iban de 0.62 a 0.80, así que `cover` conservaba
      entre el **47% y el 60%** de su alto. Las 6 del menú quedan ya pre-recortadas a 4:3, con 400 y
      800 px. De 12.55 MB de PNG a 0.73 MB de JPEG.
    - **Mosaico**: el latte llega **pre-recortado** a 27:16; la fachada **no lleva recorte** (el
      maestro y la caja casi coinciden) y el interior sigue con `object-position` en línea
      (`50% 62%`, 45% visible).
    - **Terraza PRE-RECORTADA a 3.2:1**: descargar el retrato entero para pintar 1214×380 desperdiciaba
      el 77% de los píxeles (563 KB → 196 KB con el mismo resultado visual).
    - **Banner de sucursal, 2.69:1**: `.branch-img-header` es `height: 220px` fijo, así que la
      proporción de la caja **cambia con el viewport** (1.32 a 320px, 2.69 a 1280px, 3.19 a 768px).
      Se recorta a la del caso más común y se acepta que en móvil `cover` recorte más.
  - **La franja se elige MIRANDO, no calculando.** Se renderizaron hojas con 3 bandas por imagen
    (15% / 50% / 85% del recorrido) a tamaño grande y se compararon antes de recortar. En las cinco
    últimas ganó la del 50%, **pero en el Pan Francés fue un error**: la tostada se cortaba arriba.
    **El 50% no basta cuando el plato ocupa menos de la mitad de la foto.**
  - **El Pan Francés va en y=750, no al 50%.** Medido sobre el maestro: la tostada ocupa y≈843-1595 y
    el plato y≈866-1709, así que el centro del platillo es ~1287. La banda 4:3 mide 1066, y centrarla
    en el platillo da `y = 1287 - 533 = 754`. Con y=750 entra el plato entero y el centro del platillo
    coincide con el centro de la banda. Volver a mirarlo si se cambia esa foto.
  - Herramienta: `System.Drawing` desde PowerShell (ya está en Windows). Recorta y guarda JPEG q90
    sin añadir ninguna dependencia. Es lo que se usó para el menú, la terraza y los banners.
- **PESO:** los maestros originales están en `_originales/` (fuera del repo y fuera de `public/`).
  Se movieron porque Vite copia `public/` tal cual a `dist/`: dejarlos ahí publicaba **4.7 MB
  sin usar**, descargables por URL directa. El PNG del hero ya no existe.
  `public/img/` queda solo con las 11 variantes que el `srcset` usa: **1.5 MB.**
- **Ya no faltan tandas de imágenes.** Las 6 de menú, 2 de sucursales, 2 de Instagram y el logo
  entraronlocal en la misma tanda.
  Cuando lleguen, se repite el patrón y los maestros van a `_originales/`.

## El mosaico de #esencia ahora tiene 3 tarjetas
- **Fachada** (`mosaic-card--main`) · **Latte de la casa** · **Espacio climatizado**.
- **Se quitó la terraza**: no había foto que se viera bien en esa banda ancha. Sus imágenes NO se
  tocaron: `esencia-terraza-800/1536.jpg` las sigue usando el banner de Torre Central, y como son
  3.2:1 encajan mejor ahí que en el mosaico. `.mosaic-card--banner` y `.mosaic-banner` quedan en el
  CSS sin usarse; **no borrarlos** sin consultar.
- **La foto de la fachada se reemplazó DOS veces y ya no da más vueltas.** El letrero vigente es el de
  **"CAFETERÍA · PANADERÍA · ARTE"**, maestro `_originales/fachada-belisario.png` (1343x1171). Se
  comprobó con la imagen ampliada x5, no leyendo de memoria: ya se confundió una vez al revés.
  Los JPEG son `esencia-fachada-belisario-v2-700/1343.jpg` para el mosaico y
  `sucursal-centro-fachada-v2-652/1184.jpg` para el banner. **El "-v2" es deliberado**: la versión
  anterior tenía el letrero de CAFÉ, y al reutilizar nombres el navegador sacaba esa de caché.
  **Mosaico y banner salen del mismo maestro, así que no pueden verse distintos.**
  - **La foto NO lleva recorte, y no debe llevar ninguno.** El maestro es 1.1469 y la caja del
    mosaico `16/14` = 1.1429: encajan casi exactos y `cover` recorta un 0.18% por los lados. Se
    redimensiona la foto entera y ya. Una versión anterior del repo era un **recorte más cerrado**
    (unos 755x658 del maestro) que cortaba el letrero contra el borde y se comía el auto de la
    esquina; salía de pasar el recorte por un rectángulo de otra medida. **El defecto estaba en el
    archivo, no en el CSS**, así que medir solo en el navegador no lo detectaba: hay que comparar
    el archivo contra un resize completo del maestro.
  - **El letrero cae en el centro geométrico de la foto** (x 270-400; "CAFFERIUM" en y 304-337 y
    la sublínea en y 341-352, sobre 700x610), así que la caption centrada lo tapaba. Se movió
    abajo; ver la sección del overlay. Debajo del letrero quedan 245px limpios y el texto queda
    a **161px** de distancia de él.
  - El banner sí va pre-recortado, a **2.69:1 con y=336** (banda de 499px). Ese y sale de un mapa
    de líneas sobre el maestro. El título del banner ocupa y 165-200 de 220, así que el letrero
    tiene que caber por encima de ~y 160.
- **La tarjeta del Café de Olla pasó a ser "Latte de la casa"**, con la etiqueta "Café de especialidad"
  que ya estaba. La foto es un latte con rosetta en taza negra, pre-recortada a **27:16 con y=464**
  para que la taza y el plato salgan enteros (el maestro era vertical 848x1264 y `cover` conservaba
  solo el 40% de su alto). El `object-position` en línea desapareció por eso. Sus variantes son de 500
  y 848 px, y el maestro es de 848: en retina se verá algo más suave que el resto.
- `esencia-cafe-olla-500/1365.jpg` se **borraron**: quedaron huérfanas al salir del mosaico. La
  tarjeta de menú del Café de Olla usa otras (`cafe-de-olla-400/800.jpg`), que siguen vivas.
- Medido: main y stack miden **612px los dos, bottoms a 1100 → 0.0px de desajuste**. Ojo al
  comprobarlo por filas: las dos tarjetas apiladas están en filas distintas del grid, así que
  comparar sus bottoms da un falso positivo.

## Overlay del mosaico
Las **reglas de por qué** están en AGENTS.md invariante 9. Aquí solo los números y las
decisiones de una vez, que es lo que no se deduce del código.
- **Se aplica con `@media (min-width: 900px) and (hover: hover) and (pointer: fine)`.**
  Los dos últimos criterios son los que importan: un iPad en horizontal cumple el ancho pero no
  esos, así que conserva la caption de abajo. Sin ellos el overlay se activa en táctil y se pierde
  el texto. Verificado a 1024px con `hasTouch`: `pos=static`, caption intacta.
- **El texto va ABAJO, no centrado.** No es aesthetic: en la tarjeta de la fachada el letrero de
  CAFFERIUM cae en el centro geométrico de la foto, así que centrado la etiqueta le pisaba el
  nombre. Es el mismo patrón de `.branch-img-overlay`. Abajo hay 245px libres bajo el letrero y
  el texto queda a 170px de distancia de él. Centrado solo se vería bien con otro encuadre, y el
  único recorte posible (900x741 desde y=430) se come el arco y media fachada: no compensa.
- Scrim en degradado **bajo**, en `::before`: 0 hasta arriba, 0.26 al 40%, 0.64 al 68% y 0.88 al
  pie; la opacidad modula (0.825 reposo → 1 hover). Contraste medido píxel a píxel con las dos
  capturas (texto visible / texto en `visibility: hidden` como fondo puro): mosaico **7.15:1** el
  título y 8.28:1 la etiqueta.
- **El texto principal es blanco en Playfair (`--font-serif`), la etiqueta en Cinzel
  (`--font-brand`), centradas en horizontal y alineadas al pie.** La etiqueta **también quedó en
  blanco**: `#00828a` daba
  1.35:1, y ningún teal llegaba a 4.5:1 (claro 3.62, oscuro 2.39). En móvil conserva su turquesa,
  porque el overlay no aplica ahí. **No lo "corrijas" sin medir.**
- Las tarjetas llevan `tabindex="0"` y el overlay responde a `:focus-visible`. Con el texto siempre
  visible el `tabindex` no es necesario para accesibilidad, pero da el mismo énfasis a quien
  navegue con teclado.
- **Las columnas del grid quedan exactamente igual de altas** (desajuste 0.0px de 900 a 1920). Se
  compensa subiendo el `aspect-ratio` de las apiladas de `16/9` a `27/16` en escritorio; la principal
  conserva `16/14`. Ese es el motivo de mover los `aspect-ratio` de estilos en línea a clases
  `.mosaic-card--main/--stack/--banner`.
- De paso se corrigieron dos desincronizaciones i18n en la terraza: `data-es` decía "malecóncito"
  y el `alt` no coincidía con su `data-alt-es`. Ambas habrían salido alteradas al cambiar de idioma
  y volver. **Al editar copy revisa que `textContent` coincida con su `data-es`.**

## Sucursales (información del cliente)
- **Los DOS números son a propósito, no es una errata.** WhatsApp es **669 159 1505** y el de
  llamadas es **669 105 4810**. Los `tel:` usan el segundo y casi todos los `wa.me` el primero.
  No los "normalices".
- Horario **único para las dos**: Martes a Domingo 8:00 AM – 10:00 PM, Lunes cerrado. Se cambió en
  las 2 tarjetas **y en el footer**, que tenía su propia copia con elVie-Dom hasta las 11 PM. Si
  vuelve a cambiar el horario, hay que tocar los tres sitios.
- Descripciones: Centro Histórico habla de la **fachada** turquesa con rejas (`storefront`); Torre
  Central de la terraza con mesas y vista al estadio (`deck`).
  **La foto del banner de Centro es el INTERIOR (barra, reloj, pizarra) y no encaja con esa
  descripción.** Se comprobó y el usuario decidió dejarla así: es probable que la imagen vuelva a
  cambiar. **No lo "arregles" por tu cuenta.** Antes también se ofrecían café en grano, biblioteca,
  barra express y estacionamiento, y eso ya no está en ninguna parte.
- Se quitó el botón de WhatsApp de las tarjetas: quedan Maps (con `place`) y Llamar. `data-wa-*`
  bajó de 11 a 9.

## Fotos de las sucursales (banner)
- Centro Histórico: `sucursal-centro-fachada-v2-652.jpg` y `-1184.jpg`. **Pre-recortada a 2.69:1**,
  que es la proporción real de la caja en escritorio (`.branch-img-header` es `height: 220px` fijo
  a todo el ancho con `object-fit: cover`). El maestro es `_originales/fachada-belisario.png`, el
  mismo del mosaico, así que **el banner y el mosaico nunca deben verse distintos**.
  - La franja es **y=336** (banda de 499px), elegida con un mapa de líneas sobre el maestro, no
    de memoria. El título del banner ocupa y 165-200 de 220: el letrero tiene que caber por encima.
  - **Aviso:** el maestro es de 1343px de ancho, así que la variante de 1184 sale de la original
    sin escalar (bien), pero la de 652 es la que se descarga en móvil.
- Torre Central: **reutiliza `esencia-terraza-800/1536.jpg`**, y como la terraza ya no está en
  `#esencia` ya no se repite: esa foto vive solo aquí, que es donde mejor encaja por su proporción.
- **Centro Histórico ahora usa la FACHADA, no el interior.** El banner se pasó a un recorte a
  2.69:1 y **y=336** de la misma foto de la fachada. **Esto resolvió el desajuste que llevaba
  abierto**: la descripción ("fachada colonial azul turquesa con rejas de hierro forjado, plantas
  tropicales") por fin coincide con la imagen.
- **El scrim de `.branch-img-overlay` estaba corto de contraste y NO lo sabíamos.** Con solo
  `transparent 40%` → `0.8` al pie, medido píxel a píxel, daba **4.42:1** en Centro Histórico y
  **4.00:1** en Torre Central: los dos por debajo de 4.5. Los dos títulos ocupan la misma franja
  (y 165-200 de 220) y ahí el degradado solo llegaba a ~0.49 de opacidad, sobre pared turquesa que
  es un píxel muy claro. Añadido un tope intermedio de 0.58 al 62%: **7.83:1** y **7.26:1**. No
  hace falta oscurecer más el resto, que sigue viéndose igual de viva.
  **Lo más incómodo es que el fallo venía de antes y ninguna revisión lo había medido.**
- Ambas son locales ahora, con `srcset` + `sizes="(min-width: 900px) 594px, 100vw"`. Antes eran
  **capturas de Google Maps** de 600x220 y sus `alt` describían una "ubicación y fachada" que no
  se veía.

## Galería de Instagram y logo (locales)

- **Las dos fotos de la galería ya son locales**: `instagram-noche-320/640.jpg` e
  `instagram-escultura-320/640.jpg`, a **4:5 exacto** (320x400 y 640x800) para que case con la caja
  `aspect-ratio: 4/5` sin que `cover` recorte nada. Maestros: `cafferium-instagram-1.jpg` y `-2.jpg`.
  - `noche` es 1440x1800, ya era 4:5, así que va **entera, sin recorte**.
  - `escultura` era **3:4** (1536x2048). A 4:5 pide alto 1920, sobran 128px. Con un mapa de líneas
    el sujeto (cabeza y~370 a pedestal y~1750) tiene centro en ~1060, así que **`y0 = 1060 − 960 =
    100`**. Centrar a lo bruto (64) habría dejado más techo vacío arriba del sujeto.
  - **El `sizes` sale de medir el ancho real de la tarjeta**, no de suponerlo: 105px a 320 de
    viewport, 133 a 375, 179 a 480, 319 a 760, 377 a 899; y en la banda de escritorio el contenedor
    crece de 233px a 900 hasta 359px y ahí se queda. **Cruza los 320px en ~797 y otra vez en ~1170**,
    y esos dos cruces son los cortes del `sizes`, porque son justo donde "320 basta" deja de ser
    cierto. Medido en 13 anchos, cero elecciones erróneas: en móvil baja la de 320 (45 KB) en vez de
    la de 640 (148 KB).
  - **Se quitó el overlay.** Los dos `<div class="insta-photo-overlay">` tenían el `<span>`
    comentado, así que oscurecían la mitad inferior de cada foto sin texto encima. Se fueron los div
    y **la regla `.insta-photo-overlay`**, ya sin uso.
- **El logo (`logo-sello-80.png` y `logo-sello-96.png`) sustituye al hotlink del sello en los TRES
  sitios**: header, drawer y footer. Va en `srcset` con `sizes` de 44px, salvo el header, que son
  38px por debajo de 1000px (`.nav-container .brand-logo-img`). Con DPR 1 baja el de 80 y con DPR 2
  el de 96, comprobado.
  - **El usuario eligió el sello COMPLETO de Poseidón**, aunque medido a 38–44px la cara es una
    mancha y el invariante 7 dice que de 16 a 48px va la corona. Es decisión de marca suya. La
    variante de corona (`logo-laurel-*`) quedó generada y **sin usar**, por si se cambia de opinión.
  - El sello sale del maestro `cafferium-logo.jpg` (756x756, **JPEG con fondo blanco**) desmarcando
    el alfa contra el blanco. Es lo que arregla el círculo blanco del header oscuro.

## Tareas pendientes
- **Añadir un CTA de WhatsApp al pie del modal del menú** si algún momento se decide: el botón
  "Ver menú completo" antes mandaba un WhatsApp prellenado y ahora solo consulta. Serían 12/12
  otra vez. Decidido posponerlo, no descartado.
- **Revisar el contraste de `--color-on-surface-muted` (`#6e797a`)**: da 4.49:1 en tema claro sobre
  blanco, justo por debajo de 4.5:1. Lo usan 10+ sitios, así que el arreglo es global y conviene
  como tarea propia, no deambulando en otro cambio.
- Faltan 4 tandas de imágenes → **hecho**. Queda como aprendizaje: **para sacar transparencia de un
  JPEG hay que desmezclar contra el blanco, no recortar por umbral.** Se calcula el alfa que minimiza
  |p − (a·tinta + (1−a)·255)| por canal. Y hace falta además una **puerta de color**: el turquesa de
  la corona tiene `g − r = 96` y el taupe del rostro `g − r = 0`, así que `g − r ≤ 45` descarta el
  píxel sin mirar el residuo. Sin esa puerta el halo del JPEG alrededor del rostro se colaba como
  turquesa de alfa baja y dejaba un fantasma en el centro de la corona; se detectó midiendo el alfa
  acumulada dentro del círculo (0 = limpio). El maestro `cafferium-logo.jpg` es JPEG con fondo blanco,
  así que usarlo tal cual habría dado **un círculo blanco** en el header oscuro, que es justo lo que
  pasaba con el PNG de Google.
- **Variantes de 600px para las 4 fotos del menú**: opcional, ahorraría ~200 KB en móvil. Se
  decidió NO hacerlo porque son `loading="lazy"` y solo bajan al abrir el modal. Si algún día se
  hacen, mantener el patrón `srcset` del resto.
- Reemplazar las fotos de los platillos por productos reales.
- En el mapa de Google, cambiar el ícono por una versión editable del logo.
- El banner de la **sucursal Torre Central** decía "frente a la laguna" en el `alt` y en el texto
  de playa; el copy se reemplazó por el del cliente ("terraza con mesas de madera frente a la
  laguna, sombrillas turquesa y vista al estadio"). Sigue sin comprobarse si la foto —que es la
  terraza de `#esencia`— muestra la laguna.
- **Confirmar cuál fachada es la buena**: resuelto. El maestro vigente es
  `_originales/fachada-belisario.png` y su letrero dice "ARTE".
- **El maestro del latte de `#esencia` son 848px** y la caja pide ~1000 en retina: se verá más suave
  que el resto en pantallas de alta densidad. Reexportar a 1200px lo arreglaría.
- **Reexportar a ≥1200px** el original de la fachada si se quiere nitidez en retina: el maestro es
  1343px, así que la variante de 1184 va algo escalada.

## Aprendizajes (los de imagen; el resto está en AGENTS.md)
- **`naturalWidth` en Chromium devuelve el valor ajustado por densidad**, no los píxeles reales: con
  un `srcset` correcto siempre coincide con el ancho del viewport. Para saber qué variante se
  descarga usa **`currentSrc`** y compara **los bytes de la respuesta de red**.
- **`scrollWidth` no detecta un recorte de texto** cuando lo hace el padre con `overflow: hidden`.
  Mide con un clon sin restricciones de anchura.
- **Una miniatura pequeña engaña al ojo.** Dos veces leí un recorte o un texto "cortado" en una
  captura reducida que no lo estaba. Renderiza la comparación a tamaño grande antes de diagnosticar.
- **Al recortar a ojo falla el cálculo mental:** simulé `object-position` y leí mal el resultado.
  Genera una hoja comparativa con las posiciones candidatas y mírala grande antes de decidir.
- Contraste sobre foto, `background` opaco y degradados que no interpolan: **AGENTS.md invariante 9.**
  Este archivo es el estado del proyecto, no el manual: lo que sea regla permanente va a AGENTS.md.
- **Una clase CSS sin usar esconde bugs que nadie ha visto.** `.menu-card-tag.gold` existía desde
  hacía tiempo y estaba bien escrita, pero `--color-secondary-container` en tema oscuro es
  `#483800` y se empareja con un texto `#241a00`: **1.51:1**, ilegible. Al empezar a usarla saltó
  el fallo. Con `--color-secondary-gold` (brillante en ambos temas) quedó en 8.17:1 claro y 10.31:1
  oscuro. **Antes de confiar en un par de tokens, compruébalo en los DOS temas.**
- **Con `--card-tag-bg` y similares: un token puede ser transparente.** `.menu-card-tag` usa
  `rgba(255,255,255,0.92)`, así que el contraste real depende de lo que haya detrás (la foto).
  Para texto sobre foto, el CSS no basta: hay que medir píxeles (invariante 9).
- **Que el copy sea "mejorable" es opinión, y el cliente manda.** Escribí una versión más sobria de
  los cuerpos de las tarjetas y el usuario la rechazó y puso la suya, que es más larga y más
  "de carta". La buena práctica aquí es **no mantener la versión propia por defecto**: cuando el
  cliente da texto, ese texto gana. Revertí lo de las bebidas a lo que había.
- **Cuando conviertes una foto para un banner, recorta a la proporción de la CAJA, no a la de la
  foto.** `.branch-img-header` es `height: 220px` fijo, así que la proporción de la caja cambia con
  el viewport: 1.32 a 320px, 2.69 a 1280px y 3.19 a 768px. Recorta a la del caso más común
  (escritorio) y acepta que en móvil `cover` recorte más. Igual que se hizo con la terraza.
- **`npm` NUNCA en la raíz del proyecto.** Al borrar el directorio temporal y no volver a crearlo
  antes de `npm init`, el install corrió en el repo y metió `playwright-core` y 5 paquetes más como
  dependencias de runtime en `package.json`. Se revirtió con `git checkout`, pero es exactamente
  el fallo de "Lo que salió mal aquí". Crea SIEMPRE el temporal y verifica con `git status` que
  `package.json` no se movió antes de instalar nada.
- **Comparar 3 bandas no basta si el sujeto está descentrado.** Con el Pan Francés las tres bandas
  (15/50/85%) parecían razonables y aun así el 50% cortaba la tostada: el plato ocupa solo el 35%
  central de la foto. Cuando el sujeto no está centrado, **mide dónde está con un mapa de líneas
  sobre la foto completa** y de ahí saca el `y` que lo centra en la banda. La cuenta es
  `y = centro_del_platillo - alto_de_la_banda / 2`.
- **NUNCA sobreescribir una foto con el mismo nombre de archivo.** La URL no cambia, así que el
  navegador la saca de caché y quien ya visitó la página sigue viendo la vieja. Pasó con la fachada
  de `#esencia`: el archivo en disco era el nuevo (verificado byte a byte) y el usuario siguió
  viendo el letrero con el error. **Cuando cambie una foto, cámbiale también el nombre.**
- **Al generar variantes, recorta a tamaño COMPLETO y luego redimensiona; nunca dibujes una franja
  de una medida dentro de un destino de otra.** Para la variante de 500px del latte se recortaba
  848×296 y se aplastaba a 500×296: escala 0.59 en horizontal y 1.0 en vertical. La taza salía
  estirada y sin plato, y como `sizes` pedía 500px en escritorio, **el navegador cargaba justo la
  variante deformada**. **Verifica la proporción de cada archivo generado contra la del destino.**
- **Un archivo mal recortado no se arregla desde el CSS.** Con `object-fit: cover` el navegador
  nunca deforma: si algo se ve cortado, la culpa es del archivo, y cambiar la caja no lo arregla.
  La prueba: **genera un resize completo del maestro y compáralo con el archivo publicado**. Si
  difieren, el publicado tiene un recorte horneado. Pasó con la fachada del mosaico: un recorte
  de ~755x658 sobre un maestro de 1343x1171 hacía desaparecer el letrero y el auto, y el CSS
  estaba impecable.
- **El texto del overlay compite con lo que la foto enseña.** Una tarjeta puede tener la foto
  perfecta y aun así no cumplir su función si el rótulo de la foto queda debajo del texto. Antes
  de aceptar un overlay, **mide dónde está el elemento que la foto existe para mostrar** (con un
  mapa de líneas) y comprueba que no cae bajo la caja del texto.
- **Antes de reportar una "discrepancia" de datos, pregunta: puede que sea intencional.** Señalé
  que había dos números de teléfono distintos como si fuera un bug, y no lo era: uno es de
  WhatsApp y el otro solo de llamadas. Preguntar costó una pregunta y evitó "arreglar" algo
  correcto. Lo que sí era bug salió **precisamente por** preguntar: el botón de WhatsApp del drawer
  (`index.html:395`) y el del `site.webmanifest` apuntan al número de llamadas. El usuario lo
  cambia por su cuenta.
- **Un icono de Material Symbols inexistente se pinta como su PALABRA**, no como un cuadro
  vacío, así que en el HTML se ve bien. Se detecta midiendo el ancho: 18px = icono, cientos de px
  = texto. El método, con su control, está en **AGENTS.md invariante 11**.
- **Una captura en blanco no es un bug: es el reveal sin disparar.** Las `.menu-card` arrancan en
  `opacity: 0` y solo se revelan al entrar en pantalla. Si haces `screenshot()` de una tarjeta sin
  hacer scroll hasta ella primero, sale vacía. Haz `scrollIntoViewIfNeeded()` sobre la TARJETA
  concreta y espera ~1.6s. Pasa igual con las del mosaico (y su `translateY(32px)` inicial).

