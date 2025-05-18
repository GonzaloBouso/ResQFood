import express from 'express'
import { configureMiddlewares } from './middlewares/middleware.js';
import connectDB from './config/db.js';
import UserRoutes from './routes/UserRoutes.js';
import SolicitudRoutes from './routes/SolicitudRoutes.js';
import DonacionRoutes from './routes/DonacionRoutes.js';
import CalificacionRoutes from './routes/CalificacionRoutes.js';
import NotificacionRoutes from './routes/NotificacionRoutes.js';
import EntregaRoutes from './routes/EntregaRoutes.js';
import ReporteRoutes from './routes/ReporteRoutes.js';
import BitacoraRoutes from './routes/BitacoraAdminRoutes.js';


const app = express();

configureMiddlewares(app)

connectDB();

const PORT = process.env.PORT || 5000;


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("API funcionando");
});

app.use('/usuario', UserRoutes)

app.use('/donacion', DonacionRoutes)

app.use('/solicitud', SolicitudRoutes)

app.use('/calificacion', CalificacionRoutes)

app.use('/notificacion', NotificacionRoutes)

app.use('/entrega', EntregaRoutes)

app.use('/reporte', ReporteRoutes)

app.use('/bitacoraAdmin', BitacoraRoutes)

app.use((req, res, next)=>{
    res.status(404).json({message: `Ruta ${req.method} ${req.url} no encontrada. `})
})

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
