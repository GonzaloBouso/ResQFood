import cors from 'cors';

// Este archivo ahora solo configura los middlewares que son 100% seguros para TODAS las rutas.
export const configureMiddlewares = (app) => {
    // Se configura CORS para permitir peticiones solo desde la URL del frontend definida
    // en las variables de entorno, o desde localhost para desarrollo.
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173'
    }));
};