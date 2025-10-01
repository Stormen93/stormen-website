/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (single toggle + FLIP slide)
   - One button (#menuToggleBtn) morphs burger ↔ X
   - On open: DOM is moved into panel and we FLIP-animate from header → panel
   - On close: FLIP back from panel → header
   - Header stays fixed; backdrop/esc/link close preserved
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

  // Remove any legacy in-panel close button (we only use #menuToggleBtn)
  const stale = document.getElementById('panelCloseBtn');
  if (stale && stale.parentElement) stale.parentElement.removeChild(stale);

  const homeParent = menuToggleBtn.parentElement; // header container
  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  // FLIP helper: animate menuToggleBtn from its previous rect to its new rect
  function flipToNewPlace(moveDOMCallback) {
    const startRect = menuToggleBtn.getBoundingClientRect();

    // Move the element in the DOM (header → panel, or panel → header)
    moveDOMCallback();

    // Force style application before measuring end rect
    menuToggleBtn.offsetHeight; // reflow
    const endRect = menuToggleBtn.getBoundingClientRect();

    // Compute delta between positions
    const dx = startRect.left - endRect.left;
    const dy = startRect.top  - endRect.top;

    // Apply inverse transform, then animate back to identity
    menuToggleBtn.style.transform = `translate(${dx}px, ${dy}px)`;
    // Trigger transition
    menuToggleBtn.classList.add('animating');
    requestAnimationFrame(() => {
      menuToggleBtn.style.transform = 'translate(0, 0)';
    });

    // Clean up after transition
    const clear = () => {
      menuToggleBtn.classList.remove('animating');
      menuToggleBtn.style.transform = '';
      menuToggleBtn.removeEventListener('transitionend', clear);
    };
    menuToggleBtn.addEventListener('transitionend', clear);
  }

  function moveIntoPanel() {
    if (menuToggleBtn.parentElement !== sidePanel) {
      sidePanel.appendChild(menuToggleBtn);
    }
    // Ensure it stays clickable and on top
    menuToggleBtn.style.pointerEvents = 'auto';
    menuToggleBtn.style.zIndex = '3000';
  }

  function moveBackToHeader() {
    if (menuToggleBtn.parentElement !== homeParent) {
      homeParent.appendChild(menuToggleBtn);
    }
    menuToggleBtn.style.pointerEvents = '';
    menuToggleBtn.style.zIndex = '';
  }

  function openPanel() {
    // Slide panel in
    sidePanel.classList.remove('-translate-x-full');
    backdrop.classList.add('opacity-50');
    siteHeader.classList.add('menu-open');

    // Burger → X (also changes color in CSS)
    menuToggleBtn.setAttribute('aria-expanded', 'true');

    // FLIP: header → panel (button lands at top-right inside, lower at 24px)
    flipToNewPlace(moveIntoPanel);
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');

    // X → burger
    menuToggleBtn.setAttribute('aria-expanded', 'false');

    // FLIP: panel → header (button returns to top-left inside header)
    flipToNewPlace(moveBackToHeader);
  }

  // Toggle
  menuToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen() ? closePanel() : openPanel();
  });

  // Close behaviors
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closePanel(); });
  sidePanel.addEventListener('click', (e) => { if (e.target.closest('a')) closePanel(); });

  // Keep header color swap
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

  // Initial state / hot reload
  if (isOpen()) {
    // Ensure it lives in the panel and looks like an X
    flipToNewPlace(moveIntoPanel);
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    siteHeader.classList.add('menu-open');
  } else {
    flipToNewPlace(moveBackToHeader);
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    siteHeader.classList.remove('menu-open');
  }
});
