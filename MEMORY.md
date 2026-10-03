# MEMORY.md - Cafferium Landing

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado Actual
- v7 funcionando: enlaces de WhatsApp, animaciones de scroll, i18n ES/EN, toggle de tema claro/oscuro.
- SEO técnico completo: canonical, JSON-LD con un nodo por sucursal, favicon, sitemap, robots.
- Imágenes: migradas a local el hero y las 4 de `#esencia`. Quedan 11 como hotlinks de Google a 512px.
- Mosaico de `#esencia`: la caption ya no es una barra; en escritorio el texto va centrado sobre la
  foto. Sigue el patrón de `.branch-img-overlay`, que ya existía.

## Imágenes locales (en curso)
- `public/img/` — patrón ya montado: variantes con `srcset` + `sizes`, `alt` traducible con
  `data-alt-es/en`, `loading="lazy"` y `decoding="async"` en todo menos el hero (LCP).
- **Las fotos llegan en retrato y las cajas son apaisadas.** El recorte va en un
  `object-position` en línea, imagen por imagen. Porcentaje real de la foto que sobrevive:
  fachada 100%, café de olla 37%, interior 45%, terraza 23%.
- **La terraza se exporta PRE-RECORTADA a 3.2:1** en vez de usar `object-position`: descargar el
  retrato entero para pintar 1214×380 desperdiciaba el 77% de los píxeles (563 KB → 196 KB con el
  mismo resultado visual). Aplicar lo mismo a cualquier imagen con % visible muy bajo.
- **PESO:** los maestros originales están en `_originales/` (fuera del repo y fuera de `public/`).
  Se movieron porque Vite copia `public/` tal cual a `dist/`: dejarlos ahí publicaba **4.7 MB
  sin usar** en producción, descargables por URL directa. El PNG del hero ya no existe.
  `public/img/` queda solo con las 11 variantes que el `srcset` usa realmente: **1.5 MB en total.**
- Faltan 4 tandas: 6 de menú, 2 de sucursales, 2 de Instagram, 1 logo.
  Cuando lleguen, se repite el patrón y se mueven los maestros a `_originales/`.

## Overlay del mosaico (decisiones y números)
- **El efecto solo se aplica con `@media (min-width: 900px) and (hover: hover) and (pointer: fine)`.**
  Los dos últimos criterios son los que importan: un iPad en horizontal cumple `min-width` pero no
  los otros, así que conserva la caption de abajo. Sin ellos el overlay se activates en táctil y se
  pierde el texto.
- **El scrim va en `.mosaic-caption::before` y se anima con `opacity`**, no con dos
  `background-image`. Los degradados no interpolan de forma fiable en CSS y el salto se notaba.
  Aquí el degradado está a intensidad máxima (0.80 en la banda central) y la opacidad modula:
  0.825 en reposo, 1 en hover.
- **Degradado y no plano porque el texto solo ocupa la banda central.** Oscurecer solo ahí deja las
  fotos mucho más vivas en los bordes y aun así el texto queda por encima de 6:1. Un scrim plano
  necesitó **0.62** para llegar a 4.5:1; el degradado llega a **6.14:1** con 0.66 en el centro y solo
  0.34 en los bordes.
- **El texto principal es blanco en Playfair (`--font-serif`), la etiqueta en Cinzel
  (`--font-brand`), ambas centradas.** La etiqueta **también es blanca, no turquesa**: medido sobre
  la foto oscurecida el `#00828a` da **1.35:1** y no se lee. Ningún teal llegaba a 4.5:1 (claro 3.62,
  oscuro 2.39) y la etiqueta son 12px, así que no le valía el umbral de texto grande. En móvil la
  caption conserva su turquesa original, porque el overlay no aplica ahí.
- Las tarjetas llevan `tabindex="0"` y el overlay responde a `:focus-visible`. Con el texto siempre
  visible el `tabindex` no es necesario para accesibilidad, pero da el mismo énfasis a quien
  navegue con teclado.
- **Las columnas del grid quedan exactamente igual de altas** (desajuste 0.0px de 900 a 1920). Se
  compensa subiendo el `aspect-ratio` de las apiladas de `16/9` a `27/16` en escritorio; la principal
  conserva `16/14`. Ese es el motivo de mover los `aspect-ratio` de estilos en línea a clases
  `.mosaic-card--main/--stack/--banner`.

## Tareas pendientes
- Terminar de migrar las 11 imágenes restantes a `public/img/`.
- Reemplazar las fotos de los platillos por productos reales.
- En el mapa de Google, cambiar el ícono por una versión editable del logo.
- El pie del banner de sucursal dice "frente al malecón y laguna" pero la foto ya no muestra la
  laguna. **Pendiente de decidir** si se ajusta el texto o la foto.
- Quedarán pendientes el reemplazar el resto de imágenes y buscar una mejor para la de la terraza en la section `#esencia`.

## Aprendizajes y errores a evitar
- **`naturalWidth` en Chromium devuelve el valor ajustado por densidad**, no los píxeles reales: con
  un `srcset` correcto siempre coincide con el ancho del viewport. Para saber qué variante se
  descarga usa **`currentSrc`** y compara **los bytes de la respuesta de red**.
- **`scrollWidth` no detecta un recorte de texto** cuando lo hace el padre con `overflow: hidden`.
  Mide con un clon sin restricciones de anchura.
- **Una miniatura pequeña engaña al ojo.** Dos veces leí un recorte o un texto "cortado" en una
  captura reducida que no lo estaba. Renderiza la comparación a tamaño grande antes de diagnosticar.
- **Al recortar a ojo falla el cálculo mental:** simulé `object-position` y leí mal el resultado.
  Genera una hoja comparativa con las posiciones candidatas y mírala grande antes de decidir.
- **Medir contraste sobre una foto exige dos capturas.** Si mides elBoundingBox del texto con la
  letra puesta, el píxel más claro que encuentras es **la propia letra blanca**, no el fondo, y el
  resultado da 1:1 y parece un bug. Correcto: captura la tarjeta con `visibility: hidden` en los
  hijos de la caption y usa esa captura como fondo puro.
- **Ojo al medir cuatro tarjetas: si salen valores idénticos, estás midiendo algo que novaries.**
  Cuatro fotos distintas no dan la misma luminancia. Era el `background-color` opaco de la regla
  base tapando la imagen; el degradado del scrim se dibujaba encima de un color de superficie.
- **Un pseudo-elemento nuevo hereda el `background` de la regla base.** Al pasar la caption a
  overlay hay que poner `background-color: transparent` explícito o tapa la foto entera.

## Próximos pasos
- Recibir las 4 tandas restantes y repetir el patrón (`srcset` + `sizes` + alt traducible).
