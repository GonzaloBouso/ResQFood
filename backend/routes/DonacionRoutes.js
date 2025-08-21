import express from 'express';
import { DonacionController } from '../controllers/DonacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { uploadDonacionImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// --- Rutas Públicas ---
router.get('/publicas', DonacionController.getPublicDonations);

// --- Rutas Protegidas ---
router.post('/', requireAuth, uploadDonacionImages, DonacionController.createDonacion);
router.get('/cercanas', requireAuth, DonacionController.getDonacionesCercanas);
router.get('/mis-donaciones-activas', requireAuth, DonacionController.getMisDonacionesActivasConSolicitudes);
router.get('/usuario/:id', requireAuth, DonacionController.getDonacionesByUsuario);
router.get('/usuario/:id/historial', requireAuth, DonacionController.getDonacionesFinalizadasByUsuario);

// LA SOLUCIÓN: La ruta para obtener una donación por ID debe ir al final
// para no confundir 'publicas', 'cercanas', etc. con un ID.
router.get('/:id', requireAuth, DonacionController.getDonationById);

// Rutas PUT y DELETE que deberías tener
// router.put('/:id', requireAuth, DonacionController.updateDonation);
// router.delete('/:id', requireAuth, DonacionController.deleteDonation);

export default router;