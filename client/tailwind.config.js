import plugin from 'tailwindcss/plugin';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
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
  plugins: [
    forms,
    plugin(({ addUtilities }) => {
      addUtilities({
        '.scrollbar-fade': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent',
            borderRadius: '9999px',
            transition: 'background-color 0.3s ease',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(196, 106, 77, 0.28)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(196, 106, 77, 0.55)',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: 'transparent transparent',
          '&:hover': {
            scrollbarColor: 'rgba(196, 106, 77, 0.28) transparent',
          },
        },

        '.dark .scrollbar-fade': {
          '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(231, 111, 81, 0.32)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(231, 111, 81, 0.6)',
          },
          '&:hover': {
            scrollbarColor: 'rgba(231, 111, 81, 0.32) transparent',
          },
        },
      });
    }),
  ],
};