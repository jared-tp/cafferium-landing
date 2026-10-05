# AGENTS.md — Cafferium Landing

Instrucciones para agentes de IA que trabajen en este repositorio.

## Qué es

Landing page de una sola página para la cafetería **Cafferium** (Mazatlán,
Sinaloa). Sitio de captación: todo el embudo acaba en WhatsApp
(`+52 669 105 4810`). Todo el contenido está en español e inglés.

## Stack

Vite 5 + JavaScript vanilla + CSS puro. **Cero dependencias en runtime** y
`vite` como única devDependency.

Reglas duras:

- **No añadas dependencias.** Ni un framework, ni un normalizador, ni una
  fuente de iconos, ni un paquete de build. SVG inline y CSS a pelo.
- **No introduzcas un framework ni un paso de build.** `index.html` es un
  archivo estático monolítico a propósito.
- Si algo se resuelve con CSS o con un `<svg>` inline, se resuelve así.
- Al empezar, leer `MEMORY.md` para conocer el estado del proyecto y las decisiones tomadas.
- **SIEMPRE** actualizar `MEMORY.md` al terminar cada tarea.
- **NO rompas** ninguna funcionalidad. Verifica que todo funciona correctamente después de cada cambio.
- **NO modifiques** archivos que no estén relacionados con la tarea asignada.
- **NO introduzcas** código innecesario, solo lo estrictamente necesario.
- **NO introduzcas** código que no esté alineado con el estilo del proyecto.
- Si algo se convierte en una regla permanente, propón moverlo a `AGENTS.md` en lugar de dejarlo en la memoria.
- **NO hagas** cambios en la repo como mover, crear o eliminar archivos sin consultarme antes.

## Comandos

```bash
npm install      # npm ci en CI
npm run dev      # http://localhost:3000, se abre solo
npm run build    # -> dist/
npm run preview  # sirve dist/
```

## Mapa de archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Todo el markup, ~100 KB. Incluye el JSON-LD y el script anti-FOUC del `<head>` |
| `src/style.css` | Design system + todos los estilos, ~2180 líneas |
| `src/main.js` | Toda la lógica de cliente, ~425 líneas, sin dependencias |
| `public/` | Assets que se publican. **Fuente, no salida de build** |
| `README.md` | Documentación de cara a humanos |

No hay tests, ni linter, ni CI. No los des por supuestos: si añades uno,
añádelo también a `package.json` y al README.

---

# Invariantes

Esta sección es lo importante. Cada punto son errores que **ya ocurrieron** o
que romperían algo de forma silenciosa.

## 1. i18n: sólo marca hojas

`applyLanguage()` asigna con `textContent`. Si marcas un elemento que tiene
hijos, **destruyes** iconos o etiquetas anidadas.

El fallo silencioso: el guard `if (el.children.length > 0) continue;` no lanza
ningún error, simplemente se salta el nodo y ese texto **se queda en español
para siempre**. No hay aviso.

```html
<!-- MAL: tiene un <strong> dentro, nunca se traducirá -->
<p data-es="Síguenos en @cafferium.mx." data-en="Follow us at @cafferium.mx.">
  Síguenos en <strong>@cafferium.mx</strong>.</p>

<!-- BIEN: solo el fragmento de texto lleva los atributos -->
<p><span data-es="Síguenos en" data-en="Follow us at">Síguenos en</span>
  <strong>@cafferium.mx</strong>.</p>
```

**Todo texto traducible necesita los dos atributos.** Los conteos van
aparejados; si añades uno, revisa que no rompas la paridad:

| Atributo | Conteo actual | Se aplica a |
|---|---|---|
| `data-es` / `data-en` | 124 / 124 | texto visible |
| `data-alt-es` / `data-alt-en` | 18 / 18 | `alt` de imágenes |
| `data-aria-es` / `data-aria-en` | 9 / 9 | `aria-label` |
| `data-wa-es` / `data-wa-en` | 11 / 11 | mensajes de WhatsApp |
| `data-img-es` / `data-img-en` | 4 / 4 | assets que cambian con el idioma |

Los `<link>` de WhatsApp también se reconstruyen con `encodeURIComponent` a
partir de `data-wa-*`. El texto va **sin codificar** en el atributo.

`data-img-*` lo applyLanguage() aplica **según la etiqueta**: `src` en una `<img>`
y `href` en un `<a>`. Existe para que solo se descargue el asset del idioma
activo: las 4 fotos del menú son 1132×1600 y 1.1 MB en total, y con dos `<img>`
alternas por `display:none` se descargarían las cuatro.

