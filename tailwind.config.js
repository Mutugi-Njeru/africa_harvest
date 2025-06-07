/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellowOrange: "#fbb03b",
        liftonBlue: "#0071BD",
        liftonGreen: "#88C720",
      },
    },
  },
  plugins: [],
}