import express from 'express';
import { DonacionController } from '../controllers/DonacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { uploadDonacionImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// --- Rutas Públicas (van primero) ---
router.get('/publicas', DonacionController.getPublicDonations);

// --- Rutas Protegidas ---
router.post('/', requireAuth, uploadDonacionImages, DonacionController.createDonacion);
router.get('/cercanas', requireAuth, DonacionController.getDonacionesCercanas);
router.get('/mis-donaciones-activas', requireAuth, DonacionController.getMisDonacionesActivasConSolicitudes);
router.get('/usuario/:id', requireAuth, DonacionController.getDonacionesByUsuario);
router.get('/usuario/:id/historial', requireAuth, DonacionController.getDonacionesFinalizadasByUsuario);

// LA SOLUCIÓN:
// 1. La ruta genérica GET '/' que causaba el error ha sido eliminada.
// 2. La ruta dinámica '/:id' se coloca al final para evitar que "atrape" a las otras.
router.get('/:id', requireAuth, DonacionController.getDonationById);

// Rutas PUT y DELETE que deberías tener (descomenta si las necesitas)
// router.put('/:id', requireAuth, DonacionController.updateDonation);
// router.delete('/:id', requireAuth, DonacionController.deleteDonation);

export default router;