import mongoose from 'mongoose'; 
import Donacion from '../models/Donacion.js';
import User from '../models/User.js'; 
import { createDonacionSchema /*, updateDonacionSchema */ } from '../validations/DonacionValidation.js'; // Importa también updateDonacionSchema cuando lo crees
import { z } from 'zod';
import multer from 'multer'; // Necesario para instanceof multer.MulterError

export class DonacionController {
    /**
     * Crea una nueva donación.
     */
    static async createDonacion(req, res) {
        try {
            let ubicacionRetiroData = req.body.ubicacionRetiro 
                ? JSON.parse(req.body.ubicacionRetiro) 
                : {};

            if (!ubicacionRetiroData.coordenadas || 
                !Array.isArray(ubicacionRetiroData.coordenadas.coordinates) || 
                ubicacionRetiroData.coordenadas.coordinates.length !== 2) {
                console.warn("Coordenadas no proporcionadas o inválidas para ubicacionRetiro en createDonacion. Usando [0,0] por defecto.");
                ubicacionRetiroData.coordenadas = { 
                    type: 'Point',
                    coordinates: [0, 0] // MongoDB espera [longitud, latitud]
                };
            } else if (ubicacionRetiroData.coordenadas && !ubicacionRetiroData.coordenadas.type) {
                ubicacionRetiroData.coordenadas.type = 'Point';
            }

            const textData = {
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                categoria: req.body.categoria,
                fechaVencimientoProducto: req.body.fechaVencimientoProducto || null,
                fechaElaboracion: req.body.fechaElaboracion || null,
                ubicacionRetiro: ubicacionRetiroData,
                estadoAlimento: req.body.estadoAlimento,
                fechaExpiracionPublicacion: req.body.fechaExpiracionPublicacion,
                informacionContactoAlternativa: req.body.informacionContactoAlternativa 
                    ? JSON.parse(req.body.informacionContactoAlternativa) 
                    : undefined,
                condicionesEspeciales: req.body.condicionesEspeciales || null,
            };
            
            console.log("Datos para validar con Zod (createDonacion):", JSON.stringify(textData, null, 2));
            const validatedData = createDonacionSchema.parse(textData);
            console.log("Datos validados por Zod (createDonacion):", JSON.stringify(validatedData, null, 2));

            const donanteClerkId = req.auth?.userId;
            if (!donanteClerkId) {
                return res.status(401).json({ message: "No autenticado." });
            }
            const donante = await User.findOne({ clerkUserId: donanteClerkId, activo: true });
            if (!donante) {
                return res.status(403).json({ message: "Usuario donante no encontrado o no activo." });
            }
            if (!['GENERAL', 'LOCAL'].includes(donante.rol)) {
                return res.status(403).json({ message: "Rol no permitido para donar." });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ 
                    message: "Error de validación", 
                    errors: [{ path: ['imagenesDonacion'], message: "Se requiere al menos una imagen para la donación." }] 
                });
            }
            const imagenesUrl = req.files.map(file => file.path);

            const nuevaDonacionPayload = {
                ...validatedData,
                imagenesUrl: imagenesUrl,
                donanteId: donante._id,
                estadoPublicacion: 'DISPONIBLE',
                // Mongoose convertirá los strings ISO validados por Zod a tipo Date
                fechaVencimientoProducto: validatedData.fechaVencimientoProducto, // Ya es string ISO o null
                fechaElaboracion: validatedData.fechaElaboracion,       // Ya es string ISO o null
                fechaExpiracionPublicacion: validatedData.fechaExpiracionPublicacion, // Ya es string ISO
            };
            
            const nuevaDonacion = new Donacion(nuevaDonacionPayload);
            
            console.log("Objeto Donacion ANTES de guardar:", JSON.stringify(nuevaDonacion.toObject(), null, 2));
            await nuevaDonacion.save();
            console.log("Donacion GUARDADA exitosamente.");

            donante.totalDonacionesHechas = (donante.totalDonacionesHechas || 0) + 1;
            if (donante.rol === 'LOCAL' && donante.localData) {
                donante.localData.totalDonacionesHechas = (donante.localData.totalDonacionesHechas || 0) + 1;
            } else if (donante.rol === 'GENERAL' && donante.estadisticasGenerales) {
                donante.estadisticasGenerales.totalDonacionesHechas = (donante.estadisticasGenerales.totalDonacionesHechas || 0) + 1;
            }
            await donante.save();