## 2. i18n: el idioma se resuelve antes del primer pintado

El script inline del `<head>` lee `localStorage` y, si no hay preferencia,
deriva de `navigator.language`. Está ahí para que la primera pintada ya salga
en el idioma correcto.

- **`initLanguage()` va primera en `DOMContentLoaded`**, antes de
  `initScrollReveal()`. Si no, un elemento oculto llega a mostrarse con el
  texto anterior.
- **El intercambio debe seguir siendo una única tarea sincrónica.** Nada de
  `setTimeout`, `requestAnimationFrame` ni clases transitorias: eso es
  precisamente lo que produce un pintado intermedio.

Medido: con la transición del control anulada, el cambio produce **1 solo
repintado**, y en 109 frames observados hay **0 estados intermedios**.

## 3. Los dos toggles son independientes

La distancia que recorre el thumb **vive en el control**, no en las reglas de
estado:

```css
.theme-toggle-switch { --thumb-slide: 35px; }   /* pastilla de 72px */
.lang-toggle-switch  { --lang-slide: 28px; }    /* pastilla de 58px */
```

El valor se deriva del ancho: `ancho - 3 - 3 - thumb`. Si cambias el tamaño de
una pastilla, **una sola línea** cambia.

| Control | Escritorio | Móvil (≤479px) |
|---|---|---|
| Tema (`--thumb-slide`) | 35px (pastilla 72) | 26px (pastilla 62) |
| Idioma (`--lang-slide`) | 28px (pastilla 58) | 20px (pastilla 50) |

**Nunca escribas un `translateX()` literal en una regla de estado.** Y nunca
posiciones el thumb del tema con `[data-lang]` ni el del idioma con
`[data-theme]`: ya pasó, y por especificidad `(0,3,0)` ganaba a `(0,2,0)` y
**cambiar de idioma movía el toggle de tema**.

## 4. El header usa grid, no flex

`.nav-container` es un grid de 3 columnas `1fr auto 1fr`, con `grid-column`
explícito en los tres hijos. Con `flex` + `space-between` el nav se iba
**~110px a la izquierda**, porque el centro sólo queda centrado si ambos lados
miden lo mismo.

Por debajo de 1000px el nav no existe, así que el grid pasa a
`minmax(0, 1fr) auto`. Ahí la marca **necesita `justify-self: stretch`**: con
`start` toma su ancho max-content, se sale de la pista y se monta encima de los
controles. Es un solapamiento real, no un problema teórico.

Presupuesto medido a 1280px: marca 263px · nav 410px (es) / 356px (en) ·
acciones 140px.

**El nav aparece a 1000px, no a 900px.** Los 900px los usan las secciones de
contenido (mosaic, menu-header, instagram-banner, branches-grid). No los
confundas. En el punto exacto de entrada el nav ocupa 823px de los 1000
disponibles (marca 209 con el subtítulo oculto + nav 410 + acciones 140, más
64px de padding), así que el margen es de ~177px. Si bajas el breakpoint,
vuelve a medir: los controles suman 140px en escritorio y 189px en móvil.

## 5. Botones de sucursal: container query, no media query

La restricción depende del ancho de la **tarjeta**, no de la ventana. Se
estrecha por dos motivos distintos (móvil a una columna, y retícula de 2
columnas a media pantalla) y una sola regla cubre ambos.

```css
.branch-card { container-type: inline-size; }

@container (max-width: 470px) {
  .branch-actions-row { gap: 0.5rem; }              /* debe casar con el calc */
  .btn-branch-maps { flex: 1 1 100%; min-width: 0; }
  .btn-branch-sub  { flex: 1 1 calc(50% - 0.25rem); min-width: 0; }
}
```

Dos trampas ya pisadas:

- El **`gap` tiene que coincidir con el `calc`**: dos mitades de
  `50% - 0.25rem` más un hueco de `0.5rem` suman exactamente 100%. Con el gap
  en `0.6rem` sobran 1.6px, los dos secundarios no caben juntos y se apilan en
  tres filas.
- **`min-width: 0` es imprescindible.** Un flex item no baja de su ancho de
  contenido por defecto; sin esto, a 320px los tres botones van a tres filas.

## 6. `public/` es fuente, no build

`public/` está en `.gitignore` solo si lo añades tú. **Nunca lo ignores**: son
los assets que se publican (favicon, `og-image`, `robots.txt`, `sitemap.xml`,
manifest). `dist/` sí es salida de build y se regenera.

## 7. Favicon: versión simplificada a propósito

