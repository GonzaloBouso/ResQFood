import express from 'express';
import { ReporteController } from '../controllers/ReporteController.js';

const router = express.Router()

router.post('/', ReporteController.createReporte)

export default router;