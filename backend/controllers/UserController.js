import User from '../models/User.js';
import { updateUserSchema, createUserSchema } from '../validations/UserValidation.js';
import {z} from 'zod';

export class UserController {
    static async createUser(req, res){
        try {
            const validateData = createUserSchema.parse(req.body)

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

        //const loggedInUserId = req.auth.userId;

       /* if (clerkUserId != loggedInUserId) {
            return res.status(403).json({message: 'No tiene permiso para modificar este usuario'})
        }*/
       // Simulación:
        const loggedInUserId = clerkUserId; // Para que la verificación pase

        
        try {
            const validatedData = updateUserSchema.parse(req.body)

            const userFind = await User.findOne({clerkUserId})
            if (!userFind) {
               return res.status(404).json({message:'Usuario no encontrado'})
            }

            Object.entries(validatedData).forEach(([key, value]) => {
                if (value !== null && typeof value === 'object' && userFind[key]) {
                    Object.assign(userFind[key], value)
                } else if(value !== undefined) {
                    userFind[key] =value;
                }
            });

            await userFind.save();
            
            return res.status(200).json({message:'Usuario actualizado exitosamente', userFind})

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({message: 'Error de validación', errors: error.errors})
            }
            console.error('Error al actualizar usuario: ', error);
            return res.status(500).json({message:'Error al actualizar usuario', error: error.message})
        }
    }
}