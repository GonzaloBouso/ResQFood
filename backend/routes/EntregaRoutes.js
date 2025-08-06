import express from 'express';
import { EntregaController } from '../controllers/EntregaController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';

const router = express.Router();

// Receptor confirma el horario propuesto por el donante
router.patch('/:entregaId/confirmar-horario', requireAuth, EntregaController.confirmarHorario);

// Donante completa la entrega usando el código de confirmación
router.post('/:entregaId/completar', requireAuth, EntregaController.completarEntrega);

export default router;