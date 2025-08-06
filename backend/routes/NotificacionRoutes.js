import express from 'express';
import { NotificacionController } from '../controllers/NotificacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';

const router = express.Router();

// Obtener todas las notificaciones del usuario logueado
router.get('/', requireAuth, NotificacionController.getMisNotificaciones);

// Marcar una notificación como leída
router.patch('/:notificacionId/leida', requireAuth, NotificacionController.marcarComoLeida);

export default router;