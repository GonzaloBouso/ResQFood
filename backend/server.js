import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initSockets } from './socket.js';
import { ClerkExpressWithAuth } from '@clerk/express';

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

if (!process.env.CLERK_SECRET_KEY) {
    console.error("ERROR: CLERK_SECRET_KEY no está definida.");
    process.exit(1);
}

const app = express();
const server = http.createServer(app); 

const io = new SocketIOServer(server, {
    cors: {
        origin: "*", // En producción, deberías restringirlo a la URL de tu frontend
        methods: ["GET", "POST"]
    }
});

initSockets(io);

// ==================================================================
// CONFIGURACIÓN DE MIDDLEWARES
// ==================================================================
app.use(cors());
app.use('/api/webhooks', webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ClerkExpressWithAuth());

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
app.use('/api/entrega', EntregaRoutes);
app.use('/api/notificacion', NotificacionRoutes);


// --- MANEJO DE ERRORES ---
app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada.` });
});

// --- INICIO DEL SERVIDOR ---
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor listo y escuchando en el puerto ${PORT}`);
});