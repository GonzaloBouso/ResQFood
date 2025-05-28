// src/controllers/UserController.js
import User from '../models/User.js';
// Importa los tres esquemas
import { updateUserSchema, completeInitialProfileSchema, createUserSchema } from '../validations/UserValidation.js';
import { z } from 'zod';

export class UserController {
    static async createUser(req, res) {
        try {
            const validatedData = createUserSchema.parse(req.body);
            const existingUser = await User.findOne({ 
                $or: [{ clerkUserId: validatedData.clerkUserId }, { email: validatedData.email }] 
            });
            if (existingUser) {
                return res.status(409).json({ message: 'Ya existe un usuario con ese ID de Clerk o email.' });
            }
            const nuevoUsuario = new User(validatedData);
            await nuevoUsuario.save();
            res.status(201).json({ message: 'Usuario creado exitosamente', user: nuevoUsuario.toJSON() });
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Error de validación Zod en createUser:', error.errors);
                return res.status(400).json({ message: 'Error de validación al crear usuario', errors: error.errors });
            }
            console.error('Error al crear usuario:', error);
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Conflicto: El usuario ya existe (ID de Clerk o email duplicado).', details: error.keyValue });
            }
            res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
        }
    }

    static async updateUser(req, res) {
        const { clerkUserId } = req.params;
        
        // --- Autenticación y Autorización ---
        // (Asumiendo que requireAuth está activo en la ruta y provee req.auth)
        const loggedInUserId = req.auth?.userId; 
        if (!loggedInUserId) {
             return res.status(401).json({ message: 'No autenticado. Token no encontrado o inválido.' });
        }
        if (clerkUserId !== loggedInUserId) {
             return res.status(403).json({ message: 'No tiene permiso para modificar este usuario.' });
        }
        // --- Fin Autenticación y Autorización ---

        try {
            const userToUpdate = await User.findOne({ clerkUserId }); // clerkUserId viene de req.params

            if (!userToUpdate) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            let validatedData;
            if (userToUpdate.rol === null) {
                console.log("Attempting to complete initial profile, validating with completeInitialProfileSchema. Body:", req.body);
                validatedData = completeInitialProfileSchema.parse(req.body);
            } else {
                console.log("Attempting to update existing profile, validating with updateUserSchema. Body:", req.body);
                validatedData = updateUserSchema.parse(req.body);
                if (validatedData.rol && validatedData.rol !== userToUpdate.rol) {
                    console.warn(`Intento de cambiar rol de ${userToUpdate.rol} a ${validatedData.rol} mediante actualización general. Verificando lógica.`);
                }
            }

            Object.keys(validatedData).forEach(key => {
                if (validatedData[key] !== undefined) {
                    if ((key === "ubicacion" || key === "localData") && userToUpdate[key] && typeof validatedData[key] === 'object' && validatedData[key] !== null) {
                        Object.assign(userToUpdate[key], validatedData[key]);
                    } else {
                        userToUpdate[key] = validatedData[key];
                    }
                }
            });
            
            await userToUpdate.save();
            
            return res.status(200).json({ message: 'Usuario actualizado exitosamente', user: userToUpdate.toJSON() });

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Error de validación Zod en updateUser:', error.errors);
                return res.status(400).json({ message: 'Error de validación al actualizar usuario.', errors: error.errors });
            }
            console.error('Error al actualizar usuario: ', error);
            return res.status(500).json({ message: 'Error interno del servidor al actualizar usuario.', error: error.message });
        }
    }

    // --- MÉTODO NUEVO AÑADIDO ---
    static async getCurrentUserProfile(req, res) {
        try {
            // El middleware requireAuth ya validó el token y puso req.auth.userId
            const clerkUserId = req.auth?.userId; // ID del usuario autenticado desde el token

            if (!clerkUserId) {
                // Doble verificación, aunque requireAuth debería haberlo manejado.
                return res.status(401).json({ message: "No autenticado o ID de usuario no encontrado en el token." });
            }

            // Busca al usuario en nuestra base de datos usando el clerkUserId del token
            const userProfile = await User.findOne({ clerkUserId: clerkUserId });

            if (!userProfile) {
                // Usuario existe en Clerk (porque pasó requireAuth y tenemos un clerkUserId del token) 
                // pero NO en nuestra DB. Esto significa que el webhook user.created aún no se procesó 
                // o falló, por lo tanto, el perfil está incompleto (rol es null).
                // El frontend interpretará un 404 aquí como que el perfil necesita ser completado.
                console.warn(`Perfil para clerkUserId ${clerkUserId} no encontrado en DB local (probablemente rol no seteado).`);
                return res.status(404).json({ message: "Perfil de usuario no encontrado en nuestra base de datos. Por favor, complete su perfil." });
            }

            // Devuelve el perfil del usuario (el método toJSON limpiará campos sensibles)
            return res.status(200).json({ user: userProfile.toJSON() });

        } catch (error) {
            console.error('Error al obtener el perfil del usuario actual:', error);
            return res.status(500).json({ message: 'Error interno del servidor al obtener el perfil.', error: error.message });
        }
    }
}