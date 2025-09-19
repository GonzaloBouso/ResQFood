// backend/routes/DonacionRoutes.js (CÓDIGO COMPLETO Y CORREGIDO)
import express from 'express';
import { DonacionController } from '../controllers/DonacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { uploadDonacionImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/publicas', DonacionController.getPublicDonations);
router.get('/cercanas', requireAuth, DonacionController.getDonacionesCercanas);
router.get('/mis-donaciones-activas', requireAuth, DonacionController.getMisDonacionesActivasConSolicitudes);

// RUTAS DE HISTORIAL
router.get('/historial/hechas', requireAuth, DonacionController.getHistorialHechas);
router.get('/historial/recibidas', requireAuth, DonacionController.getHistorialRecibidas);

router.post('/', requireAuth, uploadDonacionImages, DonacionController.createDonacion);
router.get('/', requireAuth, DonacionController.getDonations);

router.get('/usuario/:id', requireAuth, DonacionController.getDonacionesByUsuario);

router.get('/:id', requireAuth, DonacionController.getDonationById);

export default router;