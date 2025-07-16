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
    console.error("ERROR: CLERK_SECRET_KEY no está definida en .env");
    console.error("Por favor, añade CLERK_SECRET_KEY a tu archivo .env en la raíz del backend.");
    console.error("Puedes obtenerla de tu dashboard de Clerk -> API Keys.");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    process.exit(1);
}

const app = express();

// --- INICIO DE LA CONFIGURACIÓN DE MIDDLEWARES (ORDEN CORRECTO) ---

// 1. Configura middlewares globales seguros como CORS.
//    La función configureMiddlewares ahora solo aplica cors().
configureMiddlewares(app);

// 2. REGISTRA EL ENDPOINT DEL WEBHOOK PRIMERO.
//    Esta ruta necesita el cuerpo crudo (raw) y DEBE ir antes de express.json().
app.use('/api/webhooks', webhookRoutes);

// 3. APLICA LOS MIDDLEWARES DE PARSEO DE CUERPO.
//    Estos se aplicarán a todas las rutas registradas DESPUÉS de este punto.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- FIN DE LA CONFIGURACIÓN DE MIDDLEWARES ---

// Conectar a la base de datos
connectDB();

const PORT = process.env.PORT || 5000;

// Ruta para chequeos de salud (buena práctica para servicios de hosting)
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// 4. REGISTRA EL RESTO DE LAS RUTAS DE LA API.
//    Todas estas rutas recibirán un req.body ya parseado.
app.use('/api/usuario', UserRoutes);
app.use('/api/donacion', DonacionRoutes);
// Descomenta las siguientes rutas a medida que las necesites:
// app.use('/api/solicitud', SolicitudRoutes);
// app.use('/api/calificacion', CalificacionRoutes);
// app.use('/api/notificacion', NotificacionRoutes);
// app.use('/api/entrega', EntregaRoutes);
// app.use('/api/reporte', ReporteRoutes);
// app.use('/api/bitacoraAdmin', BitacoraRoutes);

// Middleware para manejar rutas no encontradas (404)
// Se ejecuta si ninguna de las rutas anteriores coincide.
app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada.` });
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));