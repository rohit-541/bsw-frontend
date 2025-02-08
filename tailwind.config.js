/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['"Josefin Sans"', 'sans-serif'], // Josefin Sans
        kanit: ['"Kanit"', 'sans-serif'],          // Kanit
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}