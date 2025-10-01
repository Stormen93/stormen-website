/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (full)
   - Opens/closes the side menu
   - Moves the toggle button INSIDE #sidePanel on open
   - Returns it to the header on close
   - Backdrop click + ESC + nav-link close
   - Header color swap on scroll
   ────────────────────────────────────────────────────────────── */

(function () {
  const siteHeader    = document.getElementById('siteHeader');
  const sidePanel     = document.getElementById('sidePanel');
  const backdrop      = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  // Remember the original home (header child) to restore later
  const originalParent = menuToggleBtn.parentElement;

  // --- Helpers: move button into panel / back to header ---
  function moveBtnIntoPanel() {
    if (menuToggleBtn.parentElement !== sidePanel) {
      sidePanel.appendChild(menuToggleBtn);
    }
    menuToggleBtn.classList.add('open');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function moveBtnBackToHeader() {
    if (menuToggleBtn.parentElement !== originalParent) {
      originalParent.appendChild(menuToggleBtn);
    }
    menuToggleBtn.classList.remove('open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }

  // --- Menu state ---
  function isOpen() {
    return !sidePanel.classList.contains('-translate-x-full');
  }

  function openPanel() {
    sidePanel.classList.remove('-translate-x-full');  // slide in (Tailwind handles transform)
    backdrop.classList.add('opacity-50');             // fade in backdrop
    siteHeader.classList.add('menu-open');            // lift header z-index
    moveBtnIntoPanel();                               // park X inside panel
    // Optional: lock scroll
    // document.documentElement.style.overflow = 'hidden';
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');
    moveBtnBackToHeader();
    // document.documentElement.style.overflow = '';
  }

  // --- Toggle click ---
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isOpen()) closePanel(); else openPanel();
  });

  // --- Close interactions ---
  backdrop.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closePanel();
  });

  // Close after clicking any nav link inside the panel
  sidePanel.addEventListener('click', (e) => {
    if (e.target.closest('a')) closePanel();
  });

  // --- Scroll styling (header color swap) ---
  const onScroll = () => {
    if (window.scrollY > 10) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  // --- Safety net: if some other code toggles the panel class, keep X in sync ---
  const obs = new MutationObserver(() => {
    if (isOpen()) moveBtnIntoPanel(); else moveBtnBackToHeader();
  });
  obs.observe(sidePanel, { attributes: true, attributeFilter: ['class'] });

  // Run once on load in case panel starts open (e.g., on wide screens or hot reload)
  if (isOpen()) moveBtnIntoPanel();
})();
