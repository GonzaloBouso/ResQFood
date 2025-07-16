import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.js';
import UserRoutes from './routes/UserRoutes.js';
import SolicitudRoutes from './routes/SolicitudRoutes.js';
import CalificacionRoutes from './routes/CalificacionRoutes.js';
import NotificacionRoutes from './routes/NotificacionRoutes.js';
import EntregaRoutes from './routes/EntregaRoutes.js';
import ReporteRoutes from './routes/ReporteRoutes.js';
import BitacoraRoutes from './routes/BitacoraAdminRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import { configureMiddlewares } from './middlewares/middleware.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import DonacionRoutes from './routes/DonacionRoutes.js';


// Verificar si la clave de Clerk está cargada
if (!process.env.CLERK_SECRET_KEY) {
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("ERROR: CLERK_SECRET_KEY no está definida.");
    process.exit(1);
}

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES (ORDEN CORRECTO) ---
configureMiddlewares(app);
app.use('/api/webhooks', webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// LA LÍNEA MÁS IMPORTANTE: Usar el puerto de Render o 5000 como fallback.
const PORT = process.env.PORT || 5000;

// Ruta para chequeos de salud
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// --- REGISTRO DE RUTAS DE LA API ---
app.use('/api/usuario', UserRoutes);
app.use('/api/donacion', DonacionRoutes);
// Descomenta las demás rutas cuando las necesites
// ...

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada.` });
});

// --- INICIAR EL SERVIDOR (CORREGIDO) ---
// El servidor debe escuchar en '0.0.0.0' para ser accesible en contenedores como los de Render
// y el log ahora mostrará el puerto real que está usando.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor listo y escuchando en el puerto ${PORT}`);
});