/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      textGradient: {
        primary: 'bg-gradient-to-r from-gray-500 to-blue-400 bg-clip-text text-transparent',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          '@apply bg-gradient-to-r from-gray-500 to-blue-400 bg-clip-text text-transparent': {},
        },
        '.text-gradient-light': {
          '@apply font-light text-gradient': {},
        }
      }
      addUtilities(newUtilities)
    }
  ],
  darkMode: 'media',
} 