
import express from 'express';
import { ContactoController } from '../controllers/ContactoController.js';

const router = express.Router();


router.post('/enviar', ContactoController.enviarMensaje);

export default router;