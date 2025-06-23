import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para las rutas de usuario
      '/usuario': { 
        target: 'http://localhost:5000', // Reemplaza 5000 con el puerto real de tu backend
        changeOrigin: true, // Necesario para la correcta recepción de la petición en el backend
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Vite Proxy /usuario] Redirigiendo ${req.method} ${req.originalUrl} a ${options.target}${proxyReq.path}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy /usuario] Error:', err);
            if (res && !res.headersSent) { // Verificar si las cabeceras ya fueron enviadas
              res.writeHead?.(500, { 'Content-Type': 'text/plain' });
              res.end?.('Error en el proxy de Vite');
            } else if (res && res.end) {
              res.end?.(); // Terminar la respuesta si las cabeceras ya fueron enviadas pero la conexión sigue abierta
            }
          });
        }
      },
      // Proxy para las rutas de donación
      '/donacion': { 
        target: 'http://localhost:5000', // Reemplaza 5000 con el puerto real de tu backend
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Usar req.originalUrl para ver la URL completa que el frontend intentó acceder
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
      },
      // Puedes añadir más reglas de proxy aquí para otras rutas API si es necesario
      // Por ejemplo, si todas tus rutas de backend están bajo un prefijo común como '/api':
      // '/api': {
      //   target: 'http://localhost:5000', // Tu backend
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''), // Quita /api antes de enviar al backend
      //   configure: (proxy, options) => { ... logs similares ... }
      // }
    }
  }
});