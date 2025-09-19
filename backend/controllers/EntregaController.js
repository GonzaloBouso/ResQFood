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
            if (!receptor || receptor.clerkUserId !== receptorClerkId) {
                await session.abortTransaction(); session.endSession();
                return res.status(403).json({ message: 'No tienes permiso.' });
            }
            if (entrega.estadoEntrega !== 'PENDIENTE_CONFIRMACION_SOLICITANTE') {
                await session.abortTransaction(); session.endSession();
                return res.status(400).json({ message: 'Esta propuesta ya no es válida.' });
            }

           
            await Notificacion.updateMany(
                { referenciaId: entrega._id, tipoNotificacion: 'APROBACION' },
                { $set: { leida: true, fechaLeida: new Date() } },
                { session }
            );

            entrega.horarioEntregaConfirmadoSolicitante = true;
            entrega.fechaHorarioConfirmado = new Date();
            entrega.estadoEntrega = 'LISTA_PARA_RETIRO';

            await Solicitud.findByIdAndUpdate(
                entrega.solicitudId,
                { estadoSolicitud: 'HORARIO_CONFIRMADO' },
                { session }
            );
            
            const donante = await User.findById(entrega.donanteId).session(session);
            const donacion = await Donacion.findById(entrega.donacionId).select('titulo').session(session);
            
            const notificacion = new Notificacion({
                destinatarioId: donante._id,
                tipoNotificacion: 'HORARIO_CONFIRMADO',
                mensaje: `¡${receptor.nombre} confirmó el retiro de "${donacion.titulo}"! La entrega está lista.`,
                referenciaId: entrega._id,
                tipoReferencia: 'Entrega',
                enlace: '/mis-donaciones'
            });

            await entrega.save({ session });
            await notificacion.save({ session });

            const io = getIoInstance();
            const donanteSocketId = getSocketIdForUser(donante.clerkUserId);
            if (donanteSocketId) {
                io.to(donanteSocketId).emit('nueva_notificacion', notificacion.toObject());
            }
            
            await session.commitTransaction();
            res.status(200).json({ 
            message: 'Horario confirmado.', 
            entrega: entrega.toObject()
            }) // Se envía el documento de entrega completo
        } catch (error) {
            await session.abortTransaction();
            console.error("Error al confirmar horario:", error);
            res.status(500).json({ message: 'Error al confirmar horario.', errorDetails: error.message });
        } finally {
            session.endSession();
        }
    }

    static async rechazarHorario(req, res) {
        const { entregaId } = req.params;
        const receptorClerkId = req.auth?.userId;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const entrega = await Entrega.findById(entregaId).session(session);
            if (!entrega) { throw new Error('Registro de entrega no encontrado.'); }
            
            const receptor = await User.findById(entrega.receptorId).session(session);
            if (!receptor || receptor.clerkUserId !== receptorClerkId) { throw new Error('No tienes permiso para realizar esta acción.'); }
            
            if (entrega.estadoEntrega !== 'PENDIENTE_CONFIRMACION_SOLICITANTE') { throw new Error('Esta propuesta ya no se puede rechazar.'); }
            
            const donacion = await Donacion.findById(entrega.donacionId).session(session);
            if (!donacion) { throw new Error('La donación asociada ya no existe.'); }

            const donante = await User.findById(entrega.donanteId).session(session);
            if (!donante) { throw new Error('El donante asociado ya no existe.'); }

            entrega.estadoEntrega = 'CANCELADA_POR_SOLICITANTE';
            entrega.fechaCancelada = new Date();
            
            await Solicitud.findByIdAndUpdate(entrega.solicitudId, { estadoSolicitud: 'CANCELADA_RECEPTOR' }, { session });
            
            donacion.estadoPublicacion = 'DISPONIBLE';
            
            await entrega.save({ session });
            await donacion.save({ session });
            
            const notificacion = new Notificacion({
                destinatarioId: donante._id,
                tipoNotificacion: 'HORARIO_RECHAZADO',
                mensaje: `${receptor.nombre} no pudo aceptar el horario para "${donacion.titulo}". La donación vuelve a estar disponible.`,
                referenciaId: entrega.solicitudId,
                tipoReferencia: 'Solicitud',
                enlace: '/mis-donaciones'
            });
            await notificacion.save({ session });

            const io = getIoInstance();
            const donanteSocketId = getSocketIdForUser(donante.clerkUserId);
            if (donanteSocketId) {
                io.to(donanteSocketId).emit('nueva_notificacion', notificacion.toObject());
            }

            await session.commitTransaction();
            res.status(200).json({ message: 'Propuesta de horario rechazada. La donación vuelve a estar disponible.' });
        } catch (error) {
            await session.abortTransaction();
            console.error("Error al rechazar horario:", error);
            res.status(500).json({ message: `Error al rechazar el horario: ${error.message}` });
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
            if (entrega.codigoConfirmacionReceptor !== codigoConfirmacion.toUpperCase()) {
                await session.abortTransaction(); session.endSession();
                return res.status(400).json({ message: 'Código incorrecto.' });
            }
            if (entrega.estadoEntrega !== 'LISTA_PARA_RETIRO') {
                await session.abortTransaction(); session.endSession();
                return res.status(400).json({ message: 'La entrega no está lista para ser completada.' });
            }

           
            await Notificacion.updateMany(
                { referenciaId: entrega._id, tipoNotificacion: 'HORARIO_CONFIRMADO' },
                { $set: { leida: true, fechaLeida: new Date() } },
                { session }
            );
            
            entrega.estadoEntrega = 'COMPLETADA';
            entrega.fechaCompletada = new Date();
            
            const donacion = await Donacion.findByIdAndUpdate(entrega.donacionId, { estadoPublicacion: 'ENTREGADA' }, {session, new: true});
            await Solicitud.findByIdAndUpdate(entrega.solicitudId, { estadoSolicitud: 'COMPLETADA_CON_ENTREGA' }, { session });
            
            const receptor = await User.findById(entrega.receptorId).session(session);
            if (receptor.rol === 'GENERAL' && receptor.estadisticasGenerales) {
                receptor.estadisticasGenerales.totalDonacionesRecibidas = (receptor.estadisticasGenerales.totalDonacionesRecibidas || 0) + 1;
            }

            const notificacion = new Notificacion({
                destinatarioId: receptor._id,
                tipoNotificacion: 'ENTREGA',
                mensaje: `La entrega de "${donacion.titulo}" se ha completado. ¡Gracias por participar!`,
                referenciaId: entrega._id,
                tipoReferencia: 'Entrega',
                enlace: '/mis-solicitudes'
            });

            await entrega.save({ session });
            await receptor.save({ session });
            
            console.log("--- Creando Notificación de ENTREGA ---");
            console.log("Datos de la notificación a guardar:", notificacion);
            
            await notificacion.save({ session });
            console.log("Notificación de ENTREGA guardada con éxito.");

            const io = getIoInstance();
            const receptorSocketId = getSocketIdForUser(receptor.clerkUserId);
            if (receptorSocketId) {
                io.to(receptorSocketId).emit('nueva_notificacion', notificacion.toObject());
            }

            await session.commitTransaction();
            res.status(200).json({ message: '¡Entrega completada!' });
        } catch (error) {
            await session.abortTransaction();
            console.error("Error al completar entrega:", error);
            res.status(500).json({ message: 'Error al completar entrega.', errorDetails: error.message });
        } finally {
            session.endSession();
        }
    }
}