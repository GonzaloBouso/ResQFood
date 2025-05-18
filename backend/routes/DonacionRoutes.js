import express from 'express';
import { DonacionController } from '../controllers/DonacionController.js';
const router = express.Router()

router.post('/', DonacionController.createDonacion)

export default router;