import express from 'express';
import { CalificacionController } from '../controllers/CalificacionController.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();


router.post('/', ClerkExpressRequireAuth(), CalificacionController.createCalificacion);

export default router;