import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';
import { verifyClerkToken } from '../middlewares/auth/verifyClerkToken.js';
import { uploadAvatar } from '../middlewares/uploadMiddleware.js';
import { requireAdmin } from '../middlewares/auth/requireAdmin.js';

const router = express.Router();


// Usa 'verifyClerkToken' que solo valida el token, no requiere que el usuario exista en la DB.
router.post('/create-profile', verifyClerkToken, UserController.createProfileFromFrontend);


// Se ha cambiado 'requireAuth' por 'verifyClerkToken'.
// Esto permite que la petición llegue al controlador incluso si el usuario es nuevo.
router.get('/me', verifyClerkToken, UserController.getCurrentUserProfile);


// Estas acciones (actualizar, subir avatar, etc.) SÍ requieren que el usuario exista,
// por lo que 'requireAuth' es el middleware correcto para ellas.
router.put('/me', requireAuth, UserController.updateCurrentUserProfile);
router.post('/me/avatar', requireAuth, uploadAvatar, UserController.updateAvatar);
router.get('/:id', requireAuth, UserController.getUserProfileById);


// Rutas de Administrador
router.get('/', requireAuth, requireAdmin, UserController.getAllUsers);
router.put('/:id/manage', requireAuth, requireAdmin, UserController.manageUser);


// Otras rutas
router.put('/:clerkUserId', requireAuth, UserController.updateUser);
router.post('/', UserController.createUser);


export default router;