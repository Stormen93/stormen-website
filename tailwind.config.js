/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",                 // all root-level HTML files
    "./src/**/*.{html,js}",     // any HTML or JS inside src/
    "./js/**/*.{js}",           // your separate JS folder, if any
  ],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
};