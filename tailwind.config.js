/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        avis: {
          red: '#d4002a',
          'red-dark': '#91001d',
          blue: '#3860be',
          dark: '#0d0d0b',
          gray: '#767676',
          slate: '#65615d',
          border: '#e0e0e0',
          surface: '#f4f4f4',
          light: '#c7c5c5',
        }
      }
    },
  },
  plugins: [],
};
