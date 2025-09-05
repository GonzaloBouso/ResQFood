import mongoose from 'mongoose';
import Calificacion from '../models/Calificacion.js';
import User from '../models/User.js';

export class CalificacionController {
    static async createCalificacion(req, res){
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const calificadorClerkId = req.auth?.userId;
            const calificador = await User.findOne({ clerkUserId: calificadorClerkId }).session(session);
            if (!calificador) {
                throw new Error('Usuario calificador no encontrado.');
            }
            
            const { calificadoId, puntuacion } = req.body;

            // 1. Crear y guardar la nueva calificación
            const nuevaCalificacion = new Calificacion({
                ...req.body,
                calificadorId: calificador._id
            });
            await nuevaCalificacion.save({ session });

            // 2. Encontrar al usuario calificado (el donante)
            const usuarioCalificado = await User.findById(calificadoId).session(session);
            if (!usuarioCalificado) {
                throw new Error('Usuario calificado no encontrado.');
            }

            // 3. Recalcular sus estadísticas de calificación
            const totalPuntuacionAnterior = (usuarioCalificado.calificaciones.promedio || 0) * (usuarioCalificado.calificaciones.totalCalificaciones || 0);
            const nuevoTotalCalificaciones = (usuarioCalificado.calificaciones.totalCalificaciones || 0) + 1;
            const nuevoPromedio = (totalPuntuacionAnterior + puntuacion) / nuevoTotalCalificaciones;

            // 4. Actualizar el documento del usuario calificado
            usuarioCalificado.calificaciones.totalCalificaciones = nuevoTotalCalificaciones;
            usuarioCalificado.calificaciones.promedio = nuevoPromedio;
            await usuarioCalificado.save({ session });
            
            // 5. Confirmar la transacción
            await session.commitTransaction();

            res.status(201).json({ message: 'Calificación creada exitosamente', calificacion: nuevaCalificacion });

        } catch (error) {
            await session.abortTransaction();
            console.error("Error al crear calificación:", error);
            res.status(500).json({ message:'Error al crear la calificación', error: error.message });
        } finally {
            session.endSession();
        }
    }
}