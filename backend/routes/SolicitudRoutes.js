import express from 'express';
import { SolicitudController } from '../controllers/SolicitudController.js';

const router = express.Router()

router.post('/', SolicitudController.createSolicitud)

export default router;