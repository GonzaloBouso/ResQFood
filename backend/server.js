import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

// --- Tus importaciones de rutas (sin cambios) ---
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

// --- Verificación de clave (sin cambios) ---
if (!process.env.CLERK_SECRET_KEY) {
    console.error("ERROR: CLERK_SECRET_KEY no está definida.");
    process.exit(1);
}

const app = express();

// ==================================================================
// CONFIGURACIÓN DE MIDDLEWARES
// ==================================================================

// 1. CORS: Se aplica al principio para permitir peticiones desde cualquier origen.
//    Esto resuelve los errores de CORS para todos los métodos (GET, POST, PUT, OPTIONS).
app.use(cors());

// 2. Webhooks: Esta ruta necesita el cuerpo "crudo", por lo que va ANTES de express.json().
app.use('/api/webhooks', webhookRoutes);

// 3. Parseo de JSON: Se aplica al resto de las rutas que vienen después.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- CONEXIÓN A LA BASE DE DATOS ---
connectDB();

const PORT = process.env.PORT || 5000;


// --- RUTAS DE LA APLICACIÓN ---

// Ruta de "salud" para verificar que el servidor está vivo.
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// Rutas principales de la API
app.use('/api/usuario', UserRoutes);
app.use('/api/donacion', DonacionRoutes);
// ... puedes descomentar el resto de tus rutas aquí ...


// --- MANEJO DE ERRORES ---

// Middleware para "atrapar" cualquier ruta no encontrada.
app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada.` });
});


// --- INICIO DEL SERVIDOR ---

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor listo y escuchando en el puerto ${PORT}`);
});