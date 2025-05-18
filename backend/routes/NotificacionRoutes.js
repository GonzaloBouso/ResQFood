import express from 'express';
import { NotificacionController } from '../controllers/NotificacionController.js';

const router = express.Router()

router.post('/', NotificacionController.createNotificacion)

export default router;