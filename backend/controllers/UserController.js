// src/controllers/UserController.js
import User from '../models/User.js';
// Importa los tres esquemas
import { updateUserSchema, completeInitialProfileSchema, createUserSchema } from '../validations/UserValidation.js';
import { z } from 'zod';

export class UserController {
    static async createUser(req, res) { // Este método es para creación directa vía API, no para el flujo de webhook de Clerk.
        try {
            // Aquí deberías usar un schema de Zod que sea estricto para la creación completa,
            // posiblemente un discriminatedUnion por rol si el rol se establece en la creación.
            // El createUserSchema actual es muy flexible.
            const validatedData = createUserSchema.parse(req.body);

            // Verificar si ya existe un usuario con ese clerkUserId o email
            const existingUser = await User.findOne({ 
                $or: [{ clerkUserId: validatedData.clerkUserId }, { email: validatedData.email }] 
            });
            if (existingUser) {
                return res.status(409).json({ message: 'Ya existe un usuario con ese ID de Clerk o email.' });
            }

            const nuevoUsuario = new User(validatedData);
            await nuevoUsuario.save(); // El pre('save') hook se ejecutará aquí

            res.status(201).json({ message: 'Usuario creado exitosamente', user: nuevoUsuario.toJSON() });
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Error de validación Zod en createUser:', error.errors);
                return res.status(400).json({ message: 'Error de validación al crear usuario', errors: error.errors });
            }
            console.error('Error al crear usuario:', error);
            // Considera si el error es por clave duplicada de MongoDB (aunque la verificación previa debería atraparlo)
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Conflicto: El usuario ya existe (ID de Clerk o email duplicado).', details: error.keyValue });
            }
            res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
        }
    }

    static async updateUser(req, res) {
        const { clerkUserId } = req.params;
        
        // --- Autenticación y Autorización ---
        // DESCOMENTA Y USA ESTO CUANDO EL FRONTEND ENVÍE TOKENS
        /*
        const loggedInUserId = req.auth?.userId; 
        if (!loggedInUserId) { // Si requireAuth no está o falló en poner req.auth
             return res.status(401).json({ message: 'No autenticado.' });
        }
        if (clerkUserId !== loggedInUserId) {
             return res.status(403).json({ message: 'No tiene permiso para modificar este usuario.' });
        }
        */
        // --- Fin Autenticación y Autorización ---

        try {
            const userToUpdate = await User.findOne({ clerkUserId });

            if (!userToUpdate) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            let validatedData;
            // Decide qué esquema usar:
            if (userToUpdate.rol === null) {
                // Es la primera vez que se completa el perfil (rol era null), usar el schema estricto.
                // El frontend debe enviar el 'rol' y todos los campos obligatorios para ese rol.
                console.log("Attempting to complete initial profile, validating with completeInitialProfileSchema. Body:", req.body);
                validatedData = completeInitialProfileSchema.parse(req.body);
            } else {
                // Es una actualización parcial de un perfil existente, usar el schema flexible.
                // El frontend solo envía los campos que quiere cambiar. 'rol' no debería cambiar aquí.
                console.log("Attempting to update existing profile, validating with updateUserSchema. Body:", req.body);
                validatedData = updateUserSchema.parse(req.body);
                if (validatedData.rol && validatedData.rol !== userToUpdate.rol) {
                    // Opcional: Impedir el cambio de rol a través de este endpoint de actualización general.
                    // El cambio de rol podría ser una operación administrativa separada.
                    // O si se permite, asegúrate de que tu pre('save') lo maneje bien.
                    console.warn(`Intento de cambiar rol de ${userToUpdate.rol} a ${validatedData.rol} mediante actualización general. Verificando lógica.`);
                    // Por ahora, permitiremos que el pre('save') maneje la lógica si el rol cambia.
                }
            }

            // Aplicar los datos validados al documento Mongoose
            // Object.assign puede ser muy simple. Para subdocumentos, es mejor ser más explícito
            // o asegurarse de que Mongoose maneje bien la fusión.
            Object.keys(validatedData).forEach(key => {
                if (validatedData[key] !== undefined) { // Solo actualiza si el campo está en el payload validado
                    if ((key === "ubicacion" || key === "localData") && userToUpdate[key] && typeof validatedData[key] === 'object' && validatedData[key] !== null) {
                        // Para subdocumentos, fusionar para permitir actualizaciones parciales del subdocumento
                        Object.assign(userToUpdate[key], validatedData[key]);
                    } else {
                        // Para campos primitivos o si el subdocumento se reemplaza completamente (o se crea)
                        userToUpdate[key] = validatedData[key];
                    }
                }
            });
            
            await userToUpdate.save(); // El hook pre('save') se ejecutará aquí
            
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
}