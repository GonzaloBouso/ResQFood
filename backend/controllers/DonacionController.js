import mongoose from 'mongoose';
import Donacion from '../models/Donacion.js';
import User from '../models/User.js';
import { createDonacionSchema } from '../validations/DonacionValidation.js';
import { z } from 'zod';
import multer from 'multer';

export class DonacionController {

    static async createDonacion(req, res) {
        try {
            const textData = {
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                categoria: req.body.categoria,
                fechaVencimientoProducto: req.body.fechaVencimientoProducto || null,
                fechaElaboracion: req.body.fechaElaboracion || null,
                ubicacionRetiro: req.body.ubicacionRetiro ? JSON.parse(req.body.ubicacionRetiro) : {},
                estadoAlimento: req.body.estadoAlimento,
                fechaExpiracionPublicacion: req.body.fechaExpiracionPublicacion,
                informacionContactoAlternativa: req.body.informacionContactoAlternativa ? JSON.parse(req.body.informacionContactoAlternativa) : undefined,
                condicionesEspeciales: req.body.condicionesEspeciales || null,
            };

            const validatedData = createDonacionSchema.parse(textData);

            const donanteClerkId = req.auth?.userId;
            const donante = await User.findOne({ clerkUserId: donanteClerkId, activo: true });

            if (!donante) {
                return res.status(403).json({ message: "Usuario donante no encontrado o no activo." });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "Se requiere al menos una imagen para la donación." });
            }

            const nuevaDonacion = new Donacion({
                ...validatedData,
                imagenesUrl: req.files.map(file => file.path),
                donanteId: donante._id,
                estadoPublicacion: 'DISPONIBLE',
            });

            await nuevaDonacion.save();

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
            console.error('Error general al crear donación:', error);
            res.status(500).json({ message: 'Error interno del servidor al crear la donación', errorDetails: error.message });
        }
    }

    static async getDonations(req, res) {
        try {
            const donaciones = await Donacion.find({ estadoPublicacion: 'DISPONIBLE' })
                .populate('donanteId', 'nombre fotoDePerfilUrl ubicacion.ciudad')
                .sort({ createdAt: -1 });

            res.status(200).json({ donaciones });
        } catch (error) {
            console.error('Error al obtener donaciones:', error);
            res.status(500).json({ message: 'Error interno al obtener donaciones', errorDetails: error.message });
        }
    }

    static async getPublicDonations(req, res) {
        try {
            // Buscamos las últimas 10 donaciones que estén DISPONIBLES
            const donaciones = await Donacion.find({ estadoPublicacion: 'DISPONIBLE' })
                .sort({ createdAt: -1 }) // Ordena para mostrar las más recientes primero
                .limit(10) // Limita el resultado a las últimas 10 para no sobrecargar la homepage
                // Selecciona solo los campos necesarios para la tarjeta de vista limitada
                .select('titulo imagenesUrl categoria donanteId') 
                .populate('donanteId', 'nombre fotoDePerfilUrl'); // Obtiene nombre y foto del donante

            res.status(200).json({ donaciones });
        } catch (error) {
            console.error('Error al obtener donaciones públicas:', error);
            res.status(500).json({ message: 'Error interno al obtener las donaciones' });
        }
    }

    static async getDonacionesByUsuario(req, res) {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario inválido.' });
        }

       
        const donaciones = await Donacion.find({ 
            donanteId: userId,
            estadoPublicacion: { $in: ['DISPONIBLE', 'PENDIENTE-ENTREGA'] } 
        })
        .populate('donanteId', 'nombre fotoDePerfilUrl') 
        .sort({ createdAt: -1 });

        res.status(200).json({ donaciones });
    } catch (error) {
        console.error('Error al obtener las donaciones del usuario:', error);
        res.status(500).json({
            message: 'Error interno al obtener las donaciones del usuario',
            errorDetails: error.message,
        });
    }
}

    static async getDonationById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID de donación inválido.' });
            }
            const donacion = await Donacion.findById(id)
                .populate('donanteId', 'nombre fotoDePerfilUrl ubicacion.ciudad calificacionPromedioComoDonante');

            if (!donacion) {
                return res.status(404).json({ message: 'Donación no encontrada.' });
            }
            res.status(200).json({ donacion: donacion.toJSON() });
        } catch (error) {
            console.error('Error al obtener donación por ID:', error);
            res.status(500).json({ message: 'Error interno al obtener la donación', errorDetails: error.message });
        }
    }

    static async getDonacionesCercanas(req, res) {
        const { lat, lon, distanciaMaxKm = 20 } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ message: "Latitud y longitud son requeridas." });
        }

        const latitud = parseFloat(lat);
        const longitud = parseFloat(lon);
        const maxDistanciaMetros = parseFloat(distanciaMaxKm) * 1000;

        if (isNaN(latitud) || isNaN(longitud) || isNaN(maxDistanciaMetros)) {
            return res.status(400).json({ message: "Valores de latitud, longitud o distancia inválidos." });
        }

        try {
            const donacionesCercanas = await Donacion.find({
                'ubicacionRetiro.coordenadas': {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitud, latitud]
                        },
                        $maxDistance: maxDistanciaMetros
                    }
                },
                estadoPublicacion: 'DISPONIBLE',
                fechaExpiracionPublicacion: { $gte: new Date() }
            })
            .populate('donanteId', 'nombre fotoDePerfilUrl');

            res.status(200).json({ donaciones: donacionesCercanas });

        } catch (error) {
            console.error('Error al obtener donaciones cercanas:', error);
            res.status(500).json({ message: 'Error interno al buscar donaciones cercanas.', errorDetails: error.message });
        }
    }

    static async updateDonation(req, res) {
        try {
            const { id } = req.params;
            const donanteClerkId = req.auth?.userId;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID de donación inválido.' });
            }

            const validatedData = req.body;

            const donacion = await Donacion.findById(id);
            if (!donacion) {
                return res.status(404).json({ message: 'Donación no encontrada.' });
            }

            const userDonante = await User.findById(donacion.donanteId);
            if (!userDonante || userDonante.clerkUserId !== donanteClerkId) {
                return res.status(403).json({ message: 'No tiene permiso para modificar esta donación.' });
            }

            Object.assign(donacion, validatedData);

            await donacion.save();
            res.status(200).json({ message: 'Donación actualizada exitosamente', donacion: donacion.toJSON() });

        } catch (error) {
            console.error('Error al actualizar donación:', error);
            res.status(500).json({ message: 'Error interno al actualizar la donación', errorDetails: error.message });
        }
    }

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

            donacion.estadoPublicacion = 'CANCELADA_DONANTE';
            await donacion.save();

            res.status(200).json({ message: 'Donación eliminada/cancelada exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar donación:', error);
            res.status(500).json({ message: 'Error interno al eliminar la donación', errorDetails: error.message });
        }
    }

    //historial solo finalizadas
    static async getDonacionesFinalizadasByUsuario(req, res) {
        try {
            const userId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario inválido.' });
            }

            const estadosFinalizados = ['ENTREGADA', 'CANCELADA_DONANTE', 'EXPIRADA'];

            const donaciones = await Donacion.find({
            donanteId: userId,
            estadoPublicacion: { $in: estadosFinalizados }
            }).sort({ createdAt: -1 });

            res.status(200).json({ donaciones });
        } catch (error) {
            console.error('Error al obtener historial finalizado:', error);
            res.status(500).json({ message: 'Error interno al obtener historial', errorDetails: error.message });
        }
    }

}