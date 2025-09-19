import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { verifyClerkToken } from '../middlewares/auth/verifyClerkToken.js';
import { uploadAvatar } from '../middlewares/uploadMiddleware.js';
import { requireAdmin } from '../middlewares/auth/requireAdmin.js';

const router = express.Router();



router.post('/create-profile', verifyClerkToken, UserController.createProfileFromFrontend);



router.get('/me', verifyClerkToken, UserController.getCurrentUserProfile);



router.put('/me', requireAuth, UserController.updateCurrentUserProfile);
router.post('/me/avatar', requireAuth, uploadAvatar, UserController.updateAvatar);
router.get('/:id', requireAuth, UserController.getUserProfileById);


// Rutas de Administrador
router.get('/', requireAuth, requireAdmin, UserController.getAllUsers);
router.put('/:id/manage', requireAuth, requireAdmin, UserController.manageUser);



router.put('/:clerkUserId', requireAuth, UserController.updateUser);
router.post('/', UserController.createUser);


export default router;