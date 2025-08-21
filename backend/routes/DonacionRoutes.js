import express from 'express';
import { DonacionController } from '../controllers/DonacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { uploadDonacionImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// --- Ruta Pública ---
// Para la sección de "últimas donaciones" en la página de inicio.
router.get('/publicas', DonacionController.getPublicDonations);

// --- Rutas Protegidas ---

// Crear una nueva donación
router.post('/', requireAuth, uploadDonacionImages, DonacionController.createDonacion);

// Obtener donaciones cercanas (para el dashboard principal de usuarios logueados)
router.get('/cercanas', requireAuth, DonacionController.getDonacionesCercanas);

// Obtener las donaciones del donante actual con sus solicitudes (para la página "Mis Donaciones")
router.get('/mis-donaciones-activas', requireAuth, DonacionController.getMisDonacionesActivasConSolicitudes);

// Obtener todas las donaciones de un usuario específico por su ID
router.get('/usuario/:id', requireAuth, DonacionController.getDonacionesByUsuario);

// Obtener el historial de donaciones finalizadas de un usuario
router.get('/usuario/:id/historial', DonacionController.getDonacionesFinalizadasByUsuario);


// LA SOLUCIÓN:
// La ruta para obtener una donación específica por su ID se coloca al final
// para evitar que Express confunda rutas como "publicas" o "cercanas" con un ID.
// Esta ruta es la que usa el modal "Ver Detalles".
router.get('/:id', requireAuth, DonacionController.getDonationById);


// (Opcional) Rutas para actualizar y eliminar que podrías necesitar en el futuro
// router.put('/:id', requireAuth, DonacionController.updateDonation);
// router.delete('/:id', requireAuth, DonacionController.deleteDonation);


export default router;