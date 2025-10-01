/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (one button morphs & moves into the menu)
   - #menuToggleBtn opens/closes, morphs burger ⇄ X
   - On open: append button into #sidePanel (top-right), FLIP-animate from header
   - On close: FLIP back to header and append back
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

  // Remove any legacy in-panel close buttons (no duplicates)
  const oldClose = document.getElementById('panelCloseBtn');
  if (oldClose && oldClose.parentElement) oldClose.parentElement.removeChild(oldClose);

  const headerHome = menuToggleBtn.parentElement;
  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  /** FLIP: animate menuToggleBtn from its current rect to its rect after move() */
  function flipMove(move) {
    const start = menuToggleBtn.getBoundingClientRect();
    move();                                   // move in the DOM (header ⇄ panel)
    // force style + get new rect
    menuToggleBtn.offsetHeight;
    const end = menuToggleBtn.getBoundingClientRect();
    const dx = start.left - end.left;
    const dy = start.top  - end.top;
    // apply inverse, then animate to identity
    menuToggleBtn.classList.add('is-flipping');
    menuToggleBtn.style.transform = `translate(${dx}px, ${dy}px)`;
    requestAnimationFrame(() => {
      menuToggleBtn.style.transform = 'translate(0,0)';
    });
    menuToggleBtn.addEventListener('transitionend', function tidy() {
      menuToggleBtn.classList.remove('is-flipping');
      menuToggleBtn.style.transform = '';
      menuToggleBtn.removeEventListener('transitionend', tidy);
    });
  }

  function moveIntoPanel() {
    if (menuToggleBtn.parentElement !== sidePanel) sidePanel.appendChild(menuToggleBtn);
    // be sure it's clickable and above the panel
    menuToggleBtn.style.zIndex = '3000';
    menuToggleBtn.style.pointerEvents = 'auto';
  }

  function moveBackToHeader() {
    if (menuToggleBtn.parentElement !== headerHome) headerHome.appendChild(menuToggleBtn);
    menuToggleBtn.style.zIndex = '';
    menuToggleBtn.style.pointerEvents = '';
  }

  function openPanel() {
    // slide panel in + backdrop
    sidePanel.classList.remove('-translate-x-full');
    backdrop.classList.add('opacity-50');
    siteHeader.classList.add('menu-open');

    // morph burger → X (lines rotate)
    menuToggleBtn.setAttribute('aria-expanded', 'true');

    // FLIP move: header → panel (the button element itself moves)
    flipMove(moveIntoPanel);
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    // morph X → burger
    menuToggleBtn.setAttribute('aria-expanded', 'false');

    // FLIP move back: panel → header
    flipMove(moveBackToHeader);
  }

  // Toggle handler
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closePanel() : openPanel();
  });

  // Close on backdrop, ESC, or any link inside the panel
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

  // Initial (hot reload) state
  if (isOpen()) {
    // Ensure it lives in the panel and looks like an X
    flipMove(moveIntoPanel);
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    siteHeader.classList.add('menu-open');
  } else {
    flipMove(moveBackToHeader);
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    siteHeader.classList.remove('menu-open');
  }
});
