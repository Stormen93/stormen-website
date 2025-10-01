/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (full)
   - Opens/closes the side menu
   - Burger morph controlled by aria-expanded
   - Dedicated close (X) button lives INSIDE #sidePanel
   - Backdrop click + ESC + nav-link close
   - Header color swap on scroll (keeps header fixed behavior)
   ────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Feather icons (safe if not loaded)
  if (window.feather && typeof feather.replace === 'function') { try { feather.replace(); } catch {} }

  const siteHeader    = document.getElementById('siteHeader');
  const sidePanel     = document.getElementById('sidePanel');
  const backdrop      = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const themeToggle   = document.getElementById('themeToggle');
  const themeIcon     = document.getElementById('themeIcon');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  /* --------- Ensure an in-panel close button exists --------- */
  let panelCloseBtn = document.getElementById('panelCloseBtn');
  if (!panelCloseBtn) {
    panelCloseBtn = document.createElement('button');
    panelCloseBtn.id = 'panelCloseBtn';
    panelCloseBtn.type = 'button';
    panelCloseBtn.setAttribute('aria-label', 'Close menu');
    panelCloseBtn.innerHTML = '<span class="burger-line"></span><span class="burger-line lower"></span>';
    sidePanel.appendChild(panelCloseBtn);
  }

  /* --------- State helpers --------- */
  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  function openPanel() {
    sidePanel.classList.remove('-translate-x-full');  // slide in
    backdrop.classList.add('opacity-50');             // fade in backdrop
    siteHeader.classList.add('menu-open');            // adjust z-index & burger styling

    // Burger morph trigger
    menuToggleBtn.setAttribute('aria-expanded', 'true');

    // Show the in-panel close button (class only; no inline display)
    panelCloseBtn.classList.add('show');
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    // Burger morph reset
    menuToggleBtn.setAttribute('aria-expanded', 'false');

    // Hide via class only
    panelCloseBtn.classList.remove('show');
  }

  /* --------- Wire up interactions --------- */
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

  /* --------- Header scroll color swap (keeps header fixed behavior) --------- */
  const onScroll = () => {
    if (window.scrollY > 10) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  /* --------- Theme toggle (kept simple) --------- */
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

  /* --------- Safety: ensure correct initial state --------- */
  if (isOpen()) {
    // If panel is already visible (e.g., hot reload), show the X and morph burger
    panelCloseBtn.classList.add('show');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  } else {
    panelCloseBtn.classList.remove('show');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }
});
