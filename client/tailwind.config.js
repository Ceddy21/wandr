/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'warm-white': '#f7f7f5',
        'off-white': '#f0f0eb',
        'warm-grey': '#4a4a47',
        'deep-charcoal': '#1c1c1a',
        'terracotta': '#c46a4d',
        'terracotta-hover': '#a85339',
        'terracotta-soft': '#f0e2db',
        'dark-bg': '#141412',
        'dark-card': '#1e1e1b',
        'dark-border': '#33332e',
        'dark-text': '#ebebe6',
        'dark-text-secondary': '#b5b5ae',
        'dark-terracotta': '#dc8b6e',
        'dark-terracotta-soft': '#3a2822',
      },
    },
  },
  plugins: [],
}