El logo es un dibujo de línea con mucho detalle. Medido a tamaño real de
píxel, **a 16px el rostro es una mancha**. La corona de laurel, extraída del
propio logo por color, sí se lee.

- **16–48px** → corona de laurel, fondo transparente
- **180px en adelante** → logo completo

No lo "corrijas" para usar el logo entero en tamaños pequeños. Los iconos de
512 son **JPEG a propósito**: sin canal alfa el mismo dibujo pasa de 285 KB en
PNG a 46 KB en JPEG q90 sin diferencia visible. El PNG queda para lo que
necesita transparencia y para iOS.

## 8. El JSON-LD no se cambia desde el cliente

Google lee el HTML crudo, así que el contenido canónico sigue siendo el
español del servidor. `applyLanguage()` actualiza `<title>` y
`meta description`, pero **jamás** los datos estructurados.

Dominio asumido **`https://cafferium.com.mx`**, presente en `index.html`,
`public/robots.txt` y `public/sitemap.xml`. Si cambia, replace en los tres.

## 9. Contraste sobre foto: mide con dos capturas

Texto sobre una imagen no se valida leyendo el CSS. El scrim necesario depende
del **píxel más claro de la foto**, y eso solo se sabe mirando píxeles.

**Dos capturas, siempre.** Si mides el `boundingBox` del texto con la letra
puesta, el píxel más claro que encuentras es **la propia letra**, no el fondo, y
sale un ratio de 1:1 que parece un bug. Correcto: captura la tarjeta con
`visibility: hidden` en los hijos del caption y usa esa captura como fondo puro.
Repite por tarjeta y quédate con el **peor caso**, no con el promedio.

**Si todas las tarjetas dan el MISMO número, estás midiendo algo que no varía.**
Fotos distintas no pueden dar la misma luminancia. Casi siempre es que un
`background` opaco está tapando la imagen.

Al pasar un elemento a overlay, **pon `background-color: transparent`
explícito**: si hay una regla base que le asigna color de superficie, ese color
queda debajo del overlay y tapa la foto entera.

Pon el scrim en degradado, no plano, cuando el texto solo ocupa la banda
central: oscurecer solo ahí deja las fotos vivas en los bordes. Pero **los
degradados no interpolan** en CSS, así que va en un `::before` con la intensidad
máxima y se modula con `opacity`.

No fixes el color de un texto pequeño sin medirlo antes. Sobre foto oscurecida
un tono medio como el turquesa de marca puede caer a **1.35:1** y ser ilegible,
aunque en la barra de abajo se lea bien. Ningún teal llegó a 4.5:1: acabó en
blanco.

## 10. El modal del menú: el foco y el click fuera

`.menu-modal` es un diálogo modal (`aria-modal="true"`) y clona la estructura
del drawer: overlay + panel con la clase `.open`, cierre por X / ESC / backdrop.

Dos cosas que el drawer NO hace y este sí, porque aquí son obligatorias:

- **Gestiona el foco.** Se guarda el elemento que lo tenía, se pasa al botón de
  cerrar, el `Tab` cicla dentro del diálogo y al cerrar se le devuelve el foco.
  Un `aria-modal` sin esto deja al usuario de teclado atrapado o perdido.
- **El click fuera se escucha en `.menu-modal`, no en el overlay.** `.menu-modal`
  es `position: fixed; inset: 0` con un z-index **mayor** que el del overlay, así
  que es el que recibe los clics de alrededor del panel y el overlay nunca los ve.
  El filtro `e.target === modal` descarta los clics que llegan del card, que es lo
  que mantiene el modal abierto al interactuar con el menú.

Usa `visibility: hidden` en vez de `display: none` para que la apertura sea
animable. Pero **`visibility: hidden` no evita la descarga de las `<img>`**: se
comprobó que al cargar se baja la del idioma activo (303 KB) y la otra solo cuando
se abre su pestaña. Con `display: none` + `loading="lazy"` no se bajaría ninguna.

Y no olvides el bloque `prefers-reduced-motion`: sin él el panel seguía
interpolando su `transform`.

---

# Convenciones

- **Comentarios, commits y copy en español.** El copy de cara al usuario
  también: la landing es bilingüe.
- Los comentarios CSS explican **por qué**, no qué. Si una regla parece rara,
  el motivo ya está escrito ahí: no lo borres.
- `style.css` está organizado en banners `/* ====== Nombre ====== */`. Al
  añadir una sección, mantén el formato.
- Clases BEM-ish: `.menu-card`, `.menu-card-title`, `.branch-actions-row`.
- Números mágicos evitados. Si un valor depende del tamaño de otro elemento,
  calcúlalo con una custom property.

