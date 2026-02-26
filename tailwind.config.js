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
        createButton: "#F0A028",
        saveButton: "#14503c",
        cancelButton: "#f3f4f6",
        veryLightGreen:"#e8f4ef"
      },
    },
  },
  plugins: [],
}