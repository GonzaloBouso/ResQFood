import express from 'express';
import { BitacoraController } from '../controllers/BitacoraController.js';

const router = express.Router()

router.post('/', BitacoraController.createCambio)

export default router;