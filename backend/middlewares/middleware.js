import cors from 'cors';

// Opciones de CORS explícitas y permisivas para tu aplicación
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Permitir todos los métodos
  allowedHeaders: ['Content-Type', 'Authorization'], // Permitir las cabeceras que usas
  credentials: true
};

export const configureMiddlewares = (app) => {
    // Usa las opciones de CORS que hemos definido
    app.use(cors(corsOptions));
};