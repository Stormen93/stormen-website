/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (single-button version)
   - Only one button: #menuToggleBtn (burger ↔ X)
   - On open: place it inside the panel’s top-right and above it
   - On close: return to header’s top-left position
   - Header stays fixed; scroll color swap preserved
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

  /* Remove any legacy in-panel X if present (we only use one button) */
  const legacyClose = document.getElementById('panelCloseBtn');
  if (legacyClose && legacyClose.parentElement) legacyClose.parentElement.removeChild(legacyClose);

  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  function moveButtonIntoPanelTopRight() {
    // Compute exact pixel position for top-right inside the visible panel
    const rect = sidePanel.getBoundingClientRect();
    const btnW = menuToggleBtn.offsetWidth || 44;
    const left = rect.left + rect.width - 16 - btnW; // 16px panel padding from right
    menuToggleBtn.style.position = 'fixed';
    menuToggleBtn.style.left     = `${left}px`;
    menuToggleBtn.style.top      = '16px';
    menuToggleBtn.style.zIndex   = '2200'; // above the panel
  }

  function resetButtonToHeader() {
    // Return to default header placement (CSS handles left/top)
    menuToggleBtn.style.position = '';
    menuToggleBtn.style.left     = '';
    menuToggleBtn.style.top      = '';
    menuToggleBtn.style.zIndex   = '';
  }

  function openPanel() {
    // Update CSS variable for potential CSS consumers (not required, but nice)
    document.documentElement.style.setProperty('--panel-w', sidePanel.offsetWidth + 'px');

    sidePanel.classList.remove('-translate-x-full');  // slide in
    backdrop.classList.add('opacity-50');             // fade in overlay
    siteHeader.classList.add('menu-open');            // let panel overtake header z-index

    // Move the existing button inside the panel, top-right, and above it
    moveButtonIntoPanelTopRight();

    // Trigger burger→X morph (also a CSS hook)
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    // Return button to header default spot
    resetButtonToHeader();

    // Reset morph
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }

  // Toggle
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closePanel() : openPanel();
  });

  // Backdrop / ESC / nav link close
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closePanel(); });
  sidePanel.addEventListener('click', (e) => { if (e.target.closest('a')) closePanel(); });

  // Recompute position if the user resizes while open
  window.addEventListener('resize', () => { if (isOpen()) moveButtonIntoPanelTopRight(); });

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
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = !(localStorage.getItem('theme') === 'dark');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      applyTheme();
    });
  }
  applyTheme();

  // Initial state (hot reload, SSR hydration, etc.)
  if (isOpen()) {
    moveButtonIntoPanelTopRight();
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    siteHeader.classList.add('menu-open');
  } else {
    resetButtonToHeader();
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    siteHeader.classList.remove('menu-open');
  }
});
