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
src/main.js           Lógica de cliente (filtros, drawer, scrollspy, reveal, tema)
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

## Notas sobre las imágenes

Las fotografías se sirven como URLs directas de `lh3.googleusercontent.com` y **todas llegan como máximo a 512 px de lado mayor**, aunque varias se declaran en el HTML a 1920 px o más. En pantallas grandes se ven pixeladas y penalizan el LCP. Se recomienda bajar originales de mayor resolución y alojarlos en `public/img/` con `srcset`.

---

## Pendientes técnicos

- No hay linter, formateador, tests ni CI
- Los botones de filtro del menú están comentados en `index.html` (líneas ~361), aunque la lógica sigue viva en `src/main.js`
- `index.html` monolítico (~1100 líneas): candidato natural a componentizar
