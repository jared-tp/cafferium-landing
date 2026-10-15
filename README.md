# Cafferium · Landing Page

Landing de una sola página para **Cafferium**, cafetería de especialidad, panadería de masa
madre y espacio cultural en Mazatlán, Sinaloa.

- **Producción:** [cafferium.com.mx](https://cafferium.com.mx/)
- **Instagram:** [@cafferium.mx](https://www.instagram.com/cafferium.mx/)

## El negocio

Cafferium es un café de especialidad con panadería deartesanal y una sala con biblioteca,
en Mazatlán. Tiene dos sucursales:

| Sucursal | Dirección | Horario |
|---|---|---|
| Centro Histórico | Belisario Domínguez 2006, Centro Histórico, C.P. 82000 | Martes a domingo, 8:00 AM – 10:00 PM |
| Torre Central | Torre Central 102, Local 101 (Av. Quirino Ordaz / "Maleconcito") | Martes a domingo, 8:00 AM – 10:00 PM |

Lunes cerrado en ambas. Todos los enlaces de contacto van a WhatsApp.

## Qué es esta página

Una landing estática con todo el recorrido de conversión en una sola pantalla larga: hero,
esencia de la casa, carta de productos, reseñas, sucursales con mapa y horarios, y galería
de Instagram. Es la puerta de entrada a Instagram y a los canales de contacto, así que está
optimizada para móvil y para compartir el enlace.

Incluye tema claro y oscuro, versión en español e inglés conmutable sin recargar, datos
estructurados para buscadores, y una imagen de Open Graph para los enlaces compartidos en
redes.

## Stack

Sin framework y **sin una sola dependencia en runtime**. Lo único instalado es el servidor
de desarrollo.

| Pieza | Qué se usa |
|---|---|
| **Vite 5** | Servidor de desarrollo y empaquetado |
| **JavaScript vanilla** | Módulos ES nativos, sin compilar lógica |
| **CSS puro** | Un solo archivo con el design system y todos los estilos |
| **HTML monolítico** | Todo el markup en `index.html` |
| **Google Fonts** | Cinzel, Inter, Playfair Display y Material Symbols |

Cero dependencias, cero frameworks, cero paso de compilación más allá de Vite. Todo lo que
no es HTML puro es CSS a pelo o SVG en línea.

## Comandos

```bash
npm install      # instala Vite
npm run dev      # servidor de desarrollo en http://localhost:3000 (se abre solo)
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

## Estructura

```
index.html      Todo el markup de la landing
src/style.css   Design system y todos los estilos
src/main.js     Lógica de cliente: i18n, tema, drawer, modal, animaciones de scroll
public/         Assets estáticos (imágenes, iconos, og-image, robots.txt, sitemap.xml)
```

`public/` se copia tal cual a `dist/`, así que lo que se pone ahí acaba publicado.
