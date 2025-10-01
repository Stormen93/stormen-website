/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (full, stable)
   - Opens/closes the side menu
   - Header burger stays in header
   - Separate close (X) button is injected INSIDE #sidePanel
   - Backdrop click + ESC + nav-link close
   - Header color swap on scroll
   ────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  /* Feather icons (safe if not loaded) */
  if (window.feather && typeof feather.replace === 'function') {
    try { feather.replace(); } catch {}
  }

  /* Elements */
  const siteHeader    = document.getElementById('siteHeader');
  const sidePanel     = document.getElementById('sidePanel');
  const backdrop      = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const themeToggle   = document.getElementById('themeToggle');
  const themeIcon     = document.getElementById('themeIcon');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  /* --------- Inject a dedicated close button inside the panel --------- */
  const panelCloseBtn = document.createElement('button');
  panelCloseBtn.id = 'panelCloseBtn';
  panelCloseBtn.type = 'button';
  panelCloseBtn.setAttribute('aria-label', 'Close menu');
  panelCloseBtn.className = ''; // CSS handles look/position

  // Two lines for the "X"
  panelCloseBtn.innerHTML = '<span class="burger-line"></span><span class="burger-line lower"></span>';
  sidePanel.appendChild(panelCloseBtn);

  // Make it look like an X
  panelCloseBtn.classList.add('open');

  /* --------- Menu state helpers --------- */
  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  function openPanel() {
    sidePanel.classList.remove('-translate-x-full');  // slide in (Tailwind handles transform)
    backdrop.classList.add('opacity-50');             // fade in backdrop
    siteHeader.classList.add('menu-open');            // lift header

    // Header burger becomes inert/hidden while menu is open (optional but tidy)
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    menuToggleBtn.classList.add('open');
    menuToggleBtn.style.visibility = 'hidden';
    menuToggleBtn.style.pointerEvents = 'none';

    // Show the in-panel close button
    panelCloseBtn.style.display = 'block';
    panelCloseBtn.classList.add('show');
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    // Restore header burger
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    menuToggleBtn.classList.remove('open');
    menuToggleBtn.style.visibility = '';
    menuToggleBtn.style.pointerEvents = '';

    // Hide the in-panel close button
    panelCloseBtn.classList.remove('show');
    panelCloseBtn.style.display = 'none';
  }

  /* --------- Wire up interactions --------- */
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isOpen()) closePanel(); else openPanel();
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
    menuToggleBtn.style.visibility = 'hidden';
    menuToggleBtn.style.pointerEvents = 'none';
    panelCloseBtn.style.display = 'block';
    panelCloseBtn.classList.add('show');
  }
});
