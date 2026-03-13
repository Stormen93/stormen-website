document.addEventListener('DOMContentLoaded', () => {
  if (window.feather && typeof feather.replace === 'function') {
    try { feather.replace(); } catch {}
  }

  const siteHeader = document.getElementById('siteHeader');
  const sidePanel = document.getElementById('sidePanel');
  const backdrop = document.getElementById('backdrop');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  if (!siteHeader || !sidePanel || !backdrop || !menuToggleBtn) return;

  const oldClose = document.getElementById('panelCloseBtn');
  if (oldClose && oldClose.parentElement) oldClose.parentElement.removeChild(oldClose);

  const headerHome = menuToggleBtn.parentElement;
  const isOpen = () => !sidePanel.classList.contains('-translate-x-full');

  function setMenuState(open) {
    menuToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function flipMove(move) {
    const start = menuToggleBtn.getBoundingClientRect();
    move();
    menuToggleBtn.offsetHeight;
    const end = menuToggleBtn.getBoundingClientRect();
    const dx = start.left - end.left;
    const dy = start.top - end.top;

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
    menuToggleBtn.style.zIndex = '3000';
    menuToggleBtn.style.pointerEvents = 'auto';
  }

  function moveBackToHeader() {
    if (menuToggleBtn.parentElement !== headerHome) headerHome.appendChild(menuToggleBtn);
    menuToggleBtn.style.zIndex = '';
    menuToggleBtn.style.pointerEvents = '';
  }

  function openPanel() {
    sidePanel.classList.remove('-translate-x-full');
    backdrop.classList.add('opacity-50');
    siteHeader.classList.add('menu-open');
    setMenuState(true);
    flipMove(moveIntoPanel);
  }

  function closePanel() {
    sidePanel.classList.add('-translate-x-full');
    backdrop.classList.remove('opacity-50');
    siteHeader.classList.remove('menu-open');
    setMenuState(false);
    flipMove(moveBackToHeader);
  }

  menuToggleBtn.addEventListener('click', (event) => {
    event.preventDefault();
    isOpen() ? closePanel() : openPanel();
  });

  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) closePanel();
  });
  sidePanel.addEventListener('click', (event) => {
    if (event.target.closest('a')) closePanel();
  });

  const onScroll = () => {
    if (window.scrollY > 10) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  };

  onScroll();
  window.addEventListener('scroll', onScroll);

  const applyTheme = () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    if (themeIcon) {
      themeIcon.src = isDark ? 'images/darkmode.png' : 'images/lightmode.png';
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = localStorage.getItem('theme') !== 'dark';
      localStorage.setItem('theme', next ? 'dark' : 'light');
      applyTheme();
    });
  }

  applyTheme();

  if (isOpen()) {
    moveIntoPanel();
    setMenuState(true);
    siteHeader.classList.add('menu-open');
  } else {
    moveBackToHeader();
    setMenuState(false);
    siteHeader.classList.remove('menu-open');
  }
});
