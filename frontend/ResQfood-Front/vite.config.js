import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',

  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },

  server: {
    port: 5173,

    // --- SECCIÓN DE PROXY CORREGIDA Y SIMPLIFICADA ---
    proxy: {
      // ESTE ES EL ÚNICO PROXY QUE NECESITAS PARA SOLUCIONAR EL PROBLEMA DE CLERK.
      // Le dice al servidor de desarrollo de Vite: "Cualquier petición que empiece
      // con '/__clerk' no es para ti. Reenvíala a mi backend en localhost:5000".
      // En producción (Vercel), esta regla no se aplica, pero la configuración que haremos
      // en el backend funcionará directamente.
      '/__clerk': {
        target: 'http://localhost:5000', // Asumiendo que tu backend corre en el puerto 5000
        changeOrigin: true,
      },

      // Ya no necesitas los proxies para '/usuario', '/donacion', etc.
      // Tu aplicación ya maneja esto correctamente usando la variable de entorno
      // API_BASE_URL en tu archivo 'src/api/config.js'.
      // Mantenerlos podría causar conflictos.
    }
  }
});