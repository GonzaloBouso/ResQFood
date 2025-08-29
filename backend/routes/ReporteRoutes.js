// backend/routes/ReporteRoutes.js (CÓDIGO COMPLETO)
import express from 'express';
import { ReporteController } from '../controllers/ReporteController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
// Asegúrate de tener un middleware que verifique si el rol es ADMIN
// import { requireAdmin } from '../middlewares/auth/requireAdmin.js'; 

const router = express.Router();

// Ruta para que un usuario cree un reporte sobre una donación
router.post('/donacion/:donacionId', requireAuth, ReporteController.createReporte);

// Rutas solo para administradores
// Si no tienes requireAdmin, puedes quitarlo temporalmente para probar, pero es importante para la seguridad
router.get('/', requireAuth, /* requireAdmin, */ ReporteController.getReportesPendientes);
router.patch('/:reporteId/resolver', requireAuth, /* requireAdmin, */ ReporteController.resolverReporte);

export default router;