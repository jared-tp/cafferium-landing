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

---

## Notas sobre las imágenes

Las fotografías se sirven como URLs directas de `lh3.googleusercontent.com` y **todas llegan como máximo a 512 px de lado mayor**, aunque varias se declaran en el HTML a 1920 px o más. En pantallas grandes se ven pixeladas y penalizan el LCP. Se recomienda bajar originales de mayor resolución y alojarlos en `public/img/` con `srcset`.

---

## Pendientes técnicos

- No hay linter, formateador, tests ni CI
- Los botones de filtro del menú están comentados en `index.html`, aunque la lógica sigue viva en `src/main.js`
- `index.html` monolítico (~1350 líneas): candidato natural a componentizar
- Al añadir texto traducible hay que acordarse del par `data-es` / `data-en` (ver arriba)
