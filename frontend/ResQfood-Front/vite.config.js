import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Esto es importante para que Clerk y React Router funcionen correctamente en producción

  build: {
    outDir: 'dist', // Carpeta de salida para Vercel
    emptyOutDir: true
  },

  server: {
    port: 5173, // Puerto por defecto de Vite

    proxy: {
      // Proxy para las rutas de usuario
      '/usuario': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Vite Proxy /usuario] Redirigiendo ${req.method} ${req.originalUrl} a ${options.target}${proxyReq.path}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy /usuario] Error:', err);
            if (res && !res.headersSent) {
              res.writeHead?.(500, { 'Content-Type': 'text/plain' });
              res.end?.('Error en el proxy de Vite');
            } else if (res && res.end) {
              res.end?.();
            }
          });
        }
      },

      // Proxy para las rutas de donación
      '/donacion': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Vite Proxy /donacion] Redirigiendo ${req.method} ${req.originalUrl} a ${options.target}${proxyReq.path}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy /donacion] Error:', err);
            if (res && !res.headersSent) {
              res.writeHead?.(500, { 'Content-Type': 'text/plain' });
              res.end?.('Error en el proxy de Vite');
            } else if (res && res.end) {
              res.end?.();
            }
          });
        }
      }

      // Aquí puedes seguir agregando más rutas si tu backend las tiene.
    }
  }
});
