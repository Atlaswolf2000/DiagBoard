/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lab: {
          950: 'var(--lab-950)',
          900: 'var(--lab-900)',
          850: 'var(--lab-850)',
          800: 'var(--lab-800)',
          700: 'var(--lab-700)',
          600: 'var(--lab-600)',
        },
        ink: {
          50: 'var(--ink-50)',
          100: 'var(--ink-100)',
          200: 'var(--ink-200)',
          300: 'var(--ink-300)',
          400: 'var(--ink-400)',
          500: 'var(--ink-500)',
        },
        accent: {
          cyan: 'var(--accent-cyan)',
          amber: 'var(--accent-amber)',
          emerald: 'var(--accent-emerald)',
          rose: 'var(--accent-rose)',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
      },
    },
  },
  plugins: [],
}
