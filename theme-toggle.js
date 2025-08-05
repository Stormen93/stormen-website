document.addEventListener('DOMContentLoaded', () => {
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

  // Initial theme setup (default = light)
  if (localStorage.getItem('theme') === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  renderIcon();

  // Toggle on click
  toggleBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    renderIcon();
  });

  // Scroll-based icon filter
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      icon.style.filter = 'none';
    } else {
      icon.style.filter = 'invert(100%)';
    }
  });
});