import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

// --- IMPORTACIONES CORREGIDAS CON LA EXTENSIÓN .js ---
import connectDB from './config/db.js';
import UserRoutes from './routes/UserRoutes.js';
import DonacionRoutes from './routes/DonacionRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import SolicitudRoutes from './routes/SolicitudRoutes.js';
import CalificacionRoutes from './routes/CalificacionRoutes.js';
import NotificacionRoutes from './routes/NotificacionRoutes.js';
import EntregaRoutes from './routes/EntregaRoutes.js';
import ReporteRoutes from './routes/ReporteRoutes.js';
import BitacoraRoutes from './routes/BitacoraAdminRoutes.js';
import { configureMiddlewares } from './middlewares/middleware.js';

// --- El resto de tu código, que ya era correcto ---
if (!process.env.CLERK_SECRET_KEY) {
    console.error("ERROR: CLERK_SECRET_KEY no está definida.");
    process.exit(1);
}

const app = express();

configureMiddlewares(app);
app.use('/api/webhooks', webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const PORT = process.env.PORT || 5000;

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// Descomenta y usa tus rutas según sea necesario
app.use('/api/usuario', UserRoutes);
app.use('/api/donacion', DonacionRoutes);
// ... etc.

app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada.` });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor listo y escuchando en el puerto ${PORT}`);
});