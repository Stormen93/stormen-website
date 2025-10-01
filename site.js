// site.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Feather Icons ---
  if (window.feather) {
    feather.replace();
  }

  // --- Element Selectors ---
  const root = document.documentElement;
  const siteHeader = document.getElementById('siteHeader');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidePanel = document.getElementById('sidePanel');
  const backdrop = document.getElementById('backdrop');
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // --- Theme Toggling ---
  const sunIcon = 'images/lightmode.png';
  const moonIcon = 'images/darkmode.png';

  const applyTheme = () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    root.classList.toggle('dark', isDark);
    themeIcon.src = isDark ? moonIcon : sunIcon;
  };

  themeToggleBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme();
  });

  // --- Header Scroll Effect ---
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });


  // --- Side Panel & Menu Animation ---
  const openPanel = () => {
    // Animate burger icon to 'X'
    menuToggleBtn.classList.add('open');
    
    // Make panel visible and slide it in
    sidePanel.style.visibility = 'visible';
    sidePanel.classList.remove('-translate-x-full');
    
    // Show backdrop
    backdrop.classList.add('opacity-50');
    backdrop.classList.remove('pointer-events-none');
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closePanel = () => {
    // Animate 'X' back to burger icon
    menuToggleBtn.classList.remove('open');
    
    // Slide panel out
    sidePanel.classList.add('-translate-x-full');
    
    // Hide backdrop
    backdrop.classList.remove('opacity-50');
    backdrop.classList.add('pointer-events-none');
    
    // Restore background scrolling
    document.body.style.overflow = '';
    
    // Hide the panel from screen readers after animation
    setTimeout(() => {
        if (sidePanel.classList.contains('-translate-x-full')) {
             sidePanel.style.visibility = 'hidden';
        }
    }, 300); // Must match CSS transition duration
  };
  
  // --- Event Listeners for Panel ---
  menuToggleBtn.addEventListener('click', () => {
    const isPanelOpen = !sidePanel.classList.contains('-translate-x-full');
    if (isPanelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  backdrop.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sidePanel.classList.contains('-translate-x-full')) {
      closePanel();
    }
  });
  
  // Initialize theme on page load
  applyTheme();
});
