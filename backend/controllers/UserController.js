import User from '../models/User.js';
import { updateUserSchema, completeInitialProfileSchema, createUserSchema } from '../validations/UserValidation.js';
import { z } from 'zod';

export class UserController {
    // ... tu método createUser (sin cambios) ...
    static async createUser(req, res) {
      // ...
    }


    // ==================================================================
    // LA SOLUCIÓN: Nuevo método para actualizar el perfil del usuario autenticado
    // ==================================================================
    static async updateCurrentUserProfile(req, res) {
        // Obtenemos el ID del usuario directamente del token verificado por el middleware.
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ message: 'No autenticado.' });
        }

        try {
            const userToUpdate = await User.findOne({ clerkUserId });
            if (!userToUpdate) {
                return res.status(404).json({ message: 'Usuario no encontrado en la base de datos.' });
            }

            // Determina qué esquema de validación usar
            const isCompletingProfile = !userToUpdate.rol;
            const validationSchema = isCompletingProfile ? completeInitialProfileSchema : updateUserSchema;
            const validatedData = validationSchema.parse(req.body);
            
            // Lógica para manejar coordenadas inválidas
            if (validatedData.ubicacion && !validatedData.ubicacion.coordenadas?.coordinates?.length) {
                validatedData.ubicacion.coordenadas = { type: 'Point', coordinates: [0, 0] };
            }

            // Asigna los nuevos datos al documento del usuario
            Object.assign(userToUpdate, validatedData);
            
            await userToUpdate.save();

            return res.status(200).json({ message: 'Perfil actualizado exitosamente', user: userToUpdate.toJSON() });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Error de validación al actualizar el perfil.', errors: error.errors });
            }
            console.error('Error al actualizar el perfil del usuario actual:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', errorDetails: error.message });
        }
    }

    // Mantenemos tu método updateUser original por si lo necesitas para otras funcionalidades (ej. un panel de admin)
    static async updateUser(req, res) {
        // ... tu código original de updateUser ...
    }
    
    // ... tu método getCurrentUserProfile (sin cambios) ...
    static async getCurrentUserProfile(req, res) {
      // ...
    }
}