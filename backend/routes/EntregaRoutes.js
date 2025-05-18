import express from 'express';
import { EntregaController } from '../controllers/EntregaController.js';

const router = express.Router()

router.post('/', EntregaController.createEntrega)

export default router;