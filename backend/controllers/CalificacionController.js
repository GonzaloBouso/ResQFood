import mongoose from 'mongoose';
import Calificacion from '../models/Calificacion.js';
import User from '../models/User.js';
import Entrega from '../models/Entrega.js';
import Notificacion from '../models/Notificacion.js';
import { getIoInstance, getSocketIdForUser } from '../socket.js';

export class CalificacionController {
    static async createCalificacion(req, res){
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const calificadorClerkId = req.auth?.userId;
            const calificador = await User.findOne({ clerkUserId: calificadorClerkId }).session(session);
            if (!calificador) throw new Error('Usuario calificador no encontrado.');
            
            const { calificadoId, puntuacion, entregaId } = req.body;

            // 1. Verificar la entrega
            const entrega = await Entrega.findById(entregaId).session(session);
            if (!entrega) throw new Error('La entrega asociada no existe.');
            if (entrega.calificacionRealizada) throw new Error('Esta entrega ya ha sido calificada.');

            // 2. Crear y guardar la calificación
            const nuevaCalificacion = new Calificacion({ ...req.body, calificadorId: calificador._id });
            await nuevaCalificacion.save({ session });

            // 3. Marcar la entrega como calificada
            entrega.calificacionRealizada = true;
            await entrega.save({ session });

            // 4. Encontrar y actualizar al usuario calificado
            const usuarioCalificado = await User.findById(calificadoId).session(session);
            if (!usuarioCalificado) throw new Error('Usuario calificado no encontrado.');
            
            
            if (!usuarioCalificado.calificaciones) {
                usuarioCalificado.calificaciones = { promedio: 0, totalCalificaciones: 0 };
            }
         
            const totalPuntuacionAnterior = usuarioCalificado.calificaciones.promedio * usuarioCalificado.calificaciones.totalCalificaciones;
            const nuevoTotalCalificaciones = usuarioCalificado.calificaciones.totalCalificaciones + 1;
            const nuevoPromedio = (totalPuntuacionAnterior + puntuacion) / nuevoTotalCalificaciones;

            usuarioCalificado.calificaciones.totalCalificaciones = nuevoTotalCalificaciones;
            usuarioCalificado.calificaciones.promedio = nuevoPromedio;
            await usuarioCalificado.save({ session });
            
            // 5. Crear y enviar notificación
            const notificacion = new Notificacion({
                destinatarioId: usuarioCalificado._id,
                tipoNotificacion: 'NUEVA_CALIFICACION',
                mensaje: `${calificador.nombre} te ha calificado con ${puntuacion} estrellas.`,
                referenciaId: nuevaCalificacion._id,
                tipoReferencia: 'Calificacion',
                enlace: '/mi-perfil'
            });
            await notificacion.save({ session });

            const io = getIoInstance();
            const donanteSocketId = getSocketIdForUser(usuarioCalificado.clerkUserId);
            if (donanteSocketId) {
                io.to(donanteSocketId).emit('nueva_notificacion', notificacion.toObject());
            }

            // 6. Confirmar transacción
            await session.commitTransaction();
            res.status(201).json({ message: 'Calificación creada exitosamente', calificacion: nuevaCalificacion });

        } catch (error) {
            await session.abortTransaction();
            console.error("--- ERROR EN createCalificacion ---:", error);
            res.status(500).json({ message: error.message || 'Error al crear la calificación' });
        } finally {
            session.endSession();
        }
    }

    static async getCalificacionesRecibidas(req, res) {
        try {
            const { userId } = req.params;
            const calificaciones = await Calificacion.find({ calificadoId: userId })
                .populate('calificadorId', 'nombre fotoDePerfilUrl')
                .sort({ createdAt: -1 });
            
            res.status(200).json({ calificaciones });
        } catch (error) {
            console.error("Error al obtener calificaciones recibidas:", error);
            res.status(500).json({ message: 'Error al obtener calificaciones' });
        }
    }
}