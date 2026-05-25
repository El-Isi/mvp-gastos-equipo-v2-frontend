import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'konfio-bg': '#0A0A0F',
        'konfio-card': 'rgba(255,255,255,0.03)',
        'konfio-border': 'rgba(255,255,255,0.06)',
        'konfio-text': '#E8E6E3',
        'konfio-muted': '#636E72',
        'konfio-secondary': '#B2BEC3',
        'konfio-purple': '#6C5CE7',
        'konfio-purple-light': '#A29BFE',
        'konfio-green': '#00B894',
        'konfio-orange': '#E17055',
        'konfio-yellow': '#FDCB6E',
        'konfio-blue': '#0984E3',
        'konfio-gray': '#B2BEC3',
        'konfio-dark-card': '#14141F',
        'konfio-subtle': '#4A4A5A',
        'konfio-scrollbar': '#2D2D3A',
      },
      fontFamily: {
        sans: ["'DM Sans'", "'Segoe UI'", 'sans-serif'],
        mono: ["'Space Mono'", 'monospace'],
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.5s ease',
        slideUpFast: 'slideUp 0.3s ease',
        fadeIn: 'fadeIn 0.4s ease',
        fadeInFast: 'fadeIn 0.2s ease',
      },
    },
  },
  plugins: [],
};

export default config;
