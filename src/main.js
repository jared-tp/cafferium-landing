/**
 * CAFFERIUM SPECIALTY COFFEE - Main Client Logic
 */

/* ==========================================================================
   Internationalization (ES / EN)
   Las traducciones viven junto al original en el markup: data-es / data-en para
   texto, data-alt-* para <img alt>, data-aria-* para aria-label y data-wa-*
   para los mensajes prellenados de WhatsApp.
   ========================================================================== */

const I18N = {
  storageKey: 'cafferium-lang',
  supported: ['es', 'en'],
  htmlLang: { es: 'es-MX', en: 'en' },

  docTitle: {
    es: 'Cafferium • Cafetería de Especialidad & Panadería Artesanal | Mazatlán',
    en: 'Cafferium • Specialty Coffee & Artisan Bakery | Mazatlán',
  },

  docDescription: {
    es: 'Cafetería de especialidad y panadería de masa madre en Mazatlán, Sinaloa. Café mexicano de altura, repostería artesanal, libros y un refugio cultural en Centro Histórico y Torre Central.',
    en: 'Specialty coffee and sourdough bakery in Mazatlán, Sinaloa. High-altitude Mexican coffee, artisan pastries, books and a cool cultural retreat in Centro Histórico and Torre Central.',
  },

  // La etiqueta describe la acción que ejecuta el toggle, no el estado actual
  toggleLabel: {
    es: 'Switch to English',
    en: 'Cambiar a español',
  },

  liveMessage: {
    es: 'Idioma cambiado a español',
    en: 'Language changed to English',
  },

  whatsappBase: 'https://wa.me/526691591505?text=',
};

/**
 * Determina el idioma activo respetando, en este orden:
 * 1. Preferencia guardada por el usuario
 * 2. data-lang, ya resuelto por el script anti-FOUC del <head>
 * 3. Idioma del navegador
 */
function resolveLanguage() {
  let saved = null;
  try {
    saved = localStorage.getItem(I18N.storageKey);
  } catch (e) {
    saved = null;
  }
  if (saved && I18N.supported.includes(saved)) return saved;

  const fromHead = document.documentElement.getAttribute('data-lang');
  if (fromHead && I18N.supported.includes(fromHead)) return fromHead;

  const nav = (navigator.language || 'es').toLowerCase();
  return nav.startsWith('es') ? 'es' : 'en';
}

function getCurrentLanguage() {
  return document.documentElement.getAttribute('data-lang') || 'es';
}

/**
 * Aplica un idioma a todo el documento.
 *
 * Se ejecuta como UNA única tarea sincrónica: el navegador no pinta entre
 * iteraciones, así que no hay parpadeo. Nada aquí usa setTimeout, clases
 * transitorias ni requestAnimationFrame, que son justamente lo que lo causaría.
 */
function applyLanguage(lang) {
  const k = lang === 'en' ? 'en' : 'es';
  const root = document.documentElement;
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', I18N.htmlLang[lang]);

  // --- Texto visible ---
  const texts = document.querySelectorAll('[data-es]');
  for (const el of texts) {
    // Sólo nodos hoja: si el elemento tiene hijos, sobrescribir textContent
    // destruiría iconos o etiquetas anidadas.
    if (el.children.length > 0) continue;
    const value = el.getAttribute('data-' + k);
    if (value !== null) el.textContent = value;
  }

  // --- Texto alternativo de imágenes ---
  for (const el of document.querySelectorAll('[data-alt-es]')) {
    const value = el.getAttribute('data-alt-' + k);
    if (value !== null) el.setAttribute('alt', value);
  }

  // --- Etiquetas accesibles ---
  for (const el of document.querySelectorAll('[data-aria-es]')) {
    const value = el.getAttribute('data-aria-' + k);
    if (value !== null) el.setAttribute('aria-label', value);
  }

  // --- Mensajes prellenados de WhatsApp ---
  for (const el of document.querySelectorAll('[data-wa-es]')) {
    const msg = el.getAttribute('data-wa-' + k);
    if (msg) el.setAttribute('href', I18N.whatsappBase + encodeURIComponent(msg));
  }

  // --- Metadatos del documento ---
  document.title = I18N.docTitle[k];
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', I18N.docDescription[k]);

  // --- Estado accesible de los controles de idioma (header y drawer) ---
  const label = I18N.toggleLabel[lang];
  for (const toggle of document.querySelectorAll('.lang-toggle-switch')) {
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  }
}

