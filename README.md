# Cafferium • Specialty Coffee & Panadería Artesanal | Mazatlán

Landing page oficial de **Cafferium Specialty Coffee**, desarrollada a partir del diseño y prototipo en Stitch (*Artisanal Coastal Neoclassical*).

---

## ☕ Características de la Landing Page

- **Diseño Responsivo Unificado**: Optimizado para dispositivos móviles, tablets y monitores de escritorio.
- **Identidad de Marca Local**: Paleta cromática inspirada en la casona patrimonial del Centro Histórico de Mazatlán (Teal Colonial, Oro Champán y Carbón Espresso).
- **Menú de Especialidad con Filtros**: Navegación dinámica por categorías (*Café & Bebidas*, *Desayunos & Brunch*, *Repostería*).
- **Conversión y Contacto Directo**:
  - Botones de pedido directo por WhatsApp con mensajes pre-configurados para cada producto.
  - Enlaces directos a Google Maps para ambas sucursales (*Centro Histórico* y *Torre Central*).
  - Marcación telefónica directa (`tel:6691054810`).
- **Prueba Social (Social Proof)**:
  - Calificación de Google (4.7★ basada en +669 reseñas).
  - Testimonios de Google Local Guides y visitantes.
  - Mosaico fotográfico conectado al Instagram oficial `@cafferium`.
- **Rendimiento & SEO**:
  - Carga prioritaria de imagen LCP (`fetchpriority="high"`).
  - Metadatos OpenGraph y Twitter Card completos.
  - Cero dependencias pesadas en tiempo de ejecución (Vanilla JS y CSS optimizado).

---

## 🚀 Cómo ejecutar localmente

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo con recarga en caliente
```bash
npm run dev
```
La aplicación se abrirá automáticamente en `http://localhost:3000`.

### 3. Compilar para producción
```bash
npm run build
```
Genera los archivos optimizados y minificados en la carpeta `/dist`.

### 4. Previsualizar la versión de producción
```bash
npm run preview
```

---

## 🌐 Estructura del Proyecto

```
cafferium-landing/
├── index.html        # Página principal con semántica HTML5 y optimizaciones SEO/LCP
├── package.json      # Configuración de dependencias y scripts de Vite
├── vite.config.js    # Configuración de puerto y empaquetado Vite
├── .gitignore        # Archivos y carpetas ignorados por Git
├── src/
│   ├── main.js       # Lógica de filtrado de menú, navegación drawer y scroll suave
│   └── style.css     # Sistema de diseño, tokens de color, tipografía y responsive CSS
└── README.md         # Documentación del proyecto
```
