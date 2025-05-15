import express from 'express'
import { configureMiddlewares } from './middlewares/middleware.js';
import connectDB from './config/db.js';
const app = express();

configureMiddlewares(app)

connectDB();

const PORT = process.env.PORT || 5000;


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("API funcionando");
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
