import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path'; // <--- 1. Importa el módulo 'path'
import { fileURLToPath } from 'url'; // <--- 2. Importa el módulo 'url'

// --- Lógica para construir rutas absolutas ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Tus importaciones originales (ahora usando rutas absolutas) ---
import connectDB from './config/db.js';
// LA SOLUCIÓN: Usamos path.join para crear una ruta absoluta al archivo de rutas
import UserRoutes from path.join(__dirname, 'routes', 'UserRoutes.js');
import DonacionRoutes from path.join(__dirname, 'routes', 'DonacionRoutes.js');
import webhookRoutes from path.join(__dirname, 'routes', 'webhookRoutes.js');
// ...Si tienes más rutas, impórtalas de la misma manera...

import { configureMiddlewares } from './middlewares/middleware.js';

// --- El resto de tu código (sin cambios) ---

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

app.use('/api/usuario', UserRoutes);
app.use('/api/donacion', DonacionRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: `Ruta ${req.method} ${req.url} no encontrada.` });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor listo y escuchando en el puerto ${PORT}`);
});