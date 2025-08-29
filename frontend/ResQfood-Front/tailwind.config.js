// frontend/tailwind.config.js (CÓDIGO COMPLETO Y SEGURO)

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esta ruta es más general y segura. Cubre todo dentro de /src.
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5A738E",
        brandPrimaryDarker: "#4B6078",
        searchBg: "#E8E8F3",
        textMain: "#2E2E2E",
        textMuted: "#7D7D7D",
      },
      boxShadow: {
        'top-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      // Animación sutil para el contenido desplegable
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}