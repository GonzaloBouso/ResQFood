// src/routes/UserRoutes.js
import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { requireAuth } from '../middlewares/autMiddleware.js'; // <<< DESCOMENTA Y USA ESTO

const router = express.Router();

// --- RUTA PARA CREAR UN USUARIO (ADMIN/SISTEMA) ---
// Considera si esta ruta necesita su propia autenticación/autorización si es para admins
router.post('/', UserController.createUser);

// --- NUEVA RUTA: OBTENER EL PERFIL DEL USUARIO ACTUALMENTE LOGUEADO ---
// Esta ruta DEBE estar ANTES de '/:clerkUserId' para que 'me' no sea interpretado como un clerkUserId.
// Está protegida por requireAuth, que pondrá req.auth.userId.
router.get('/me', requireAuth, UserController.getCurrentUserProfile);

// --- RUTA PARA ACTUALIZAR UN USUARIO ESPECÍFICO POR SU CLERKUSERID ---
// También protegida por requireAuth. El controlador verificará si el usuario logueado
// tiene permiso para actualizar el perfil solicitado (loggedInUserId === params.clerkUserId).
router.put('/:clerkUserId', requireAuth, UserController.updateUser);

// --- OTRAS RUTAS DE USUARIO QUE PODRÍAS NECESITAR (EJEMPLOS) ---
// Obtener un perfil de usuario público (si lo permites, quizás con menos datos)
// router.get('/:clerkUserId/public', UserController.getPublicUserProfile);

// Obtener todos los usuarios (solo para ADMINS, necesitaría un middleware de rol de admin)
// router.get('/', requireAuth, requireAdminRole, UserController.getAllUsers);

export default router;