function initLanguage() {
  const toggles = document.querySelectorAll('.lang-toggle-switch');
  const status = document.getElementById('langStatus');

  // El idioma ya quedó resuelto en el <head> antes del primer paint, así que
  // aquí sólo se sincroniza el DOM. Corre antes que initScrollReveal() para
  // que ningún elemento oculto llegue a mostrarse con el texto anterior.
  applyLanguage(resolveLanguage());

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const next = getCurrentLanguage() === 'en' ? 'es' : 'en';
      try {
        localStorage.setItem(I18N.storageKey, next);
      } catch (e) {
        // Modo privado / almacenamiento bloqueado: el cambio sigue funcionando
      }
      applyLanguage(next);
      if (status) status.textContent = I18N.liveMessage[next];
      // Si se cambió desde el drawer, se cierra para no tapar el resultado.
      if (toggle.id === 'langToggleDrawer') closeMobileDrawer();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 0. Idioma — antes que cualquier otra inicialización
  initLanguage();

  // 1. Menu Filter Logic
  initMenuFilter();

  // 2. Mobile Drawer Navigation
  initMobileDrawer();

  // 3. Smooth Anchor Scrolling with Header Offset
  initSmoothScroll();

  // 4. Scrollspy Active Navigation
  initScrollspy();

  // 5. Scroll Reveal Transitions
  initScrollReveal();

  // 6. Dark / Light Theme Toggle
  initThemeToggle();
});

/**
 * Initializes tabbed category filtering for specialty menu items
 */
function initMenuFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!filterButtons.length || !menuCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('data-filter');

      // Update active state on buttons
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter cards with smooth opacity and transform transition
      menuCards.forEach((card) => {
        const itemCategory = card.getAttribute('data-category');
        const isMatch = selectedCategory === 'all' || itemCategory === selectedCategory;

        if (isMatch) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/**
 * Cierra el drawer móvil. Definido a nivel de módulo para que otros
 * inicializadores (p. ej. el de idioma) puedan invocarlo.
 */
function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const toggleBtn = document.getElementById('mobileMenuToggle');

  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/**
 * Manages mobile drawer menu opening, closing, escape key, and backdrop blur
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileDrawer);
  overlay.addEventListener('click', closeMobileDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeMobileDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMobileDrawer();
    }
  });
}

/**
 * Handles smooth scrolling with responsive offset calculation
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.offsetHeight + 10 : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Highlights navigation links based on current scroll position
 */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Smooth scroll-triggered reveal animations via IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
  if (!revealElements.length) return;

  // Mark document as supporting JS reveal to activate hidden initial state
  document.documentElement.classList.add('js-reveal');

  // Check prefers-reduced-motion accessibility preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * Theme toggle controller with localStorage persistence, OS detection, and accessible states
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const storageKey = 'cafferium-theme';

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(theme, animate = true) {
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 250);
    }

    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Dynamic descriptive aria-label and title for accessibility
    const isDark = theme === 'dark';
    const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    toggleBtn.setAttribute('aria-label', label);
    toggleBtn.setAttribute('title', label);
  }

  // Initialize accessibility attributes according to currently rendered theme
  applyTheme(getCurrentTheme(), false);

  // Toggle theme on button click
  toggleBtn.addEventListener('click', () => {
    const current = getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';

    try {
      localStorage.setItem(storageKey, next);
    } catch (e) {
      console.warn('No se pudo guardar la preferencia en localStorage:', e);
    }

    applyTheme(next, true);
  });

  // Listen for OS system theme changes if the user hasn't explicitly chosen a manual preference
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) {
          applyTheme(e.matches ? 'dark' : 'light', true);
        }
      } catch (err) {
        applyTheme(e.matches ? 'dark' : 'light', true);
      }
    });
  } catch (e) {
    // Legacy browser support
  }
}


