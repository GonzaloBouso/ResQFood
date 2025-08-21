
import express from 'express';
import { VoluntarioController } from '../controllers/VoluntarioController.js';

const router = express.Router();


router.post('/inscribir', VoluntarioController.inscribir);

export default router;