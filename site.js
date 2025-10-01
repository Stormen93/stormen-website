/* ──────────────────────────────────────────────────────────────
   Stormen — site.js
   - Opens/closes the side menu
   - Header burger stays in header
   - Separate close (X) button INSIDE #sidePanel
   - Backdrop click + ESC + nav-link close
   - Header color swap on scroll
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

  /* --------- Create a dedicated close button inside the panel --------- */
  const panelCloseBtn = document.createElement('button');
  panelCloseBtn.id = 'panelCloseBtn';
  panelCloseBtn.type = 'button';
  panelCloseBtn.setAttribute('aria-label', 'Close menu');
  panelCloseBtn.innerHTML = '<span class="burger-line"></span><span class="burger-line lower"></span>';
  sidePanel.appendChild(panelCloseBtn);

  /* --------- State helpers --------- */
  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

function openPanel() {
  sidePanel.classList.remove('-translate-x-full');  // slide in
  backdrop.classList.add('opacity-50');
  siteHeader.classList.add('menu-open');

  menuToggleBtn.setAttribute('aria-expanded', 'true');

  // show the in-panel close button
  panelCloseBtn.classList.add('show');
  panelCloseBtn.style.pointerEvents = 'auto';

  sidePanel.classList.add('open');                 // <— ADD THIS (enables X slide-in)
}

  function closePanel() {
  sidePanel.classList.add('-translate-x-full');
  backdrop.classList.remove('opacity-50');
  siteHeader.classList.remove('menu-open');

  menuToggleBtn.setAttribute('aria-expanded', 'false');

  panelCloseBtn.classList.remove('show');
  panelCloseBtn.style.display = 'none'; // (if you keep this line in your file)

  sidePanel.classList.remove('open');              // <— ADD THIS
}

  /* --------- Wire up interactions --------- */
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closePanel() : openPanel();
  });

  panelCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Guard: if something above is catching clicks, this still runs
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

  /* --------- Header scroll color swap --------- */
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

  /* --------- Safety: if menu starts open (hot reload etc.) --------- */
  if (isOpen()) {
    panelCloseBtn.classList.add('show');
    panelCloseBtn.style.pointerEvents = 'auto';
  }
});
