import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io'; // Importa el servidor de Socket.IO
import { configureSocket } from './socket.js'; // Importa la función de configuración

// --- Tus importaciones de rutas (sin cambios) ---
import connectDB from './config/db.js';
import UserRoutes from './routes/UserRoutes.js';
import DonacionRoutes from './routes/DonacionRoutes.js';
import SolicitudRoutes from './routes/SolicitudRoutes.js';
import CalificacionRoutes from './routes/CalificacionRoutes.js';
import NotificacionRoutes from './routes/NotificacionRoutes.js';
import EntregaRoutes from './routes/EntregaRoutes.js';
import ReporteRoutes from './routes/ReporteRoutes.js';
import BitacoraRoutes from './routes/BitacoraAdminRoutes.js';
import VoluntarioRoutes from './routes/VoluntarioRoutes.js';
import ContactoRoutes from './routes/ContactoRoutes.js'
import { handleClerkWebhook } from './controllers/webhookController.js';

// --- Verificación de clave (sin cambios) ---
if (!process.env.CLERK_SECRET_KEY) {
    console.error("ERROR: CLERK_SECRET_KEY no está definida.");
    process.exit(1);
}

// ==================================================================
// INICIALIZACIÓN CANÓNICA Y A PRUEBA DE ERRORES
// ==================================================================

const app = express();
const httpServer = createServer(app); // 1. Creamos el servidor HTTP a partir de Express

// 2. Creamos la instancia de Socket.IO aquí mismo, adjuntándola al servidor HTTP
//    y configurando CORS para los WebSockets.
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// 3. Pasamos la instancia 'io' ya creada a nuestro archivo 'socket.js'
//    para que configure la lógica de autenticación y los eventos.
configureSocket(io);

// --- CONFIGURACIÓN DE MIDDLEWARES DE EXPRESS ---

// Configuración de CORS para las rutas HTTP (API REST).
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Ruta especial para el webhook de Clerk, que va ANTES de express.json().
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook);

// Middlewares de parseo de JSON para el resto de las rutas de la API.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONEXIÓN A LA BASE DE DATOS ---
connectDB();

const PORT = process.env.PORT || 5000;

// --- RUTAS DE LA APLICACIÓN ---
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// Rutas principales de la API
app.use('/api/usuario', UserRoutes);
app.use('/api/donacion', DonacionRoutes);
app.use('/api/solicitud', SolicitudRoutes);
app.use('/api/calificacion', CalificacionRoutes);
app.use('/api/notificacion', NotificacionRoutes);
app.use('/api/entrega', EntregaRoutes);
app.use('/api/reporte', ReporteRoutes);
app.use('/api/bitacoraAdmin', BitacoraRoutes);
app.use('/api/voluntario', VoluntarioRoutes);
app.use('/api/contacto', ContactoRoutes);

// --- MANEJO DE ERRORES ---
app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada.` });
});

// --- INICIO DEL SERVIDOR ---
// Usamos 'httpServer.listen' para que tanto Express como Socket.IO escuchen en el mismo puerto.
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor HTTP y Sockets listos y escuchando en el puerto ${PORT}`);
});