import express from 'express';
import { ReporteController } from '../controllers/ReporteController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { requireAdmin } from '../middlewares/auth/requireAdmin.js';

const router = express.Router();

// Ruta para que un usuario cree un reporte
router.post('/donacion/:donacionId', requireAuth, ReporteController.createReporte);

// --- RUTAS DE ADMINISTRADOR ---
router.get('/', requireAuth, requireAdmin, ReporteController.getAllReportes);

// Rutas para las acciones del admin
router.patch('/:reporteId/resolver', requireAuth, requireAdmin, ReporteController.resolverReporte);
router.delete('/:reporteId/donacion/:donacionId', requireAuth, requireAdmin, ReporteController.eliminarDonacionReportada);
router.post('/:reporteId/usuario/:usuarioId/suspender', requireAuth, requireAdmin, ReporteController.suspenderUsuarioReportado);

export default router;