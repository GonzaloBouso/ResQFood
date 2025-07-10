const EXPORTED_API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_BASE_URL 
  : '';

if (import.meta.env.PROD && !EXPORTED_API_BASE_URL) {
    console.error("FATAL ERROR: VITE_API_BASE_URL no está definida en el entorno de producción (Vercel).");
}

export default EXPORTED_API_BASE_URL;