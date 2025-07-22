import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import donacionRoutes from './routes/donacionRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Necesario para recibir los webhooks en JSON

// Rutas
app.use('/usuario', userRoutes);
app.use('/donacion', donacionRoutes);
app.use('/webhooks', webhookRoutes); // ← Webhook en esta ruta

// Vercel health check o default route opcional
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Conexión a la base de datos y arranque del servidor
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
  });

export default app; // ← Necesario para Vercel (API handler)
