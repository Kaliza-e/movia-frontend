/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#60A5FA',
          light: '#93C5FD',
          dark: '#3B82F6',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#111827',
          muted: '#6B7280',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      borderRadius: {
        'card': '24px',
        'button': '999px',
      },
      boxShadow: {
        'card': '0 10px 40px rgba(0,0,0,0.05)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.08)',
      },
      animation: {
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'float-medium': 'floatSlow 3s ease-in-out infinite',
        'float-fast': 'floatSlow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      letterSpacing: {
        'tight': '-0.04em',
      },
      lineHeight: {
        'tight': '1.05',
      },
    },
  },
  plugins: [],
}