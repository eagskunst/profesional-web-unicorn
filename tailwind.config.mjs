import * as typographyModule from '@tailwindcss/typography';

const typography = typographyModule.default || typographyModule;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          bg: '#001522',
          surface: '#233D4D',
          'on-surface': '#cbe6fb',
          primary: '#ffffff',
          'primary-container': '#e8eb1c',
          'on-primary-fixed': '#1c1d00',
          'primary-fixed-dim': '#cbce00',
          'surface-container-highest': '#1d3847',
          'surface-container-lowest': '#00101a',
          'surface-variant': '#1d3847',
          'tertiary-container': '#84f6e6',
          'tertiary-fixed-dim': '#66d9ca',
          'on-surface-variant': '#cac8ac',
        },
      },
      fontFamily: {
        geist: ['Ubuntu', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [typography],
};
