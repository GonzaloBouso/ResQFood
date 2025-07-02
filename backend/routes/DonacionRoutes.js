// src/routes/DonacionRoutes.js
import express from 'express';
import { DonacionController } from '../controllers/DonacionController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { uploadDonacionImages } from '../middlewares/uploadMiddleware.js'; // Importa el middleware de subida

const router = express.Router();

// Usar el middleware uploadDonacionImages ANTES del controlador
router.post('/', requireAuth, uploadDonacionImages, DonacionController.createDonacion);
router.get('/cercanas', DonacionController.getDonacionesCercanas);
router.get('/:id', DonacionController.getDonationById);
router.get('/usuario/:id', DonacionController.getDonacionesByUsuario);


export default router;