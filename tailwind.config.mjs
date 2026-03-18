/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', '"DM Sans"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0f0f0f',
          50: '#f5f5f4',
          100: '#e8e8e6',
          200: '#d1d1ce',
          300: '#a8a8a3',
          400: '#787872',
          500: '#5a5a55',
          600: '#3d3d39',
          700: '#292926',
          800: '#1a1a18',
          900: '#0f0f0f',
        },
        signal: {
          green: '#16a34a',
          yellow: '#ca8a04',
          red: '#dc2626',
          blue: '#2563eb',
        },
        accent: '#e8ff5a',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
