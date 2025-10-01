/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (single toggle button that follows the panel)
   - One button (#menuToggleBtn) morphs burger ↔ X
   - On open: button follows the panel’s right edge (top-right inside)
   - On close: returns to header position
   - Always on top & clickable
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

  // Remove any legacy in-panel button if present (we only use one button)
  const stale = document.getElementById('panelCloseBtn');
  if (stale && stale.parentElement) stale.parentElement.removeChild(stale);

  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  /* ---- Keep the button pinned to the panel’s top-right while it slides ---- */
  let followRAF = null;
  const positionToPanelTopRight = () => {
    const rect = sidePanel.getBoundingClientRect();
    const btnW = menuToggleBtn.offsetWidth || 44;
    const left = rect.left + rect.width - 16 - btnW; // 16px in-panel padding
    menuToggleBtn.style.position = 'fixed';
    menuToggleBtn.style.left     = `${left}px`;
    menuToggleBtn.style.top      = `16px`;
    menuToggleBtn.style.zIndex   = '3000';           // above panel & header
    menuToggleBtn.style.pointerEvents = 'auto';
  };
  const startFollowing = () => {
    cancelFollowing();
    const t0 = performance.now();
    const step = (t) => {
      positionToPanelTopRight();
      // follow panel for the slide duration (~300ms) + buffer
      if (t - t0 < 420) followRAF = requestAnimationFrame(step);
      else followRAF = null;
    };
    followRAF = requestAnimationFrame(step);
  };
  const cancelFollowing = () => {
    if (followRAF) { cancelAnimationFrame(followRAF); followRAF = null; }
  };

  const resetButtonToHeader = () => {
    menuToggleBtn.style.position = '';
    menuToggleBtn.style.left     = '';
    menuToggleBtn.style.top      = '';
    menuToggleBtn.style.zIndex   = '';
    menuToggleBtn.style.pointerEvents = '';
  };

  function openPanel() {
    // update CSS var for accuracy, if anything else reads it
    document.documentElement.style.setProperty('--panel-w', sidePanel.offsetWidth + 'px');

    sidePanel.classList.remove('-translate-x-full');  // slide in
    backdrop.classList.add('opacity-50');             // overlay
    siteHeader.classList.add('menu-open');            // header yields to panel

    // morph burger → X and follow the panel’s edge
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    positionToPanelTopRight();
    startFollowing();
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    cancelFollowing();
    resetButtonToHeader();

    // reset burger state
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }

  // Toggle
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closePanel() : openPanel();
  });

  // Close on backdrop / ESC / nav link
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closePanel(); });
  sidePanel.addEventListener('click', (e) => { if (e.target.closest('a')) closePanel(); });

  // If the user resizes while open, keep the button pinned
  window.addEventListener('resize', () => { if (isOpen()) { positionToPanelTopRight(); startFollowing(); } });

  // Header scroll color swap
  const onScroll = () => {
    if (window.scrollY > 10) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  };
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

  // Initial state
  if (isOpen()) {
    siteHeader.classList.add('menu-open');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    positionToPanelTopRight();
    startFollowing();
  } else {
    siteHeader.classList.remove('menu-open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    resetButtonToHeader();
  }
});
