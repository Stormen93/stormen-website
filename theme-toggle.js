
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const toggleBtn = document.getElementById('themeToggle');
  const icon      = document.getElementById('themeIcon');
  const root      = document.documentElement;
  const sunIcon   = 'images/lightmode.png';
  const moonIcon  = 'images/darkmode.png';

  function renderIcon() {
    icon.src = root.classList.contains('dark') ? moonIcon : sunIcon;
    if (window.scrollY <= 10) {
      icon.style.filter = 'invert(100%)';
    }
  }

  if (localStorage.getItem('theme') === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  renderIcon();

  toggleBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    renderIcon();
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      icon.style.filter = 'none';
    } else {
      icon.style.filter = 'invert(100%)';
    }
  });

  // Burger menu
  const openMenuBtn = document.getElementById('openMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const panel = document.getElementById('sidePanel');
  const backdrop = document.getElementById('backdrop');
  const hdr = document.getElementById('siteHeader');

  if (openMenuBtn && closeMenuBtn && panel && backdrop && hdr) {
    openMenuBtn.addEventListener('click', () => {
      panel.style.visibility = 'visible';
      panel.classList.remove('-translate-x-full');
      backdrop.classList.remove('pointer-events-none', 'opacity-0');
      backdrop.classList.add('opacity-50');
      closeMenuBtn.classList.add('open');
      openMenuBtn.style.display = 'none';
      closeMenuBtn.style.display = 'block';
    });
    closeMenuBtn.addEventListener('click', () => {
      panel.classList.add('-translate-x-full');
      setTimeout(() => { panel.style.visibility = 'hidden'; }, 300);
      backdrop.classList.add('pointer-events-none', 'opacity-0');
      backdrop.classList.remove('opacity-50');
      closeMenuBtn.classList.remove('open');
      openMenuBtn.style.display = 'block';
      closeMenuBtn.style.display = 'none';
    });
    backdrop.addEventListener('click', () => {
      closeMenuBtn.click();
    });
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !openMenuBtn.contains(e.target) && !panel.classList.contains('-translate-x-full')) {
        closeMenuBtn.click();
      }
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) hdr.classList.add('scrolled');
      else hdr.classList.remove('scrolled');
    });
  }
});
