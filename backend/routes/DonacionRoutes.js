import express from 'express';
import { DonacionController } from '../controllers/DonacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { uploadDonacionImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// ==================================================================
// LA SOLUCIÓN:
// Se reordenan las rutas. Las más específicas (con palabras) van primero.
// La más genérica (con :id) va al final.
// ==================================================================

// --- Rutas Públicas (estáticas) ---
router.get('/publicas', DonacionController.getPublicDonations);

// --- Rutas Protegidas (estáticas y específicas) ---
router.post('/', requireAuth, uploadDonacionImages, DonacionController.createDonacion);
router.get('/', requireAuth, DonacionController.getDonations); // Tu ruta genérica para usuarios logueados
router.get('/cercanas', requireAuth, DonacionController.getDonacionesCercanas);
router.get('/mis-donaciones-activas', requireAuth, DonacionController.getMisDonacionesActivasConSolicitudes);
router.get('/usuario/:id', requireAuth, DonacionController.getDonacionesByUsuario);
router.get('/usuario/:id/historial', requireAuth, DonacionController.getDonacionesByUsuario); // Corregido para llamar a la función correcta

// --- Ruta Dinámica (va al final) ---
router.get('/:id', requireAuth, DonacionController.getDonationById);

// Rutas PUT y DELETE que podrías añadir
// router.put('/:id', requireAuth, DonacionController.updateDonation);
// router.delete('/:id', requireAuth, DonacionController.deleteDonation);

export default router;