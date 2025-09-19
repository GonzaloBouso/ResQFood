import express from 'express';
import { SolicitudController } from '../controllers/SolicitudController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';

const router = express.Router();


// Obtener todas las solicitudes hechas por el usuario logueado (Receptor)
router.get('/mis-solicitudes', requireAuth, SolicitudController.getMisSolicitudes);

// Obtener todas las solicitudes recibidas para las donaciones del usuario logueado (Donante)
router.get('/recibidas', requireAuth, SolicitudController.getSolicitudesRecibidas);

router.post('/:donacionId/solicitar', requireAuth, SolicitudController.createSolicitud);


// Donante acepta la solicitud y propone un horario
router.put('/:solicitudId/aceptar-y-proponer', requireAuth, SolicitudController.aceptarSolicitudYProponerHorario)

// Donante rechaza una solicitud pendiente

router.post('/:solicitudId/rechazar', requireAuth, SolicitudController.rechazarSolicitud);

// Cancelar una solicitud pendiente (Receptor) - para el botón "Descartar"
router.patch('/:solicitudId/cancelar', requireAuth, SolicitudController.cancelarSolicitud);

export default router;