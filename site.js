/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (full, stable)
   - Opens/closes the side menu
   - Header burger stays in header
   - Separate close (X) button is injected INSIDE #sidePanel
   - Backdrop click + ESC + nav-link close
   - Header color swap on scroll
   ────────────────────────────────────────────────────────────── */

(function () {
  const siteHeader    = document.getElementById('siteHeader');
  const sidePanel     = document.getElementById('sidePanel');
  const backdrop      = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  /* ---------- Inject a dedicated close button inside the panel ---------- */
  const panelCloseBtn = menuToggleBtn.cloneNode(true);
  panelCloseBtn.id = 'panelCloseBtn';
  panelCloseBtn.setAttribute('aria-label', 'Close menu');
  panelCloseBtn.setAttribute('aria-expanded', 'true');
  panelCloseBtn.classList.add('open'); // ensure it looks like an X
  panelCloseBtn.style.display = 'none'; // hidden until open
  sidePanel.appendChild(panelCloseBtn);

  /* ---------- Helpers ---------- */
  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  function openPanel() {
    sidePanel.classList.remove('-translate-x-full'); // slide in
    backdrop.classList.add('opacity-50');            // fade in backdrop
    siteHeader.classList.add('menu-open');           // lift header

    // Header burger becomes inert/hidden while menu is open
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    menuToggleBtn.classList.add('open');
    menuToggleBtn.style.visibility = 'hidden';
    menuToggleBtn.style.pointerEvents = 'none';

    // Show the in-panel close button
    panelCloseBtn.style.display = 'block';
    panelCloseBtn.classList.add('show'); // CSS display toggle
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

  /* ---------- Event wiring ---------- */
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isOpen()) closePanel(); else openPanel();
  });

  // Close via the in-panel X
  panelCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closePanel();
  });

  // Close on backdrop click
  backdrop.addEventListener('click', closePanel);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closePanel();
  });

  // Close after clicking any nav link inside the panel
  sidePanel.addEventListener('click', (e) => {
    if (e.target.closest('a')) closePanel();
  });

  /* ---------- Scroll styling (header color swap) ---------- */
  const onScroll = () => {
    if (window.scrollY > 10) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  /* ---------- Safety: if menu starts open (e.g., hot reload) ---------- */
  if (isOpen()) {
    // Ensure correct visibility on load
    menuToggleBtn.style.visibility = 'hidden';
    menuToggleBtn.style.pointerEvents = 'none';
    panelCloseBtn.style.display = 'block';
    panelCloseBtn.classList.add('show');
  }
})();
