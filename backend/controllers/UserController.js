// backend/controllers/UserController.js
import User from '../models/User.js';
import { updateUserSchema, completeInitialProfileSchema, createUserSchema } from '../validations/UserValidation.js';
import { z } from 'zod';

export class UserController {
    // MÉTODO createUser COMPLETO Y FUNCIONAL
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
                console.error('Error de validación Zod en createUser:', JSON.stringify(error.errors, null, 2));
                return res.status(400).json({ message: 'Error de validación al crear usuario', errors: error.errors });
            }
            console.error('Error al crear usuario:', error);
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Conflicto: El usuario ya existe (ID de Clerk o email duplicado).', details: error.keyValue });
            }
            res.status(500).json({ message: 'Error al crear el usuario', errorDetails: error.message }); // Cambiado error.message a errorDetails
        }
    }

    // MÉTODO updateUser COMPLETO Y FUNCIONAL
    static async updateUser(req, res) {
        const { clerkUserId } = req.params;
        const loggedInUserId = req.auth?.userId;

        if (!loggedInUserId) {
             return res.status(401).json({ message: 'No autenticado. Token no encontrado o inválido.' });
        }
        if (clerkUserId !== loggedInUserId) {
             return res.status(403).json({ message: 'No tiene permiso para modificar este usuario.' });
        }

        try {
            const userToUpdate = await User.findOne({ clerkUserId });
            if (!userToUpdate) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            let validatedData;
            if (userToUpdate.rol === null) {
                console.log("Attempting to complete initial profile. Body:", req.body);
                validatedData = completeInitialProfileSchema.parse(req.body);
            } else {
                console.log("Attempting to update existing profile. Body:", req.body);
                validatedData = updateUserSchema.parse(req.body);
                if (validatedData.rol && validatedData.rol !== userToUpdate.rol) {
                    console.warn(`Intento de cambiar rol de ${userToUpdate.rol} a ${validatedData.rol} mediante actualización general. Verificando lógica.`);
                }
            }
            
            // Aplicar datos validados
            Object.keys(validatedData).forEach(key => {
                if (validatedData[key] !== undefined) {
                    // Manejo mejorado para subdocumentos anidados (ubicacion y localData)
                    if (key === "ubicacion" && typeof validatedData[key] === 'object' && validatedData[key] !== null) {
                        userToUpdate.ubicacion = userToUpdate.ubicacion || {}; // Asegurar que el objeto exista
                        Object.assign(userToUpdate.ubicacion, validatedData[key]); // Asignar campos
                        // Asegurar que coordenadas tenga el formato correcto si se provee, o un default
                        if (validatedData[key].coordenadas && 
                            Array.isArray(validatedData[key].coordenadas.coordinates) && 
                            validatedData[key].coordenadas.coordinates.length === 2) {
                            userToUpdate.ubicacion.coordenadas = {
                                type: 'Point',
                                coordinates: validatedData[key].coordenadas.coordinates
                            };
                        } else if (userToUpdate.ubicacion && (!userToUpdate.ubicacion.coordenadas || !userToUpdate.ubicacion.coordenadas.coordinates || userToUpdate.ubicacion.coordenadas.coordinates.length !== 2) ) {
                             // Si el esquema Mongoose requiere coordenadas para el índice 2dsphere,
                             // y no se envían o son inválidas, establecer un default.
                            console.warn(`Coordenadas no proporcionadas o inválidas para la ubicación del usuario ${clerkUserId} en updateUser. Estableciendo a [0,0].`);
                            userToUpdate.ubicacion.coordenadas = { type: 'Point', coordinates: [0, 0] };
                        }
                    } else if (key === "localData" && typeof validatedData[key] === 'object' && validatedData[key] !== null) {
                        userToUpdate.localData = userToUpdate.localData || {}; // Asegurar que el objeto exista
                        Object.assign(userToUpdate.localData, validatedData[key]);
                    } else {
                        userToUpdate[key] = validatedData[key];
                    }
                }
            });
            
            console.log("Usuario ANTES de pre-save y save en updateUser:", JSON.stringify(userToUpdate.toObject(), null, 2));
            await userToUpdate.save();
            
            return res.status(200).json({ message: 'Usuario actualizado exitosamente', user: userToUpdate.toJSON() });

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Error de validación Zod en updateUser:', JSON.stringify(error.errors, null, 2));
                return res.status(400).json({ message: 'Error de validación al actualizar usuario.', errors: error.errors });
            }
            console.error('Error al actualizar usuario: ', error);
            return res.status(500).json({ message: 'Error interno del servidor al actualizar usuario.', errorDetails: error.message });
        }
    }

    // MÉTODO getCurrentUserProfile COMPLETO Y FUNCIONAL
    static async getCurrentUserProfile(req, res) {
        try {
            const clerkUserId = req.auth?.userId;
            if (!clerkUserId) {
                return res.status(401).json({ message: "No autenticado o ID de usuario no encontrado en el token." });
            }
            const userProfile = await User.findOne({ clerkUserId: clerkUserId });
            if (!userProfile) {
                console.warn(`Perfil para clerkUserId ${clerkUserId} no encontrado en DB local (probablemente rol no seteado).`);
                return res.status(404).json({ message: "Perfil de usuario no encontrado en nuestra base de datos. Por favor, complete su perfil." });
            }
            return res.status(200).json({ user: userProfile.toJSON() });
        } catch (error) {
            console.error('Error al obtener el perfil del usuario actual:', error);
            return res.status(500).json({ message: 'Error interno del servidor al obtener el perfil.', errorDetails: error.message });
        }
    }
}