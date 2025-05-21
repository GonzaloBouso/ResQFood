// src/routes/webhookRoutes.js
import express from 'express';
import { handleClerkWebhook } from '../controllers/webhookController.js'; // Asumiendo que tienes este controlador
import bodyParser from 'body-parser';

const router = express.Router();

// IMPORTANTE: Clerk necesita el cuerpo crudo (raw body) para verificar la firma.
// Por eso usamos bodyParser.raw() para esta ruta específica.
// Si tienes express.json() globalmente en tu app, asegúrate de que NO se aplique
// a esta ruta, o que esta ruta se registre ANTES de express.json().
router.post('/clerk', bodyParser.raw({type: 'application/json'}), handleClerkWebhook);

export default router;