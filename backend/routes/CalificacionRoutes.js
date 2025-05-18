import express from 'express';
import { CalificacionController } from '../controllers/CalificacionController.js';

const router = express.Router()

router.post('/', CalificacionController.createCalificacion)

export default router;