// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    ".layout/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5A738E",
        brandPrimaryDarker: "#4B6078",  // Sin comillas
        searchBg: "#E8E8F3",            // Sin comillas
        textMain: "#2E2E2E",            // Sin comillas
        textMuted: "#7D7D7D",           // Sin comillas
      },
      boxShadow: {
      'top-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    },
  },
  plugins: [
  ],
}