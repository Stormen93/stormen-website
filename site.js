// site.js
document.addEventListener('DOMContentLoaded', () => {
  // Feather Icons
  if (window.feather) feather.replace();

  // Elements
  const root = document.documentElement;
  const hdr  = document.getElementById('siteHeader');
  const openBtn = document.getElementById('openMenuBtn');
  const closeBtn = document.getElementById('closeMenuBtn');
  const panel = document.getElementById('sidePanel');
  const backdrop = document.getElementById('backdrop');
  const toggleBtn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');

  // Theme-toggle icons
  const sunIcon = 'images/lightmode.png';
  const moonIcon = 'images/darkmode.png';

  function renderIcon() {
    icon.src = root.classList.contains('dark') ? moonIcon : sunIcon;
    if (window.scrollY <= 10) icon.style.filter = 'invert(100%)';
  }

  // Initialize theme
  if (localStorage.getItem('theme') === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  renderIcon();

  // Toggle theme
  toggleBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    renderIcon();
  });

  // Scroll listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      hdr.classList.add('scrolled');
      icon.style.filter = 'none';
    } else {
      hdr.classList.remove('scrolled');
      icon.style.filter = 'invert(100%)';
    }
  });

  // Burger panel
  function openPanel() {
    panel.style.visibility = 'visible';
    panel.classList.remove('-translate-x-full');
    backdrop.classList.remove('pointer-events-none','opacity-0');
    backdrop.classList.add('opacity-50');
    closeBtn.classList.add('open');
    openBtn.style.display = 'none';
    closeBtn.style.display = 'block';
    feather.replace();
  }
  function closePanel() {
    panel.classList.add('-translate-x-full');
    setTimeout(()=>panel.style.visibility='hidden',300);
    backdrop.classList.add('pointer-events-none','opacity-0');
    closeBtn.classList.remove('open');
    openBtn.style.display = 'block';
    closeBtn.style.display = 'none';
  }
  openBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !openBtn.contains(e.target) && !panel.classList.contains('-translate-x-full')) {
      closePanel();
    }
  });
});
