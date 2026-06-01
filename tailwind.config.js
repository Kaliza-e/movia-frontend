/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          light: '#8B85FF',
          dark: '#5A52E0',
        },
        secondary: {
          DEFAULT: '#4F8EF7',
          light: '#74A9FF',
          dark: '#3A76E0',
        },
        accent: {
          DEFAULT: '#6C63FF',
          light: '#EEF0FF',
        },
        background: '#EEF0FF',
        surface: '#FFFFFF',
        muted: '#F3F4F6',
        border: '#E5E7EB',
        text: {
          DEFAULT: '#1A1A2E',
          muted: '#6B7280',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'pill': '999px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(108, 99, 255, 0.07)',
        'card-hover': '0 8px 32px rgba(108, 99, 255, 0.13)',
        'input-focus': '0 0 0 3px rgba(108, 99, 255, 0.15)',
      },
      animation: {
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'float-medium': 'floatSlow 3s ease-in-out infinite',
        'float-fast': 'floatSlow 2s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
