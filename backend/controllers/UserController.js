// src/controllers/UserController.js
import User from '../models/User.js';
import { updateUserSchema, completeInitialProfileSchema, createUserSchema } from '../validations/UserValidation.js';
import { z } from 'zod';

export class UserController {
    // ... (createUser se mantiene igual) ...

    static async updateUser(req, res) {
        const { clerkUserId } = req.params;
        const loggedInUserId = req.auth?.userId;

        if (!loggedInUserId || clerkUserId !== loggedInUserId) {
            const message = !loggedInUserId ? 'No autenticado. Token no encontrado o inválido.' : 'No tiene permiso para modificar este usuario.';
            return res.status(!loggedInUserId ? 401 : 403).json({ message });
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
            }

            // Aplicar datos validados
            Object.keys(validatedData).forEach(key => {
                if (validatedData[key] !== undefined) {
                    if (key === "ubicacion" && typeof validatedData[key] === 'object' && validatedData[key] !== null) {
                        // Si se actualiza la ubicación, asegurarse de que las coordenadas estén bien formadas
                        const ubicacionInput = validatedData[key];
                        
                        userToUpdate.ubicacion = userToUpdate.ubicacion || {}; // Asegurar que el objeto exista
                        Object.assign(userToUpdate.ubicacion, ubicacionInput); // Asignar campos de dirección, ciudad, etc.

                        // Manejo de coordenadas: si no vienen o son inválidas, usar [0,0] o no setear si son opcionales
                        // Esto asume que tu ubicacionSchema en Mongoose tiene coordenadas: { type: { type: String, default: 'Point'}, coordinates: [Number] }
                        // y que si Mongoose requiere 'coordinates', debemos proveerlo.
                        if (ubicacionInput.coordenadas && 
                            Array.isArray(ubicacionInput.coordenadas.coordinates) && 
                            ubicacionInput.coordenadas.coordinates.length === 2) {
                            userToUpdate.ubicacion.coordenadas = {
                                type: 'Point',
                                coordinates: ubicacionInput.coordenadas.coordinates // [lon, lat]
                            };
                        } else if (userToUpdate.ubicacion && !userToUpdate.ubicacion.coordenadas?.coordinates?.length) {
                            // Si no se envían coordenadas pero la ubicación se está actualizando,
                            // y tu modelo Mongoose requiere el array `coordinates`,
                            // podrías poner un default o geocodificar.
                            // Si Mongoose NO requiere `coordinates` y solo `type: 'Point'`, está bien.
                            // Para que el índice 2dsphere funcione, necesita `coordinates`.
                            console.warn(`Coordenadas no proporcionadas o inválidas para la actualización de ubicación del usuario ${clerkUserId}. Estableciendo a [0,0].`);
                            userToUpdate.ubicacion.coordenadas = { type: 'Point', coordinates: [0, 0] };
                        }
                        // Si no se envía `ubicacionInput.coordenadas` y `userToUpdate.ubicacion.coordenadas` ya existe,
                        // esta lógica lo mantendrá. Si quieres borrarlo, tendrías que enviar `null`.

                    } else if (key === "localData" && userToUpdate[key] && typeof validatedData[key] === 'object' && validatedData[key] !== null) {
                        Object.assign(userToUpdate[key], validatedData[key]);
                    } else {
                        userToUpdate[key] = validatedData[key];
                    }
                }
            });
            
            console.log("Usuario ANTES de pre-save y save:", JSON.stringify(userToUpdate.toObject(), null, 2));
            await userToUpdate.save(); // El hook pre('save') se ejecutará aquí
            
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

    // ... (getCurrentUserProfile se mantiene igual) ...
     static async getCurrentUserProfile(req, res) { /* ... tu código actual está bien ... */ }
}