# MEMORY.md - Cafferium Landing

Memoria del proyecto entre sesiones. Este archivo es el **estado**, no el manual: las reglas
permanentes viven en `AGENTS.md`. Si algo se repite, va allí.

## Estado Actual
- v7 funcionando: enlaces de WhatsApp, animaciones de scroll, i18n ES/EN, toggle de tema claro/oscuro.
- SEO técnico completo: canonical, JSON-LD con un nodo por sucursal, favicon, sitemap, robots.
- Imágenes: migradas a local el hero y las 4 de `#esencia`. Quedan 11 como hotlinks de Google a 512px.
- Mosaico de `#esencia`: la caption ya no es una barra; en escritorio el texto va centrado sobre la
  foto. Sigue el patrón de `.branch-img-overlay`, que ya existía.
- **Modal del menú**: "Ver menú completo" ya no manda un WhatsApp, abre un modal con las 4 fotos
  del menú por pestañas (Desayunos / Comida y cena). Clona la estructura del drawer.
  `public/img/` ya traía esas 4 fotos **sin referenciar en ninguna parte**: se estaban publicando
  1.1 MB muertos en `dist/`.

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
- **Las fotos llegan en retrato y las cajas son apaisadas.** El recorte va en un
  `object-position` en línea, imagen por imagen. Porcentaje real de la foto que sobrevive:
  fachada 100%, café de olla 37%, interior 45%, terraza 23%.
- **La terraza se exporta PRE-RECORTADA a 3.2:1** en vez de usar `object-position`: descargar el
  retrato entero para pintar 1214×380 desperdiciaba el 77% de los píxeles (563 KB → 196 KB con el
  mismo resultado visual). Aplicar lo mismo a cualquier imagen con % visible muy bajo.
- **PESO:** los maestros originales están en `_originales/` (fuera del repo y fuera de `public/`).
  Se movieron porque Vite copia `public/` tal cual a `dist/`: dejarlos ahí publicaba **4.7 MB
  sin usar**, descargables por URL directa. El PNG del hero ya no existe.
  `public/img/` queda solo con las 11 variantes que el `srcset` usa: **1.5 MB.**
- Faltan 4 tandas: 6 de menú, 2 de sucursales, 2 de Instagram, 1 logo.
  Cuando lleguen, se repite el patrón y los maestros van a `_originales/`.

## Overlay del mosaico
Las **reglas de por qué** están en AGENTS.md invariante 9. Aquí solo los números y las
decisiones de una vez, que es lo que no se deduce del código.
- **Se aplica con `@media (min-width: 900px) and (hover: hover) and (pointer: fine)`.**
  Los dos últimos criterios son los que importan: un iPad en horizontal cumple el ancho pero no
  esos, así que conserva la caption de abajo. Sin ellos el overlay se activa en táctil y se pierde
  el texto. Verificado a 1024px con `hasTouch`: `pos=static`, caption intacta.
- Scrim en degradado, central 0.80 y bordes 0.50, en `::before`; la opacidad modula
  (0.825 reposo → 1 hover). Contraste medido del texto **6.14:1** en el peor caso (terraza);
  la etiqueta quedó en 6.23:1. Un scrim plano habría necesitado 0.62 para llegar a 4.5:1.
- **El texto principal es blanco en Playfair (`--font-serif`), la etiqueta en Cinzel
  (`--font-brand`), ambas centradas.** La etiqueta **también quedó en blanco**: `#00828a` daba
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

## Tareas pendientes
- **Añadir un CTA de WhatsApp al pie del modal del menú** si algún momento se decide: el botón
  "Ver menú completo" antes mandaba un WhatsApp prellenado y ahora solo consulta. Serían 12/12
  otra vez. Decidido posponerlo, no descartado.
- **Revisar el contraste de `--color-on-surface-muted` (`#6e797a`)**: da 4.49:1 en tema claro sobre
  blanco, justo por debajo de 4.5:1. Lo usan 10+ sitios, así que el arreglo es global y conviene
  como tarea propia, no deambulando en otro cambio.
- Recibir las 4 tandas de imágenes (6 menú, 2 sucursales, 2 Instagram, 1 logo) y repetirlas con
  `srcset` + `sizes` + alt traducible. El patrón está arriba y en AGENTS.md; los maestros a
  `_originales/`.
- **Variantes de 600px para las 4 fotos del menú**: opcional, ahorraría ~200 KB en móvil. Se
  decidió NO hacerlo porque son `loading="lazy"` y solo bajan al abrir el modal. Si algún día se
  hacen, mantener el patrón `srcset` del resto.
- Reemplazar las fotos de los platillos por productos reales.
- En el mapa de Google, cambiar el ícono por una versión editable del logo.
- El banner de la **sucursal Torre Central** dice "frente a la laguna" en el `alt` (línea ~1204) y
  en el texto de playa (línea ~1233), pero su foto es un hotlink de 512px y no se ha comprobado si
  la laguna aparece. **Pendiente de decidir** si se ajusta el texto o la foto. No confundir con la
  terraza del mosaico, que es otra imagen.
- Buscar una mejor foto para la terraza de `#esencia`.

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
