/* ──────────────────────────────────────────────────────────────
   Stormen — site.js (full)
   - Handles menu open/close
   - Moves the toggle button into #sidePanel on open
     and returns it to the header on close
   - Keeps ARIA state and keyboard / backdrop behavior
   ────────────────────────────────────────────────────────────── */

(function () {
  // Elements
  const siteHeader    = document.getElementById('siteHeader');
  const sidePanel     = document.getElementById('sidePanel');
  const backdrop      = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  // Original parent (header) to restore the button later
  const originalParent = menuToggleBtn.parentElement;

  // Helpers: move button into panel / back to header
  function moveBtnIntoPanel() {
    if (menuToggleBtn.parentElement !== sidePanel) {
      sidePanel.appendChild(menuToggleBtn);
    }
    menuToggleBtn.classList.add('in-panel', 'open');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function moveBtnBackToHeader() {
    if (menuToggleBtn.parentElement !== originalParent) {
      originalParent.appendChild(menuToggleBtn);
    }
    menuToggleBtn.classList.remove('in-panel', 'open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }

  // Open / Close
  function openPanel() {
    // Slide panel in
    sidePanel.classList.remove('-translate-x-full');
    // Fade in backdrop
    backdrop.classList.add('opacity-50');
    // Lift header for safe stacking
    siteHeader.classList.add('menu-open');
    // Move the button into the panel’s top-right
    moveBtnIntoPanel();
    // Prevent body scroll if you like (uncomment if needed)
    // document.documentElement.style.overflow = 'hidden';
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');
    moveBtnBackToHeader();
    // document.documentElement.style.overflow = '';
  }

  function isOpen() {
    return !sidePanel.classList.contains('-translate-x-full');
  }

  // Toggle handler
  function handleToggleClick(e) {
    e.preventDefault();
    if (isOpen()) {
      closePanel();
    } else {
      openPanel();
    }
  }

  // Close on backdrop click
  backdrop.addEventListener('click', closePanel);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closePanel();
  });

  // Close after clicking a nav link inside the panel
  sidePanel.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) closePanel();
  });

  // Main toggle button
  menuToggleBtn.addEventListener('click', handleToggleClick);

  // Optional: update header color on scroll (if you’re swapping logos/colors)
  const onScroll = () => {
    if (window.scrollY > 10) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  // Expose for debugging if needed
  window.__stormenMenu = { openPanel, closePanel };
})();
