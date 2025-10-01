/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (menu-internal animation)
   - Header burger opens menu
   - Close button lives INSIDE the menu and animates there
   - No moving button between header/panel; no duplicates
   ────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  if (window.feather && typeof feather.replace === 'function') { try { feather.replace(); } catch {} }

  const siteHeader    = document.getElementById('siteHeader');
  const sidePanel     = document.getElementById('sidePanel');
  const backdrop      = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');   // header opener
  const themeToggle   = document.getElementById('themeToggle');
  const themeIcon     = document.getElementById('themeIcon');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  /* Ensure a single, permanent in-panel close button exists */
  let panelCloseBtn = document.getElementById('panelCloseBtn');
  if (!panelCloseBtn) {
    panelCloseBtn = document.createElement('button');
    panelCloseBtn.id = 'panelCloseBtn';
    panelCloseBtn.type = 'button';
    panelCloseBtn.setAttribute('aria-label', 'Close menu');
    panelCloseBtn.innerHTML = `
      <span class="line t"></span>
      <span class="line b"></span>
    `;
    sidePanel.appendChild(panelCloseBtn);
  }

  // Helper
  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  function openPanel() {
    // slide in the panel & fade backdrop
    sidePanel.classList.remove('-translate-x-full');
    backdrop.classList.add('opacity-50');
    siteHeader.classList.add('menu-open');

    // trigger in-panel animation (slides the close chip in & morphs to X)
    sidePanel.classList.add('is-open');

    // (Optional) reflect state on opener so you can style it if desired
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    // reverse in-panel animation (chip slides out, lines back to burger)
    sidePanel.classList.remove('is-open');

    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }

  // Wire up interactions
  menuToggleBtn.addEventListener('click', (e) => { e.preventDefault(); isOpen() ? closePanel() : openPanel(); });
  panelCloseBtn.addEventListener('click',  (e) => { e.preventDefault(); closePanel(); });
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closePanel(); });
  sidePanel.addEventListener('click', (e) => { if (e.target.closest('a')) closePanel(); });

  // Header scroll color swap
  const onScroll = () => { (window.scrollY > 10) ? siteHeader.classList.add('scrolled')
                                                 : siteHeader.classList.remove('scrolled'); };
  onScroll();
  window.addEventListener('scroll', onScroll);

  // Theme toggle (unchanged)
  const applyTheme = () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    if (themeIcon) themeIcon.src = isDark ? 'images/darkmode.png' : 'images/lightmode.png';
  };
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const next = !(localStorage.getItem('theme') === 'dark');
    localStorage.setItem('theme', next ? 'dark' : 'light');
    applyTheme();
  });
  applyTheme();

  // Initial state (hot reload safety)
  if (isOpen()) {
    backdrop.classList.add('opacity-50');
    siteHeader.classList.add('menu-open');
    sidePanel.classList.add('is-open');
  } else {
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');
    sidePanel.classList.remove('is-open');
  }
});
