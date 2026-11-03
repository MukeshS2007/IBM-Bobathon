/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ibm: {
          blue: '#0f62fe',
          darkBlue: '#002d9c',
          lightBlue: '#4589ff',
          gray: '#161616',
          coolGray: '#262626',
        },
        namma: {
          saffron: '#FF6F00',
          kannadaYellow: '#FFD600',
          kannadaRed: '#D50000',
          emerald: '#10B981',
          teal: '#0D9488',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

