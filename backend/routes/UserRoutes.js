import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';

const router = express.Router();

// Ruta para crear un usuario (si es necesaria)
router.post('/', UserController.createUser);

// Obtener el perfil del usuario actual (GET)
router.get('/me', requireAuth, UserController.getCurrentUserProfile);

// --- LA SOLUCIÓN: RUTA PARA ACTUALIZAR EL PERFIL DEL USUARIO ACTUAL (PUT) ---
// Esta es la ruta que tu frontend está intentando llamar.
router.put('/me', requireAuth, UserController.updateCurrentUserProfile);

// Ruta para actualizar un usuario por su ID (si es necesaria para un admin en el futuro)
// La mantenemos por si acaso, pero no la usaremos para el formulario de completar perfil.
router.put('/:clerkUserId', requireAuth, UserController.updateUser);

export default router;