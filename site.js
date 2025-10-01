/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (move the ONE button into the panel)
   ────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // feather icons (safe if missing)
  if (window.feather && typeof feather.replace === 'function') { try { feather.replace(); } catch {} }

  const siteHeader    = document.getElementById('siteHeader');
  const sidePanel     = document.getElementById('sidePanel');
  const backdrop      = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const themeToggle   = document.getElementById('themeToggle');
  const themeIcon     = document.getElementById('themeIcon');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  // Remove any old in-panel close button
  const stale = document.getElementById('panelCloseBtn');
  if (stale && stale.parentElement) stale.parentElement.removeChild(stale);

  // Remember where the button lives by default (header)
  const buttonHome = menuToggleBtn.parentElement;

  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  function moveBtnIntoPanel() {
    if (menuToggleBtn.parentElement !== sidePanel) {
      sidePanel.appendChild(menuToggleBtn);
    }
    // ensure clickability & cursor (in case previous styles linger)
    menuToggleBtn.style.pointerEvents = 'auto';
    menuToggleBtn.style.cursor = 'pointer';
  }

  function moveBtnBackToHeader() {
    if (menuToggleBtn.parentElement !== buttonHome) {
      buttonHome.appendChild(menuToggleBtn);
    }
    // clear any inline overrides
    menuToggleBtn.style.pointerEvents = '';
    menuToggleBtn.style.cursor = '';
  }

  function openPanel() {
    sidePanel.classList.remove('-translate-x-full');  // slide in
    backdrop.classList.add('opacity-50');
    siteHeader.classList.add('menu-open');

    // move the SAME button into the panel (top-right via CSS)
    moveBtnIntoPanel();

    // trigger burger → X morph (and color change)
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    // put the button back into the header
    moveBtnBackToHeader();

    // reset burger
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }

  // Toggle
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closePanel() : openPanel();
  });

  // Close interactions
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closePanel(); });
  sidePanel.addEventListener('click', (e) => { if (e.target.closest('a')) closePanel(); });

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

  // Initial state / hot reload safety
  if (isOpen()) {
    moveBtnIntoPanel();
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    siteHeader.classList.add('menu-open');
  } else {
    moveBtnBackToHeader();
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    siteHeader.classList.remove('menu-open');
  }
});
