/** @type {import('tailwindcss').Config} */
export default {
  // Scan all JS/JSX files inside src/ for class names
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // Custom colour palette for the project
      colors: {
        brand: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626',  // Primary Accent (Red)
          600: '#ef4444',  // Secondary Accent (Red)
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        dark: {
          bg: '#0A0A0A',
          sec: '#111111',
          card: '#181818',
          border: '#2A2A2A',
          textPri: '#FFFFFF',
          textSec: '#B3B3B3',
        },
      },

      // Custom font families (loaded via index.html <link>)
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      // Smooth animation durations
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
    },
  },

  plugins: [],
}
