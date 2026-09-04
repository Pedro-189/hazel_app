/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hazel: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#ff8787',
          500: '#ff6b6b',
          600: '#fa5252',
          700: '#e03131',
          800: '#c92a2a',
          900: '#a51d24',
        },
        cozy: {
          bg: '#FAF7F2',
          card: '#FFFFFF',
          border: '#EFE7DA',
          peach: '#FFDAC6',
          blush: '#FFB7B2',
          matcha: '#E2F0CB',
          lavender: '#E8DFF5',
          butter: '#FFF1C5',
          sky: '#D4F0F7',
          text: '#4A3E3D',
          muted: '#8A7E7D',
        }
      },
      fontFamily: {
        sans: ['"Quicksand"', '"Nunito"', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', '"Indie Flower"', 'cursive', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2.5s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
