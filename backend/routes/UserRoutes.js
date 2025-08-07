import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { uploadAvatar } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Obtener el perfil del usuario actual (GET /me)
router.get('/me', requireAuth, UserController.getCurrentUserProfile);

// Actualizar el perfil del usuario actual (PUT /me)
router.put('/me', requireAuth, UserController.updateCurrentUserProfile);

router.post('/me/avatar', requireAuth, uploadAvatar, UserController.updateAvatar);

// --- LA SOLUCIÓN: Nueva ruta para que el frontend cree el perfil ---
router.post('/create-profile', requireAuth, UserController.createProfileFromFrontend);

// (Opcional) Ruta para actualizar un usuario específico por su ID (para admins)
router.put('/:clerkUserId', requireAuth, UserController.updateUser);

// (Opcional) Ruta para crear un usuario manualmente (si es necesario)
router.post('/', UserController.createUser);

router.get('/:id', requireAuth, UserController.getUserProfileById);


export default router;