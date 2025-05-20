import User from '../models/User.js';
import { userValidationSchema } from '../validations/UserValidation.js';
import {z} from 'zod';

export class UserController {
    static async createUser(req, res){
        try {
            const validateData = userValidationSchema.parse(req.body)

            const nuevoUsuario = new User(validateData);
            await nuevoUsuario.save()

            res.status(200).json({message:'Usuario creado exitosamente',user:nuevoUsuario})
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({message:'Error de validación', errors: error.errors})
            }
            console.log('Error al crear usuario:',error);
            res.status(400).json({message:'Error al crear el usuario', error:error.message})
        }
    }
    static async updateUser(req, res){
        const {clerkUserId}= req.params;
    }
}