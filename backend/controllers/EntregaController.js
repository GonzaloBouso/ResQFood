import mongoose from 'mongoose';
import Entrega from '../models/Entrega.js';
import Solicitud from '../models/Solicitud.js';
import Donacion from '../models/Donacion.js';
import User from '../models/User.js';
import Notificacion from '../models/Notificacion.js';
import { getIoInstance, getSocketIdForUser } from '../socket.js';

export class EntregaController {

    static async confirmarHorario(req, res) {
        const { entregaId } = req.params;
        const receptorClerkId = req.auth?.userId;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const entrega = await Entrega.findById(entregaId).session(session);
            if (!entrega) {
                await session.abortTransaction(); session.endSession();
                return res.status(404).json({ message: 'Registro de entrega no encontrado.' });
            }

            const receptor = await User.findById(entrega.receptorId).session(session);
            if (receptor.clerkUserId !== receptorClerkId) {
                await session.abortTransaction(); session.endSession();
                return res.status(403).json({ message: 'No tienes permiso.' });
            }
            if (entrega.estadoEntrega !== 'PENDIENTE_CONFIRMACION_SOLICITANTE') {
                await session.abortTransaction(); session.endSession();
                return res.status(400).json({ message: 'Esta propuesta ya no es válida.' });
            }

            entrega.horarioEntregaConfirmadoSolicitante = true;
            entrega.fechaHorarioConfirmado = new Date();
            entrega.estadoEntrega = 'LISTA_PARA_RETIRO';

            const donante = await User.findById(entrega.donanteId).session(session);
            const donacion = await Donacion.findById(entrega.donacionId).select('titulo').session(session);
            const notificacion = new Notificacion({
                destinatarioId: donante._id,
                tipoNotificacion: 'GENERAL',
                mensaje: `¡${receptor.nombre} confirmó el retiro de "${donacion.titulo}"! Código: ${entrega.codigoConfirmacionReceptor}`,
                referenciaId: entrega._id,
                tipoReferencia: 'Entrega'
            });

            await entrega.save({ session });
            await notificacion.save({ session });

            const io = getIoInstance();
            const donanteSocketId = getSocketIdForUser(donante.clerkUserId);
            if (donanteSocketId) {
                io.to(donanteSocketId).emit('nueva_notificacion', notificacion.toObject());
            }
            
            await session.commitTransaction();
            res.status(200).json({ message: 'Horario confirmado.' });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ message: 'Error al confirmar horario.', errorDetails: error.message });
        } finally {
            session.endSession();
        }
    }

    static async completarEntrega(req, res) {
        const { entregaId } = req.params;
        const { codigoConfirmacion } = req.body;
        const donanteClerkId = req.auth?.userId;
        if (!codigoConfirmacion) return res.status(400).json({ message: 'Código requerido.' });

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const entrega = await Entrega.findById(entregaId).session(session);
            if (!entrega) {
                await session.abortTransaction(); session.endSession();
                return res.status(404).json({ message: 'Entrega no encontrada.' });
            }

            const donante = await User.findById(entrega.donanteId).session(session);
            if (donante.clerkUserId !== donanteClerkId) {
                await session.abortTransaction(); session.endSession();
                return res.status(403).json({ message: 'No tienes permiso.' });
            }
            if (entrega.codigoConfirmacionReceptor !== codigoConfirmacion) {
                await session.abortTransaction(); session.endSession();
                return res.status(400).json({ message: 'Código incorrecto.' });
            }
            if (entrega.estadoEntrega !== 'LISTA_PARA_RETIRO') {
                await session.abortTransaction(); session.endSession();
                return res.status(400).json({ message: 'La entrega no está lista para ser completada.' });
            }
            
            entrega.estadoEntrega = 'COMPLETADA';
            entrega.fechaCompletada = new Date();
            
            const donacion = await Donacion.findByIdAndUpdate(entrega.donacionId, { estadoPublicacion: 'ENTREGADA' }).session(session);
            await Solicitud.findByIdAndUpdate(entrega.solicitudId, { estadoSolicitud: 'COMPLETADA_CON_ENTREGA' }).session(session);
            
            const receptor = await User.findById(entrega.receptorId).session(session);
            if (receptor.rol === 'GENERAL' && receptor.estadisticasGenerales) {
                receptor.estadisticasGenerales.totalDonacionesRecibidas = (receptor.estadisticasGenerales.totalDonacionesRecibidas || 0) + 1;
            }

            const notificacion = new Notificacion({
                destinatarioId: receptor._id,
                tipoNotificacion: 'ENTREGA',
                mensaje: `La entrega de "${donacion.titulo}" se ha completado.`,
                referenciaId: entrega._id,
                tipoReferencia: 'Entrega'
            });

            await entrega.save({ session });
            await receptor.save({ session });
            await notificacion.save({ session });

            const io = getIoInstance();
            const receptorSocketId = getSocketIdForUser(receptor.clerkUserId);
            if (receptorSocketId) {
                io.to(receptorSocketId).emit('nueva_notificacion', notificacion.toObject());
            }

            await session.commitTransaction();
            res.status(200).json({ message: '¡Entrega completada!' });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ message: 'Error al completar entrega.', errorDetails: error.message });
        } finally {
            session.endSession();
        }
    }

            // Historial de recepciones finalizadas por receptor
        static async getRecepcionesFinalizadasByUsuario(req, res) {
        try {
            const userId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario inválido.' });
            }

            const estadosFinalizados = [
            'COMPLETADA',
            'CANCELADA_POR_DONANTE',
            'CANCELADA_POR_SOLICITANTE',
            'FALLIDA_RECEPTOR_NO_ASISTIO',
            'FALLIDA_OTRO_MOTIVO',
            ];

            const recepciones = await Entrega.find({
            receptorId: userId,
            estadoEntrega: { $in: estadosFinalizados },
            })
            .sort({ updatedAt: -1 })
            .populate('donacionId', 'titulo descripcion imagenesUrl ubicacionRetiro createdAt estadoPublicacion')
            .populate('donanteId', 'nombre')
            .populate('receptorId', 'nombre')
            .lean();

            return res.status(200).json({ recepciones });
        } catch (error) {
            console.error('Error al obtener recepciones finalizadas:', error);
            return res.status(500).json({ message: 'Error interno al obtener recepciones finalizadas', errorDetails: error.message });
        }
        }

}