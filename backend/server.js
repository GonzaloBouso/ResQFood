import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { configureSocket } from './socket.js';


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
import ContactoRoutes from './routes/ContactoRoutes.js';
import { handleClerkWebhook } from './controllers/webhookController.js';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'; 

if (!process.env.CLERK_SECRET_KEY) {
    console.error("ERROR: CLERK_SECRET_KEY no está definida.");
    process.exit(1);
}

const app = express();
const httpServer = createServer(app);



const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};


app.options('*', cors(corsOptions));


app.use(cors(corsOptions));


const io = new SocketIOServer(httpServer, {
    cors: corsOptions
});


configureSocket(io);


// Ruta especial para el webhook de Clerk 
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook);

// Middlewares de parseo de JSON para el resto de las rutas de la API.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONEXIÓN A LA BASE DE DATOS ---
connectDB();

const PORT = process.env.PORT || 5000;

// --- RUTAS DE LA APLICACIÓN 
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

app.use(ClerkExpressWithAuth());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// --- MANEJO DE ERRORES
app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada.` });
});

// --- INICIO DEL SERVIDOR
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor HTTP y Sockets listos y escuchando en el puerto ${PORT}`);
});