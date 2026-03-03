/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9ee',
          100: '#f9edca',
          200: '#f3da95',
          300: '#ecc25a',
          400: '#e6ac2e',
          500: '#c8941a',
          600: '#a87615',
          700: '#865c14',
          800: '#6d4a17',
          900: '#5b3d18',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          100: '#141414',
          200: '#1a1a1a',
          300: '#242424',
          400: '#2e2e2e',
        },
        cream: '#f5f0e8',
        maroon: '#6b0f1a',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'slide-up': 'slideUp 0.8s ease forwards',
        'slide-down': 'slideDown 0.5s ease forwards',
        'zoom-in': 'zoomIn 6s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(40px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(-40px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          from: { transform: 'scale(1.1)' },
          to: { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,148,26,0.4)' },
          '50%': { boxShadow: '0 0 20px 8px rgba(200,148,26,0.2)' },
        },
      },
    },
  },
  plugins: [],
};
