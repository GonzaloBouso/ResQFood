import express from 'express';
import { NotificacionController } from '../controllers/NotificacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';

const router = express.Router();


router.get('/', requireAuth, NotificacionController.getMisNotificaciones);

router.patch('/marcar-donaciones-leidas', NotificacionController.marcarDonacionesComoLeidas);
router.patch('/marcar-solicitudes-leidas', NotificacionController.marcarSolicitudesComoLeidas);
export default router;