            res.status(201).json({ message: 'Donación creada exitosamente', donacion: nuevaDonacion.toJSON() });

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Error de validación Zod en createDonacion:', error.errors);
                return res.status(400).json({ message: 'Error de validación', errors: error.errors });
            }
            if (error instanceof multer.MulterError) {
                console.error('Error de Multer:', error);
                return res.status(400).json({ message: `Error de subida de archivo: ${error.message}` });
            }
            if (error.name === 'MongoServerError' && error.code === 16755) {
                 console.error('Error de MongoDB Geo Keys:', error.errmsg);
                 return res.status(500).json({ message: 'Error con los datos de geolocalización.', details: error.errmsg });
            }
            console.error('Error general al crear donación:', error);
            res.status(500).json({ message: 'Error interno del servidor al crear la donación', errorDetails: error.message });
        }
    }

    /**
     * Obtener todas las donaciones (con posible paginación y filtros a futuro)
     */
    static async getDonations(req, res) {
        try {
            // TODO: Implementar lógica de paginación y filtros
            const donaciones = await Donacion.find({ estadoPublicacion: 'DISPONIBLE' }) // Ejemplo: solo las disponibles
                .populate('donanteId', 'nombre fotoDePerfilUrl ubicacion.ciudad') // Traer algunos datos del donante
                .sort({ createdAt: -1 }); // Ordenar por más recientes

            res.status(200).json({ donaciones });
        } catch (error) {
            console.error('Error al obtener donaciones:', error);
            res.status(500).json({ message: 'Error interno al obtener donaciones', errorDetails: error.message });
        }
    }

    static async getDonacionesByUsuario(req, res) {
        try {
            const userId = req.params.id;

            const donaciones = await Donacion.find({ donanteId: userId })
            .sort({ createdAt: -1 }); // las más recientes primero

            res.status(200).json({ donaciones });
        } catch (error) {
            console.error('Error al obtener las donaciones del usuario:', error);
            res.status(500).json({
            message: 'Error interno al obtener las donaciones del usuario',
            errorDetails: error.message,
            });
        }
        }

    /**
     * Obtener una donación específica por su ID
     */
    static async getDonationById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) { // Necesitas importar mongoose para esto
                 return res.status(400).json({ message: 'ID de donación inválido.' });
            }
            const donacion = await Donacion.findById(id)
                .populate('donanteId', 'nombre fotoDePerfilUrl ubicacion.ciudad calificacionPromedioComoDonante');

            if (!donacion) {
                return res.status(404).json({ message: 'Donación no encontrada.' });
            }
            res.status(200).json({ donacion: donacion.toJSON() }); // Usar toJSON si lo tienes definido
        } catch (error) {
            console.error('Error al obtener donación por ID:', error);
            res.status(500).json({ message: 'Error interno al obtener la donación', errorDetails: error.message });
        }
    }
    
    static async getDonacionesCercanas(req, res) {
        const { lat, lon, distanciaMaxKm = 10 } = req.query; // distanciaMaxKm por defecto 10km

        if (!lat || !lon) {
            return res.status(400).json({ message: "Latitud y longitud son requeridas." });
        }

        const latitud = parseFloat(lat);
        const longitud = parseFloat(lon);
        const maxDistanciaMetros = parseFloat(distanciaMaxKm) * 1000; // Convertir km a metros

        if (isNaN(latitud) || isNaN(longitud) || isNaN(maxDistanciaMetros)) {
            return res.status(400).json({ message: "Valores de latitud, longitud o distancia inválidos." });
        }

        try {
            const donacionesCercanas = await Donacion.find({
                'ubicacionRetiro.coordenadas': {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitud, latitud] // MongoDB espera [longitud, latitud]
                        },
                        $maxDistance: maxDistanciaMetros 
                    }
                },
                estadoPublicacion: 'DISPONIBLE', // Solo donaciones disponibles
                fechaExpiracionPublicacion: { $gte: new Date() } // Que no hayan expirado
            })
            .populate('donanteId', 'nombre fotoDePerfilUrl') // Traer datos del donante
            .sort({ 'ubicacionRetiro.coordenadas': 1 }); // Ordenar por cercanía (implícito con $nearSphere, pero puede ser explícito)
                                                        // O podrías querer otro orden, como createdAt: -1

            // MongoDB con $nearSphere ya devuelve los resultados ordenados por distancia.
            // Si quieres añadir la distancia al resultado, necesitarías una agregación.
            // Por ahora, solo devolvemos las donaciones ordenadas.

            res.status(200).json({ donaciones: donacionesCercanas });

        } catch (error) {
            console.error('Error al obtener donaciones cercanas:', error);
            res.status(500).json({ message: 'Error interno al buscar donaciones cercanas.', errorDetails: error.message });
        }
    }

    /**
     * Actualizar una donación existente
     */
    static async updateDonation(req, res) {
        try {
            const { id } = req.params; // ID de la donación a actualizar
            const donanteClerkId = req.auth?.userId;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                 return res.status(400).json({ message: 'ID de donación inválido.' });
            }

            // Validar datos de entrada (necesitarás un updateDonacionSchema en DonacionValidation.js)
            // const validatedData = updateDonacionSchema.parse(req.body); 
            const validatedData = req.body; // Temporalmente, sin validación Zod para update

            const donacion = await Donacion.findById(id);
            if (!donacion) {
                return res.status(404).json({ message: 'Donación no encontrada.' });
            }

            // Verificar que el usuario logueado sea el donante de la publicación
            const userDonante = await User.findById(donacion.donanteId);
            if (!userDonante || userDonante.clerkUserId !== donanteClerkId) {
                return res.status(403).json({ message: 'No tiene permiso para modificar esta donación.' });
            }
            
            // Actualizar campos (excluir donanteId, estadoPublicacion si se maneja por otro flujo)
            // Necesitas una lógica cuidadosa aquí para qué campos se pueden actualizar.
            // Ejemplo:
            // if (validatedData.titulo) donacion.titulo = validatedData.titulo;
            // if (validatedData.descripcion) donacion.descripcion = validatedData.descripcion;
            // ... etc.

            Object.assign(donacion, validatedData); // Cuidado con esto, podría permitir actualizar campos no deseados
                                                  // Es mejor actualizar campo por campo explícitamente.

            // Manejar actualización de imágenes si se permite (más complejo)

            await donacion.save();
            res.status(200).json({ message: 'Donación actualizada exitosamente', donacion: donacion.toJSON() });

        } catch (error) {
            // if (error instanceof z.ZodError) { ... }
            console.error('Error al actualizar donación:', error);
            res.status(500).json({ message: 'Error interno al actualizar la donación', errorDetails: error.message });
        }
    }


    /**
     * Eliminar una donación
     */
    static async deleteDonation(req, res) {
        try {
            const { id } = req.params;
            const donanteClerkId = req.auth?.userId;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                 return res.status(400).json({ message: 'ID de donación inválido.' });
            }

            const donacion = await Donacion.findById(id);
            if (!donacion) {
                return res.status(404).json({ message: 'Donación no encontrada.' });
            }

            const userDonante = await User.findById(donacion.donanteId);
            if (!userDonante || userDonante.clerkUserId !== donanteClerkId) {
                return res.status(403).json({ message: 'No tiene permiso para eliminar esta donación.' });
            }

            // En lugar de eliminar, podrías cambiar estadoPublicacion a 'CANCELADA_DONANTE' o 'ELIMINADA'
            // await Donacion.findByIdAndDelete(id); // Eliminación física
            donacion.estadoPublicacion = 'CANCELADA_DONANTE'; // O ELIMINADA
            await donacion.save();


            // Opcional: Decrementar contador de donaciones del usuario si es una eliminación lógica que cuenta
            // userDonante.totalDonacionesHechas = Math.max(0, (userDonante.totalDonacionesHechas || 0) - 1);
            // await userDonante.save();

            res.status(200).json({ message: 'Donación eliminada/cancelada exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar donación:', error);
            res.status(500).json({ message: 'Error interno al eliminar la donación', errorDetails: error.message });
        }
    }
}