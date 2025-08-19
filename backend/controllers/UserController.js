import User from '../models/User.js';
import { updateUserSchema, completeInitialProfileSchema, createUserSchema } from '../validations/UserValidation.js';
import { z } from 'zod';
import clerk from '@clerk/clerk-sdk-node'; 
import clerkClient from '@clerk/clerk-sdk-node';

import mongoose from 'mongoose';

export class UserController {

    static async createProfileFromFrontend(req, res) {
        // Obtenemos el ID del usuario directamente del token verificado por el middleware.
        const clerkUserId = req.auth?.userId;
        if (!clerkUserId) {
            return res.status(401).json({ message: 'No autenticado.' });
        }

        try {
            // 1. Verifica si ya existe un perfil para este usuario para evitar duplicados.
            const existingUser = await User.findOne({ clerkUserId });
            if (existingUser) {
                return res.status(409).json({ message: 'El perfil para este usuario ya ha sido creado.' });
            }

            // 2. Valida los datos que vienen del formulario.
            const validatedData = completeInitialProfileSchema.parse(req.body);
            
            // 3. Obtiene los datos restantes (email, imagen) directamente desde la API de Clerk.
            const clerkUser = await clerk.users.getUser(clerkUserId);
            const primaryEmail = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;

            if (!primaryEmail) {
              return res.status(400).json({ message: 'No se pudo encontrar un email principal para este usuario en Clerk.' });
            }

            // 4. Combina todos los datos y crea el nuevo usuario.
            const newUser = new User({
                ...validatedData, // Datos del formulario (rol, nombre, ubicación, etc.)
                clerkUserId: clerkUserId,
                email: primaryEmail,
                fotoDePerfilUrl: clerkUser.imageUrl,
            });

            // 5. Guarda el nuevo usuario en la base de datos.
            await newUser.save();
            return res.status(201).json({ message: 'Perfil creado exitosamente', user: newUser.toJSON() });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Error de validación al crear el perfil.', errors: error.errors });
            }
            console.error('Error al crear el perfil desde el frontend:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', errorDetails: error.message });
        }
    }

    // --- MÉTODOS EXISTENTES (se mantienen para otras funcionalidades) ---

    // Método para obtener el perfil del usuario actual (usado por App.jsx)
    static async getCurrentUserProfile(req, res) {
        try {
            const clerkUserId = req.auth?.userId;
            if (!clerkUserId) {
                return res.status(401).json({ message: "No autenticado." });
            }
            const userProfile = await User.findOne({ clerkUserId });
            if (!userProfile) {
                // Esto es normal para un usuario nuevo que aún no ha completado su perfil.
                return res.status(404).json({ message: "Perfil de usuario no encontrado en nuestra base de datos." });
            }
            return res.status(200).json({ user: userProfile.toJSON() });
        } catch (error) {
            console.error('Error al obtener el perfil del usuario actual:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
    
    // Método para ACTUALIZAR el perfil de un usuario que YA EXISTE
    static async updateCurrentUserProfile(req, res) {
        const clerkUserId = req.auth?.userId;
        if (!clerkUserId) {
            return res.status(401).json({ message: 'No autenticado.' });
        }
        try {
            const userToUpdate = await User.findOne({ clerkUserId });
            if (!userToUpdate) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            const validatedData = updateUserSchema.parse(req.body);
            Object.assign(userToUpdate, validatedData);
            await userToUpdate.save();
            return res.status(200).json({ message: 'Perfil actualizado exitosamente', user: userToUpdate.toJSON() });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Error de validación.', errors: error.errors });
            }
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    // (Opcional) Método para que un admin actualice a cualquier usuario
    static async updateUser(req, res) {
        const { clerkUserId } = req.params;
        const loggedInUserId = req.auth?.userId;

        // Aquí podrías añadir lógica para un rol de 'admin'
        if (!loggedInUserId || clerkUserId !== loggedInUserId) {
            return res.status(403).json({ message: 'No tiene permiso para modificar este usuario.' });
        }
        // ...resto de la lógica de actualización
    }

    // (Opcional) Método para crear un usuario manualmente (vía webhook u otro sistema)
    static async createUser(req, res) {
        try {
            const validatedData = createUserSchema.parse(req.body);
            const newUser = new User(validatedData);
            await newUser.save();
            res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser.toJSON() });
        } catch (error) {
            // ...manejo de errores
        }
    }

    static async getUserProfileById(req, res) {
        try {
            const { id } = req.params;

            // Verificación de seguridad para asegurar que el ID es válido
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID de usuario inválido." });
            }

            // Buscamos al usuario por su _id de MongoDB
            // Seleccionamos solo los campos que queremos que sean públicos
            const userProfile = await User.findById(id).select(
                'nombre fotoDePerfilUrl rol ubicacion.ciudad ubicacion.provincia estadisticasGenerales'
            );

            if (!userProfile) {
                return res.status(404).json({ message: "Perfil de usuario no encontrado." });
            }

            return res.status(200).json({ user: userProfile.toJSON() });

        } catch (error) {
            console.error('Error al obtener el perfil del usuario por ID:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
    
     static async updateAvatar(req, res) {
        const clerkUserId = req.auth?.userId;
        if (!clerkUserId) {
            return res.status(401).json({ message: 'No autenticado.' });
        }

        try {
            // 1. Verificar si se subió un archivo
            if (!req.file) {
                return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
            }

            // 2. 'req.file.path' contiene la URL segura de Cloudinary gracias a multer-storage-cloudinary
            const newAvatarUrl = req.file.path;

            // 3. Encontrar al usuario y actualizar su fotoDePerfilUrl
            const updatedUser = await User.findOneAndUpdate(
                { clerkUserId },
                { fotoDePerfilUrl: newAvatarUrl },
                { new: true } // Devuelve el documento actualizado
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            // 4. Devolver el usuario actualizado para que el frontend pueda refrescar el estado
            res.status(200).json({ 
                message: 'Foto de perfil actualizada exitosamente.', 
                user: updatedUser.toJSON() 
            });

        } catch (error) {
            console.error('Error al actualizar el avatar:', error);
            res.status(500).json({ message: 'Error interno del servidor al actualizar el avatar.' });
        }
    }

   static async getAllUsers(req, res) {
    try {
        // --- 1. Paginación ---
        const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        const limit = parseInt(req.query.limit) || 10; // Resultados por página, por defecto 10
        const skip = (page - 1) * limit;

        // --- 2. Filtros y Búsqueda ---
        const query = {}; // Objeto de consulta inicial para MongoDB

        // Filtro por rol
        if (req.query.rol) {
            query.rol = req.query.rol;
        }

        // Búsqueda por nombre o email
        if (req.query.search) {
            const searchTerm = req.query.search;
            // Usamos una expresión regular para una búsqueda "case-insensitive"
            query.$or = [
                { nombre: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        
        // --- 3. Ejecutar la Consulta ---
        // Primero, contamos el número total de documentos que coinciden con la consulta (para la paginación)
        const totalUsers = await User.countDocuments(query);
        
        // Luego, buscamos los usuarios con la paginación aplicada
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // --- 4. Enviar la Respuesta ---
        res.status(200).json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
        });

    } catch (error) {
        console.error("Error al obtener todos los usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}
 static async manageUser(req, res) {
        try {
            const { id } = req.params;
            const { rol, activo } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID de usuario inválido." });
            }

            const userToManage = await User.findById(id);
            if (!userToManage) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            // --- SINCRONIZACIÓN CON CLERK (LA SINTAXIS CORRECTA) ---
            if (activo !== undefined && userToManage.activo !== activo) {
                if (activo === false) {
                    await clerkClient.users.disableUser(userToManage.clerkUserId);
                    console.log(`Usuario ${userToManage.clerkUserId} baneado en Clerk.`);
                } else {
                    // Y para desbanear es clerkClient.users.unbanUser(userId)
                    await clerkClient.users.enableUser(userToManage.clerkUserId);
                    console.log(`Usuario ${userToManage.clerkUserId} desbaneado en Clerk.`);
                }
            }

            // --- ACTUALIZACIÓN EN NUESTRA DB (sin cambios) ---
            if (rol !== undefined) userToManage.rol = rol;
            if (activo !== undefined) userToManage.activo = activo;

            await userToManage.save();

            res.status(200).json({ 
                message: 'Usuario actualizado por el administrador.', 
                user: userToManage.toJSON() 
            });

        } catch (error) {
            console.error("Error en manageUser:", error);
            if (error.clerkError) {
                 return res.status(502).json({ message: 'Error de Clerk:', details: error.errors });
            }
            res.status(500).json({ message: "Error interno del servidor al gestionar el usuario." });
        }
    }
} 