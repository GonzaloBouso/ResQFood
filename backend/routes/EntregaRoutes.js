import express from 'express';
import { ReporteController } from '../controllers/ReporteController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { requireAdmin } from '../middlewares/auth/requireAdmin.js'; // Asumo que tienes un middleware para admins

const router = express.Router();

// Ruta para que un usuario cree un reporte sobre una donación
router.post('/donacion/:donacionId', requireAuth, ReporteController.createReporte);

// Rutas solo para administradores
router.get('/', requireAuth, requireAdmin, ReporteController.getReportesPendientes);
router.patch('/:reporteId/resolver', requireAuth, requireAdmin, ReporteController.resolverReporte);

export default router;