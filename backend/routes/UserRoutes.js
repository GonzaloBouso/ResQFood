import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { requireAuth } from '../middlewares/autMiddleware.js';

const router = express.Router()

router.post('/', UserController.createUser)
router.put('/:clerkUserId',requireAuth, UserController.updateUser)

export default router;