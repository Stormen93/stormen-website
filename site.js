/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (final)
   - Burger morph + slide to the right in sync with panel
   - In-panel X always visible/clickable when open
   - Header remains fixed; scroll color swap preserved
   ────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  if (window.feather && typeof feather.replace === 'function') { try { feather.replace(); } catch {} }

  const siteHeader    = document.getElementById('siteHeader');
  const sidePanel     = document.getElementById('sidePanel');
  const backdrop      = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const themeToggle   = document.getElementById('themeToggle');
  const themeIcon     = document.getElementById('themeIcon');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  /* Ensure an in-panel close button exists */
  let panelCloseBtn = document.getElementById('panelCloseBtn');
  if (!panelCloseBtn) {
    panelCloseBtn = document.createElement('button');
    panelCloseBtn.id = 'panelCloseBtn';
    panelCloseBtn.type = 'button';
    panelCloseBtn.setAttribute('aria-label', 'Close menu');
    panelCloseBtn.innerHTML = '<span class="burger-line"></span><span class="burger-line lower"></span>';
    sidePanel.appendChild(panelCloseBtn);
  }

  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  function openPanel() {
    // Set the exact panel width so the burger slides precisely to the right
    document.documentElement.style.setProperty('--panel-w', sidePanel.offsetWidth + 'px');

    sidePanel.classList.remove('-translate-x-full');      // slide in
    backdrop.classList.add('opacity-50');                 // fade in overlay
    siteHeader.classList.add('menu-open');                // allow panel to overtake header

    // Trigger burger morph + slide (CSS hooks on aria-expanded/ .menu-open)
    menuToggleBtn.setAttribute('aria-expanded', 'true');

    // Show the in-panel X (CSS controls display)
    panelCloseBtn.classList.add('show');
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    // Reset burger
    menuToggleBtn.setAttribute('aria-expanded', 'false');

    // Hide in-panel X
    panelCloseBtn.classList.remove('show');
  }

  /* Interactions */
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closePanel() : openPanel();
  });

  panelCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closePanel();
  });

  backdrop.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closePanel();
  });

  // Close after clicking any nav link inside the panel
  sidePanel.addEventListener('click', (e) => {
    if (e.target.closest('a')) closePanel();
  });

  /* Header scroll color swap */
  const onScroll = () => {
    if (window.scrollY > 10) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  /* Theme toggle (kept simple) */
  const applyTheme = () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    if (themeIcon) themeIcon.src = isDark ? 'images/darkmode.png' : 'images/lightmode.png';
  };
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = !(localStorage.getItem('theme') === 'dark');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      applyTheme();
    });
  }
  applyTheme();

  /* Initial state (e.g., hot reload) */
  if (isOpen()) {
    document.documentElement.style.setProperty('--panel-w', sidePanel.offsetWidth + 'px');
    panelCloseBtn.classList.add('show');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    siteHeader.classList.add('menu-open');
  } else {
    panelCloseBtn.classList.remove('show');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    siteHeader.classList.remove('menu-open');
  }
});
