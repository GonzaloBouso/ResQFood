import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
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
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'; // O tu importación de Clerk
import DonacionRoutes from './routes/DonacionRoutes.js'; 


// Verificar si la clave está cargada (opcional, para depuración)
if (!process.env.CLERK_SECRET_KEY) {
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("ERROR: CLERK_SECRET_KEY no está definida en .env");
    console.error("Por favor, añade CLERK_SECRET_KEY a tu archivo .env en la raíz del backend.");
    console.error("Puedes obtenerla de tu dashboard de Clerk -> API Keys.");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    process.exit(1); // Detener la app si la clave no está
}



const app = express();

app.use('/api/webhooks', webhookRoutes);

configureMiddlewares(app)

connectDB();

const PORT = process.env.PORT || 5000;


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("API funcionando");
});

app.use('/usuario', UserRoutes)

app.use('/solicitud', SolicitudRoutes)

app.use('/calificacion', CalificacionRoutes)

app.use('/notificacion', NotificacionRoutes)

app.use('/entrega', EntregaRoutes)

app.use('/reporte', ReporteRoutes)

app.use('/bitacoraAdmin', BitacoraRoutes)

app.use('/donacion', DonacionRoutes);

app.use((req, res, next)=>{
    res.status(404).json({message: `Ruta ${req.method} ${req.url} no encontrada. `})
})

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
