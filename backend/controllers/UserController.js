import User from '../models/User.js';
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
            const newUser = new User(validatedData);
            await newUser.save();
            res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser.toJSON() });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Error de validación al crear usuario', errors: error.errors });
            }
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Conflicto: El usuario ya existe.', details: error.keyValue });
            }
            res.status(500).json({ message: 'Error al crear el usuario', errorDetails: error.message });
        }
    }

    static async updateUser(req, res) {
        const { clerkUserId } = req.params;
        const loggedInUserId = req.auth?.userId;

        if (!loggedInUserId || clerkUserId !== loggedInUserId) {
            return res.status(403).json({ message: 'No tiene permiso para modificar este usuario.' });
        }

        try {
            const userToUpdate = await User.findOne({ clerkUserId });
            if (!userToUpdate) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const isCompletingProfile = userToUpdate.rol === null;
            const validationSchema = isCompletingProfile ? completeInitialProfileSchema : updateUserSchema;
            const validatedData = validationSchema.parse(req.body);

            if (validatedData.ubicacion) {
                const coords = validatedData.ubicacion.coordenadas?.coordinates;
                const areCoordsValid = Array.isArray(coords) && coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number';

                if (!areCoordsValid) {
                    console.warn(`Coordenadas inválidas o ausentes para el usuario ${clerkUserId}. Se establecerá el valor por defecto [0, 0].`);
                    validatedData.ubicacion.coordenadas = { type: 'Point', coordinates: [0, 0] };
                }
            }
            
            Object.keys(validatedData).forEach(key => {
                const value = validatedData[key];
                if (value !== undefined) {
                    if ((key === "ubicacion" || key === "localData") && typeof value === 'object' && value !== null) {
                        userToUpdate[key] = { ...(userToUpdate[key]?.toObject() || {}), ...value };
                    } else {
                        userToUpdate[key] = value;
                    }
                }
            });

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
    
    static async getCurrentUserProfile(req, res) {
        try {
            const clerkUserId = req.auth?.userId;
            if (!clerkUserId) {
                return res.status(401).json({ message: "No autenticado o ID de usuario no encontrado en el token." });
            }
            const userProfile = await User.findOne({ clerkUserId });
            if (!userProfile) {
                return res.status(404).json({ message: "Perfil de usuario no encontrado en nuestra base de datos." });
            }
            return res.status(200).json({ user: userProfile.toJSON() });
        } catch (error) {
            console.error('Error al obtener el perfil del usuario actual:', error);
            return res.status(500).json({ message: 'Error interno del servidor al obtener el perfil.', errorDetails: error.message });
        }
    }
}