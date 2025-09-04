
import express from 'express';
import { BitacoraController } from '../controllers/BitacoraController.js';
import { requireAdmin } from '../middlewares/auth/requireAdmin.js'; 

const router = express.Router();


router.get('/', requireAdmin, BitacoraController.getAllCambios);

export default router;