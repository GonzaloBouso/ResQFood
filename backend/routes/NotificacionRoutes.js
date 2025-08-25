// backend/routes/NotificacionRoutes.js
import express from 'express';
import { NotificacionController } from '../controllers/NotificacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';

const router = express.Router();


router.get('/mis-notificaciones', requireAuth, NotificacionController.getMisNotificaciones);

router.patch('/marcar-como-leidas', requireAuth, NotificacionController.marcarNotificacionesComoLeidas);

export default router;