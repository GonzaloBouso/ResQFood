// vite.config.js (CORREGIDO para Tailwind v3 estándar)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No necesitas importar 'tailwindcss' o '@tailwindcss/vite' aquí

export default defineConfig({
  plugins: [react()],
  // No necesitas añadir tailwindcss() aquí como plugin
});