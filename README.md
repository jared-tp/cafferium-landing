# Cafferium Landing Page | Mazatlán

Landing page para la cafetería **Cafferium** — café de especialidad, panadería de masa madre y espacio cultural en Mazatlán, Sinaloa.

Sitio estático de una sola página, construido con **Vite + JavaScript vanilla + CSS puro** (sin framework en runtime).

---

## Comandos

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:3000 (se abre solo)
npm run build     # genera dist/
npm run preview   # sirve dist/ localmente
```

---

## Estructura

```
index.html            Markup completo de la landing (una sola página)
src/style.css         Design system + todos los estilos
src/main.js           Lógica de cliente (i18n, filtros, drawer, scrollspy, reveal, tema)
public/               Assets estáticos copiados tal cual a dist/
```

### `public/`

| Archivo | Propósito |
|---|---|
| `favicon.svg` | Favicon vectorial (copa + vapor, turquesa/oro) |
| `icon-192.png` / `icon-512.png` | Iconos PWA con esquinas redondeadas |
| `icon-512-maskable.png` | Icono PWA *maskable* (zona segura adaptada) |
| `apple-touch-icon.png` | Icono iOS 180×180 a sangre completa |
| `og-image.jpg` | Imagen Open Graph 1200×630 (≈126 KB) |
| `site.webmanifest` | Manifiesto PWA |
| `robots.txt` | Reglas de rastreo + referencia al sitemap |
| `sitemap.xml` | Sitemap para la única URL del sitio |

---

## SEO técnico

El sitio está preparado para **SEO local** de un negocio con dos sucursales.

- **Canonical, robots y señales geográficas** en el `<head>` (`index.html`)
- **Open Graph y Twitter Card** completos, apuntando a `og-image.jpg` servido localmente (no a un hotlink que pueda caducar)
- **Datos estructurados JSON-LD** (`@graph` con 4 nodos):
  - `WebSite`
  - `Organization` (marca, logo, `sameAs`, `aggregateRating`)
  - `CafeOrCoffeeShop` × 2 — un nodo por sucursal, siguiendo la recomendación de Google para negocios multi-sucursal. Incluye dirección postal, `geo`, `hasMap` y `openingHoursSpecification`
- **`theme-color`** sensible a `prefers-color-scheme`
- **`lang="es-MX"`** para segmentación regional

> **Dominio de producción asumido: `https://cafferium.com.mx`**
> Aparece en el `canonical`, `sitemap.xml`, `robots.txt`, `og:url` y todas las URLs absolutas del JSON-LD.
> Si el dominio real es otro, busca y reemplaza `cafferium.com.mx` en `index.html`, `public/robots.txt` y `public/sitemap.xml`.

### Cosas pendientes de confirmar

- **Coordenadas geográficas**: `23.2494, -106.4111` (Centro Histórico) y `23.2451, -106.4140` (Torre Central) son aproximadas. Conviene verificarlas con las fichas de Google Maps de cada sucursal.
- **`aggregateRating`**: refleja las 4.7★ / 669 reseñas reales de Google. Google **no** otorga rich result a reseñas propias alojadas fuera de Google, así que el nodo no se usa para rich snippets; los datos sí son ciertos y los consumen otros buscadores. Si prefieres un cumplimiento estricto, elimina el bloque `aggregateRating` del nodo `Organization`.
- **Enlaces sociales del footer**: el footer apunta a `instagram.com/cafferium` y `facebook.com/cafferium`, mientras que el banner de Instagram usa `instagram.com/cafferium.mx`. El JSON-LD solo declara el de `cafferium.mx`. Hay que unificar y confirmar que el de Facebook exista realmente.

---

## Idiomas (ES / EN)

La landing se puede leer en español o inglés. El control está en el header
(pastilla `ES | EN` junto al toggle de tema) y también en el drawer móvil,
donde aparece con la etiqueta "Idioma".

**Preferencia inicial:** manda lo guardado en `localStorage`
(`cafferium-lang`); si no hay, se deduce de `navigator.language` — los
navegadores `es*` caen a español y cualquier otro a inglés.

### Cómo funcionan las traducciones

Cada traducción vive **junto al original en el markup**, con atributos `data-*`:

| Atributo | Se aplica a | Nº de pares |
|---|---|---|
| `data-es` / `data-en` | texto visible (`<h1>`, `<p>`, `<span>`…) | 119 |
| `data-alt-es` / `data-alt-en` | `alt` de las imágenes | 16 |
| `data-aria-es` / `data-aria-en` | `aria-label` (nav, drawer, botón flotante) | 7 |
| `data-wa-es` / `data-wa-en` | mensajes prellenados de WhatsApp | 9 |

Además se actualizan `<title>` y la `meta description` desde `I18N` en `main.js`.

**Regla importante:** sólo se marca un elemento si es una *hoja* (no tiene
hijos). `applyLanguage()` usa `textContent`, así que marcar un elemento con
`<strong>` o un `<span class="material-symbols-outlined">` dentro destruiría ese
contenido. Cuando hay texto mixto, se marca el hijo de texto y se deja el resto
intacto. El guard `if (el.children.length > 0) continue;` protege frente a
errores, pero lo correcto es no marcar esos elementos.

### Por qué no hay parpadeo

1. El script inline del `<head>` (el mismo que ya existía para el tema) resuelve
   el idioma **antes del primer pintado**, así que la primera pintada ya sale en
   el idioma correcto.
2. `applyLanguage()` se ejecuta como **una única tarea sincrónica**: no usa
   `setTimeout`, `requestAnimationFrame` ni clases transitorias, que son
   justamente lo que produciría un pintado intermedio.
3. Corre **antes de `initScrollReveal()`**, de modo que ningún elemento oculto
   llega a mostrarse con el texto anterior.

