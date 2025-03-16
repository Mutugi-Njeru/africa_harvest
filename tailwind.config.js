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
      },
      keyframes: {
        bubbleMove: {
          '0%': { transform: 'translate(0, 0)', opacity: 0.5 },
          '25%': { transform: 'translate(20px, -30px)', opacity: 0.7 },
          '50%': { transform: 'translate(-30px, -50px)', opacity: 0.8 },
          '75%': { transform: 'translate(30px, -70px)', opacity: 0.5 },
          '100%': { transform: 'translate(0, 0)', opacity: 0.3 },
        },
      },
      animation: {
        'bubble-move': 'bubbleMove 6s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}