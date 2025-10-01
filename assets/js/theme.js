
// Apply saved theme ASAP
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();

// Toggle function
function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  var next = current === 'light' ? 'dark' : 'light';
  document.documentElement.classList.toggle('theme-light', next === 'light');
  document.documentElement.classList.toggle('theme-dark', next === 'dark');
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch(e) {}
  // Update toggle label/icon if present
  var t = document.querySelector('[data-theme-toggle]');
  if (t) t.setAttribute('aria-label', 'Switch to ' + (next === 'light' ? 'dark' : 'light') + ' mode');
}
window.addEventListener('DOMContentLoaded', function() {
  var t = document.querySelector('[data-theme-toggle]');
  if (t) t.addEventListener('click', toggleTheme);
});
