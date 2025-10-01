/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./src/**/*.{html,js}",
    "./js/**/*.{js}",          // whatever folders hold your JS/templates
  ],

  safelist: [
    // visibility helpers
    "hidden", "block",
    // opacity helpers (base + group-hover variants)
    {
      pattern: /(opacity|scale)-(0|100)/,
      variants: ["group-hover"],
    },
    // z-index / transition you used in the cards
    "z-10", "transition-opacity", "duration-300",
  ],

  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
};