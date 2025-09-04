import User from '../models/User.js';
import { updateUserSchema, completeInitialProfileSchema, createUserSchema } from '../validations/UserValidation.js';
import { z } from 'zod';
import { clerkClient } from '@clerk/clerk-sdk-node';

import mongoose from 'mongoose';

export class UserController {

    static async createProfileFromFrontend(req, res) {
        // Obtenemos el ID del usuario directamente del token verificado por el middleware.
        const clerkUserId = req.auth?.userId;
        if (!clerkUserId) {
            return res.status(401).json({ message: 'No autenticado.' });
        }
         console.log(`[createProfile] Iniciando para clerkUserId: ${clerkUserId}`);
         console.log("[createProfile] Body recibido:", req.body);

        try {
           // 1. Valida los datos del formulario primero. Si falla, no hacemos nada más.
            const validatedData = completeInitialProfileSchema.parse(req.body);

            // 2. Verifica si el usuario ya tiene un perfil COMPLETO (con rol).
            const existingUser = await User.findOne({ clerkUserId });
            if (existingUser && existingUser.rol) {
                console.warn(`[createProfile] Conflicto: Perfil para ${clerkUserId} ya está completo.`);
                return res.status(409).json({ message: 'El perfil para este usuario ya ha sido creado.' });
            }
            
            // 3. Obtiene datos frescos de la API de Clerk.
            console.log(`[createProfile] Obteniendo datos de Clerk API para ${clerkUserId}...`);
            

            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            

            console.log("[createProfile] Datos de Clerk API obtenidos.");

            const primaryEmail = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;

            if (!primaryEmail) {
              return res.status(400).json({ message: 'No se pudo encontrar un email principal para este usuario en Clerk.' });
            }

            // 4. Prepara el objeto de datos completo para la base de datos.
            const userProfileData = {
                ...validatedData, // Datos del formulario (rol, nombre, ubicación, etc.)
                clerkUserId: clerkUserId,
                email: primaryEmail,
                fotoDePerfilUrl: clerkUser.imageUrl,
            };

            // 5. Utiliza findOneAndUpdate con upsert. Es la forma más robusta.
            //    - Si el webhook creó un usuario básico, esto lo ACTUALIZARÁ.
            //    - Si el webhook falló, esto lo CREARÁ.
            console.log("[createProfile] Guardando perfil en la base de datos con upsert...", userProfileData);
            const updatedOrCreatedUser = await User.findOneAndUpdate(
                { clerkUserId: clerkUserId },   // Condición de búsqueda
                { $set: userProfileData },      // Datos para establecer/actualizar
                { new: true, upsert: true, runValidators: true } // Opciones
            );
            
            console.log(`[createProfile] ¡Éxito! Perfil para ${clerkUserId} guardado en DB.`);
            return res.status(201).json({ message: 'Perfil creado exitosamente', user: updatedOrCreatedUser.toJSON() });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Error de validación al crear el perfil.', errors: error.errors });
            }
             // Logueamos el error completo para verlo en Render
            console.error('ERROR CRÍTICO en createProfileFromFrontend:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' })
        }
    }


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
        if (!clerkUserId) { return res.status(401).json({ message: 'No autenticado.' }); }

        try {
            const userToUpdate = await User.findOne({ clerkUserId });
            if (!userToUpdate) { return res.status(404).json({ message: 'Usuario no encontrado.' }); }

            const validatedData = updateUserSchema.parse(req.body);

            // --- Actualización Manual y Segura (Evita errores de Object.assign) ---
            if (validatedData.nombre !== undefined) userToUpdate.nombre = validatedData.nombre;
            if (validatedData.telefono !== undefined) userToUpdate.telefono = validatedData.telefono;
            if (validatedData.ubicacion) userToUpdate.ubicacion = { ...userToUpdate.ubicacion?.toObject(), ...validatedData.ubicacion };
            if (validatedData.localData) userToUpdate.localData = { ...userToUpdate.localData?.toObject(), ...validatedData.localData };
            
            await userToUpdate.save();
            return res.status(200).json({ message: 'Perfil actualizado exitosamente', user: userToUpdate.toJSON() });

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('ERROR DE VALIDACIÓN ZOD:', JSON.stringify(error.errors, null, 2));
                return res.status(400).json({ message: 'Error de validación.', errors: error.errors });
            }
            console.error('Error GENÉRICO al actualizar perfil:', error);
            return res.status(500).json({ message: 'Error interno del servidor.', errorDetails: error.message });
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

            // 1. Identificar al administrador que realiza la acción
            const adminClerkId = req.auth.userId; 
            if (!adminClerkId) {
                return res.status(401).json({ message: "No autenticado." });
            }
            
            const adminUser = await User.findOne({ clerkUserId: adminClerkId });
            if (!adminUser) {
                return res.status(403).json({ message: "Perfil de administrador no encontrado." });
            }

            // 2. Validar el ID del usuario a modificar
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID de usuario inválido." });
            }
            
            const userToManage = await User.findById(id);
            if (!userToManage) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            // 3. Preparar el registro de cambios para la bitácora
            const cambios = { antes: {}, despues: {} };
            let accionRealizada = "Gestión de usuario"; 
            let huboCambios = false; 

            // 4. Aplicar cambios
            if (rol !== undefined && userToManage.rol !== rol) {
                cambios.antes.rol = userToManage.rol;
                cambios.despues.rol = rol;
                userToManage.rol = rol;
                huboCambios = true;
                accionRealizada = `Cambio de rol para ${userToManage.nombre}`;
            }

            if (activo !== undefined && userToManage.activo !== activo) {
                cambios.antes.activo = userToManage.activo;
                cambios.despues.activo = activo;
                
                await clerkClient.users.updateUser(userToManage.clerkUserId, { banned: !activo });
                
                userToManage.activo = activo;
                huboCambios = true;
                accionRealizada = activo ? `Reactivación del usuario ${userToManage.nombre}` : `Suspensión del usuario ${userToManage.nombre}`;
            }
            
            // 5. Guardar cambios si hubo
            if (huboCambios) {
                await userToManage.save();

                // 6. Crear el registro en la Bitácora
                try {
                    const logEntry = new Bitacora({
                        actorId: adminUser._id,
                        accion: accionRealizada,
                        tipoElementoAfectado: 'User',
                        elementoAfectadoId: userToManage._id,
                        justificacionOMotivo: `Cambios realizados desde el panel de administrador.`,
                        detallesAdicionales: cambios,
                        ipAddress: req.ip
                    });
                    await logEntry.save();
                } catch (logError) {
                    console.error("ADVERTENCIA: Fallo al guardar el registro en la bitácora:", logError);
                }
            }
            
            // 7. Enviar respuesta exitosa
            res.status(200).json({ message: 'Usuario actualizado por el administrador.', user: userToManage.toJSON() });

        } catch (error) {
            console.error("Error crítico en manageUser:", error);
            
            if (error.clerkError) {
                 return res.status(502).json({ message: "Error al actualizar estado en el servicio de autenticación." });
            }
            res.status(500).json({ message: "Error interno del servidor al gestionar el usuario." });
        }
    }
}