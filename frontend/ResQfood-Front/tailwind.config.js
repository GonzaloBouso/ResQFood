// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5A738E",              // Sin comillas
        brandPrimaryDarker: "#4B6078",  // Sin comillas
        searchBg: "#E8E8F3",            // Sin comillas
        textMain: "#2E2E2E",            // Sin comillas
        textMuted: "#7D7D7D",           // Sin comillas
      },
    },
  },
  plugins: [],
}