---

# Verificación

**No des por hecho que algo funciona: mídelo.** En este repo varios bugs eran
invisibles sin navegador (solapamiento a 375px, el toggle que se movía con el
idioma, el párrafo que nunca se traducía).

Arnés recomendado, **fuera del proyecto** para no tocar `package.json`:

```powershell
$t = "$env:TEMP\cafferium-check"
New-Item -ItemType Directory -Force -Path $t | Out-Null
Set-Location $t; npm init -y; npm i playwright-core
```

Usa el Chrome ya instalado, sin descargar navegadores:

```js
const { chromium } = require('playwright-core');
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
```

Chrome existe en `C:\Program Files\Google\...` y en
`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.

Qué comprobar según el cambio:

- **Anchos:** 320, 360, 375, 414, 480, 640, 768, 900, 999, 1000, 1024, 1280,
  1440, 1920. En ambos idiomas. Los puntos críticos son **999/1000** (aparece
  el nav) y **1023/1024** (vuelve el subtítulo de marca).
- **Toggle de tema:** las 4 combinaciones ES/EN × claro/oscuro. El thumb debe
  estar en 4px (claro) o 4+`--thumb-slide` (oscuro), en todos los casos.
- **Idioma:** que no queden nodos con el texto del idioma anterior.
- **Anti-parpadeo:** screencast por CDP (`Page.startScreencast`) contando
  frames visualmente distintos. Con `prefers-reduced-motion: reduce` debe dar
  **1**.

Un detalle: el `clip` de `Page.startScreencast` **se ignora** en algunas
versiones. Para aislar una zona, recorta con `page.screenshot({ clip })` tras
hacer `scrollIntoViewIfNeeded()`.

## Limpieza

Borra los temporales al terminar. Los prefijados con `_` están en
`.gitignore`, pero **uno se te coló en un commit**: revisa
`git status` antes de commitear y usa `git status --short`.

---

# Pendientes conocidos

No son tareas pendientes de hacer, sino cosas que ya se investigaron y siguen
abiertas. No las "descubras" de nuevo.

1. **Todas las imágenes llegan como máximo a 512px** desde hotlinks de
   `lh3.googleusercontent.com`, pero el hero se declara `1920×1080` y el banner
   del mosaico `1280×550`. Se ven pixeladas en pantallas grandes y penalizan
   el LCP. Lo correcto es bajar originales de alta resolución a `public/img/`
   con `srcset`.
2. **Las coordenadas del JSON-LD son aproximadas** (`23.2494, -106.4111` y
   `23.2451, -106.4140`). Hay que verificarlas con las fichas de Google Maps.
   Importan para el paquete de datos local.
3. **`aggregateRating` en el nodo `Organization`**: los datos son ciertos
   (4.7★ / 669 reseñas de Google), pero Google no da rich result a reseñas
   propias fuera de su plataforma. Si prefieres cumplimiento estricto, borra
   ese bloque.
4. **El enlace de Facebook no está verificado** que exista realmente.
5. **No hay `.gitattributes`**, así que Git convierte LF→CRLF en cada commit y
   avisa. Añadir `* text=auto eol=lf` lo arregla, pero renormaliza todos los
   archivos en el commit siguiente.
6. **El filtro de categorías del menú**: la lógica sigue viva en
   `initMenuFilter()` pero los botones están comentados en `index.html`.
7. **Sin linter, formateador, tests ni CI.**

---

# Lo que salió mal aquí, resumido

Para que no se repita:

- Un selector con especificidad `(0,3,0)` se coló por encima de un estado y
  rompió un control. **Comprueba la especificidad cuando añadas selectores
  compuestos.**
- Supuse que `textContent` sobre un elemento con hijos no destruiría nada. El
  guard lo ocultó en lugar de avisar. **Un fallo silencioso es peor que un
  error.**
- Dejé dos archivos temporales en la raíz y acabarons en un commit.
- Asumí números de layout a partir del CSS en lugar de medirlos, y el margen
  real resultó bastante más ajustado de lo previsto.
- Medí el contraste del texto sobre la foto **con la letra puesta**, así que
  leí el píxel más claro y era la propia letra: 1:1. Parecía un bug de render y
  era un bug de medición. Ver invariante 9.
- Al medir cuatro tarjetas me salieron **cuatro valores idénticos**, que es
  imposible con fotos distintas. Era el `background-color` opaco de la regla
  base tapando la imagen. Ese número raro era la señal, y no la dejé pasar.
