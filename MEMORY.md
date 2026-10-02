# MEMORY.md - Cafferium Landing

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado Actual
- v7 funcionando: enlaces de WhatsApp, animaciones de scroll, i18n ES/EN, toggle de tema claro/oscuro.
- SEO técnico completo: canonical, JSON-LD con un nodo por sucursal, favicon, sitemap, robots.
- Imágenes: migradas a local el hero y las 4 de `#esencia`. Quedan 11 como hotlinks de Google a 512px.

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

## Próximos pasos
- Recibir las 4 tandas restantes y repetir el patrón (`srcset` + `sizes` + alt traducible).