Verificado con screencast del navegador: con la transición del control anulada
(`prefers-reduced-motion: reduce`) el cambio produce **1 solo repintado**, y en
109 frames observados hay **0 estados intermedios** — la página nunca se ve a
medio traducir.

Sin JavaScript, el markup base en español sigue siendo visible.

### Editar una traducción

Cambia el valor de `data-en` (y `data-alt-en`, `data-aria-en` o `data-wa-en`
según el caso). El texto en español es el contenido real del elemento, así que
si cambias uno tienes que cambiar el otro: conviene mantenerlos idénticos.

---

## Header

El menú central se centra con un **grid de 3 columnas** (`1fr auto 1fr`) en lugar
de `justify-content: space-between` en flex. Con flex, el hijo del centro sólo
queda centrado cuando la marca y los controles miden lo mismo, y nunca lo hacen:
el nav se iba unos 110 px a la izquierda.

Breakpoints relevantes:

| Rango | Comportamiento |
|---|---|
| `< 480px` | 2 columnas (`minmax(0,1fr) auto`), controles y paddings reducidos, pill de idioma a 50 px |
| `< 768px` | Se oculta `.brand-subtitle` y se reduce la marca |
| `1000–1023px` | Aparece el nav; `.brand-subtitle` sigue oculto (el día que vuelve a salir ya todo cabe holgado) |
| `≥ 1024px` | Se muestra `.brand-subtitle` |

Medido en Chrome en 15 anchos de 320 a 1920 px, en ambos idiomas: **0 solapes,
0 overflow horizontal, 0 títulos truncados y offset de centrado 0 px**.

### Los dos toggles del header

`ES | EN` y claro/oscuro son controles independientes, cada uno con su propio
thumb deslizante. La distancia que recorre el thumb **no está escrita en las
reglas de estado** sino en el propio control:

```css
.theme-toggle-switch { --thumb-slide: 35px; }   /* 72px de pastilla */
.lang-toggle-switch  { --lang-slide: 28px; }    /* 58px de pastilla */

@media (max-width: 479px) {
  .theme-toggle-switch { width: 62px; --thumb-slide: 26px; }
  .lang-toggle-switch  { width: 50px; --lang-slide: 20px; }
}
```

El valor se deriva del ancho: `ancho - 3 - 3 - thumb`. Si alguna vez se cambia
el tamaño de una pastilla, solo hay que actualizar **una** línea.

Esto no es cosmético. Antes el valor estaba repetido en tres sitios y en móvil
había dos reglas que positioning el thumb del tema con `[data-lang]`: por
especificidad ganaban a `[data-theme]`, así que **cambiar de idioma movía el
toggle de tema**. Con la variable, esas reglas ya no existen y la trampa es
estructuralmente imposible.

Verificado en las 8 combinaciones ES/EN × claro/oscuro a 375 px y 1280 px.

---

## Botones de las tarjetas de sucursal

Cuando la tarjeta es más estrecha que 470 px, los tres botones no caben en una
fila y `flex-wrap` los repartía de forma irregular (dos arriba y uno solo
abajo). Se usa un **container query** sobre `.branch-card`:

```css
.branch-card { container-type: inline-size; }

@container (max-width: 470px) {
  .branch-actions-row { gap: 0.5rem; }              /* debe casar con el calc */
  .btn-branch-maps { flex: 1 1 100%; min-width: 0; } /* acción principal, fila entera */
  .btn-branch-sub  { flex: 1 1 calc(50% - 0.25rem); min-width: 0; }
}
```

Se eligió un container query y no un media query porque la restricción depende
del ancho de la **tarjeta**, no de la ventana: se estrecha por dos motivos
distintos (móvil a una columna, y retícula de dos columnas a media pantalla) y
un solo regla cubre ambos sin números mágicos de viewport.

Dos detalles que importan:
- `min-width: 0` es imprescindible. Un flex item no baja de su ancho de
  contenido por defecto, y sin esto a 320 px los tres botones se apilan en tres
  filas en vez de dos.
- El `gap` tiene que coincidir con el `calc`: dos mitades de `50% - 0.25rem`
  más un hueco de `0.5rem` suman exactamente 100 %.

Medido de 320 a 1920 px: 0 filas irregulares, 0 overflow, mitades exactas.

---

## Iconos de marca

Instagram y Facebook usan SVG inline con los glifos oficiales (Simple Icons,
CC0) en lugar de los ligatures genéricos de Material Symbols (`photo_camera` y
`public`). El SVG lleva `fill="currentColor"`, así que hereda el color del
contenedor y el hover turquesa del footer sigue funcionando sin reglas extra.

Se usa la clase `.brand-icon`, calcada de `.whatsapp-icon` (`flex-shrink: 0`).
Siguen siendo SVG inline: cero dependencias, cero fuente de iconos.

Ocurren en tres sitios: los dos del footer y el CTA "Ver perfil de Instagram"
de la sección de Reseñas.

---

## Notas sobre las imágenes

Las fotografías se sirven como URLs directas de `lh3.googleusercontent.com` y **todas llegan como máximo a 512 px de lado mayor**, aunque varias se declaran en el HTML a 1920 px o más. En pantallas grandes se ven pixeladas y penalizan el LCP. Se recomienda bajar originales de mayor resolución y alojarlos en `public/img/` con `srcset`.

---

## Pendientes técnicos

- No hay linter, formateador, tests ni CI
- Los botones de filtro del menú están comentados en `index.html`, aunque la lógica sigue viva en `src/main.js`
- `index.html` monolítico (~1350 líneas): candidato natural a componentizar
- Al añadir texto traducible hay que acordarse del par `data-es` / `data-en` (ver arriba)
