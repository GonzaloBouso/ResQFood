import express from 'express';
import { DonacionController } from '../controllers/DonacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { uploadDonacionImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// --- Ruta Pública ---
router.get('/publicas', DonacionController.getPublicDonations);

// --- Rutas Protegidas ---
router.post('/', requireAuth, uploadDonacionImages, DonacionController.createDonacion);

// LA SOLUCIÓN:
// La ruta GET '/' que antes causaba el error ahora apunta al método correcto 'getDonations'
// que tu controlador SÍ tiene. Es probable que se use en alguna parte de tu app.
router.get('/', requireAuth, DonacionController.getDonations);

router.get('/cercanas', requireAuth, DonacionController.getDonacionesCercanas);
router.get('/mis-donaciones-activas', requireAuth, DonacionController.getMisDonacionesActivasConSolicitudes);
router.get('/usuario/:id', requireAuth, DonacionController.getDonacionesByUsuario);
router.get('/usuario/:id/historial', requireAuth, DonacionController.getDonacionesFinalizadasByUsuario);

// La ruta dinámica '/:id' se coloca al final para evitar conflictos.
router.get('/:id', requireAuth, DonacionController.getDonationById);

export default router;