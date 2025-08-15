import mongoose from 'mongoose';
import Solicitud from '../models/Solicitud.js';
import Donacion from '../models/Donacion.js';
import User from '../models/User.js';
import Notificacion from '../models/Notificacion.js';
import Entrega from '../models/Entrega.js';
import { getIoInstance, getSocketIdForUser } from '../socket.js';

const generarCodigo = (length = 6)=>{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export class SolicitudController {
    static async createSolicitud(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { donacionId } = req.params;
            const { mensajeSolicitante } = req.body;
            const solicitanteClerkId = req.auth?.userId; 
            const donacion = await Donacion.findById(donacionId).session(session);
            if (!donacion) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ message: "Donación no encontrada." }); }
            const solicitante = await User.findOne({ clerkUserId: solicitanteClerkId }).session(session);
            if (!solicitante) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ message: "Usuario solicitante no encontrado." }); }
            if (donacion.donanteId.toString() === solicitante._id.toString()) { await session.abortTransaction(); session.endSession(); return res.status(400).json({ message: "No puedes solicitar tu propia donación." }); }
            if (donacion.estadoPublicacion !== 'DISPONIBLE') { await session.abortTransaction(); session.endSession(); return res.status(400).json({ message: "Esta donación ya no está disponible." }); }
            const existeSolicitud = await Solicitud.findOne({ donacionId, solicitanteId: solicitante._id }).session(session);
            if (existeSolicitud) { await session.abortTransaction(); session.endSession(); return res.status(409).json({ message: "Ya has enviado una solicitud para esta donación." }); }
            const donante = await User.findById(donacion.donanteId).session(session);
            const nuevaSolicitud = new Solicitud({ donacionId, donanteId: donacion.donanteId, solicitanteId: solicitante._id, mensajeSolicitante });
            await nuevaSolicitud.save({ session });
            const notificacion = new Notificacion({
                destinatarioId: donante._id, tipoNotificacion: 'SOLICITUD',
                mensaje: `${solicitante.nombre} ha solicitado tu donación "${donacion.titulo}".`,
                referenciaId: nuevaSolicitud._id, tipoReferencia: 'Solicitud'
            });
            await notificacion.save({ session });
            const io = getIoInstance();
            const donanteSocketId = getSocketIdForUser(donante.clerkUserId);
            if (donanteSocketId) { io.to(donanteSocketId).emit('nueva_notificacion', notificacion.toObject()); }
            await session.commitTransaction();
            res.status(201).json({ message: "Solicitud enviada exitosamente.", solicitud: nuevaSolicitud });
        } catch (error) {
            await session.abortTransaction();
            console.error('Error al crear la solicitud:', error);
            res.status(500).json({ message: "Error interno del servidor.", errorDetails: error.message });
        } finally {
            session.endSession();
        }
    }

    static async aceptarSolicitudYProponerHorario(req, res) {
        const { solicitudId } = req.params;
        const donanteClerkId = req.auth?.userId;
        const { horarioEntregaPropuestaPorDonante, fechaPropuesto } = req.body;
        if (!horarioEntregaPropuestaPorDonante || !fechaPropuesto) { return res.status(400).json({ message: "Debe proporcionar una propuesta de fecha y hora." }); }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const solicitudAceptada = await Solicitud.findById(solicitudId).session(session);
            if (!solicitudAceptada) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ message: 'Solicitud no encontrada.' }); }
            if (solicitudAceptada.estadoSolicitud !== 'PENDIENTE_APROBACION') { await session.abortTransaction(); session.endSession(); return res.status(400).json({ message: 'Esta solicitud ya ha sido gestionada.' }); }
            const donante = await User.findById(solicitudAceptada.donanteId).session(session);
            if (donante.clerkUserId !== donanteClerkId) { await session.abortTransaction(); session.endSession(); return res.status(403).json({ message: 'No tienes permiso.' }); }
            await Donacion.findByIdAndUpdate(solicitudAceptada.donacionId, { estadoPublicacion: 'PENDIENTE-ENTREGA' }, { session });
            solicitudAceptada.estadoSolicitud = 'APROBADA_ESPERANDO_CONFIRMACION_HORARIO';
            solicitudAceptada.fechaAprobacion = new Date();
            const nuevaEntrega = new Entrega({
                solicitudId: solicitudAceptada._id, donacionId: solicitudAceptada.donacionId, donanteId: solicitudAceptada.donanteId,
                receptorId: solicitudAceptada.solicitanteId, horarioEntregaPropuestaPorDonante, fechaPropuesto,
                codigoConfirmacionReceptor: generarCodigo(),
            });
            const receptor = await User.findById(solicitudAceptada.solicitanteId).session(session);
            const donacion = await Donacion.findById(solicitudAceptada.donacionId).select('titulo').session(session);
            const notificacionAprobacion = new Notificacion({
                destinatarioId: receptor._id, tipoNotificacion: 'APROBACION',
                mensaje: `¡Tu solicitud para "${donacion.titulo}" fue aprobada! Confirma el horario de retiro.`,
                referenciaId: nuevaEntrega._id, tipoReferencia: 'Entrega'
            });
            await solicitudAceptada.save({ session });
            await nuevaEntrega.save({ session });
            await notificacionAprobacion.save({ session });
            const io = getIoInstance();
            const receptorSocketId = getSocketIdForUser(receptor.clerkUserId);
            if (receptorSocketId) { io.to(receptorSocketId).emit('nueva_notificacion', notificacionAprobacion.toObject()); }
            const otrasSolicitudes = await Solicitud.find({
                donacionId: solicitudAceptada.donacionId,
                _id: { $ne: solicitudAceptada._id },
                estadoSolicitud: 'PENDIENTE_APROBACION'
            }).session(session);
            for (const otraSolicitud of otrasSolicitudes) {
                otraSolicitud.estadoSolicitud = 'RECHAZADA_DONANTE';
                otraSolicitud.motivoRechazo = 'La donación fue asignada a otro solicitante.';
                otraSolicitud.fechaRechazo = new Date();
                await otraSolicitud.save({ session });
                const otroReceptor = await User.findById(otraSolicitud.solicitanteId).session(session);
                const notificacionRechazo = new Notificacion({
                    destinatarioId: otroReceptor._id, tipoNotificacion: 'RECHAZO',
                    mensaje: `Tu solicitud para "${donacion.titulo}" no pudo ser aceptada en esta ocasión.`,
                    referenciaId: otraSolicitud._id, tipoReferencia: 'Solicitud'
                });
                await notificacionRechazo.save({ session });
                const otroReceptorSocketId = getSocketIdForUser(otroReceptor.clerkUserId);
                if (otroReceptorSocketId) { io.to(otroReceptorSocketId).emit('nueva_notificacion', notificacionRechazo.toObject()); }
            }
            await session.commitTransaction();
            res.status(200).json({ message: 'Solicitud aprobada y otras rechazadas.', entrega: nuevaEntrega });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ message: "Error interno al aceptar la solicitud.", errorDetails: error.message });
        } finally {
            session.endSession();
        }
    }

    static async rechazarSolicitud(req, res){
        const {solicitudId} = req.params;
        const {motivoRechazo} = req.body;
        const donanteClerkId = req.auth?.userId;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const solicitud = await Solicitud.findById(solicitudId).session(session);
            if (!solicitud) { await session.abortTransaction(); session.endSession(); return res.status(404).json({ message: 'Solicitud no encontrada.' }); }
            if (solicitud.estadoSolicitud !== 'PENDIENTE_APROBACION') { await session.abortTransaction(); session.endSession(); return res.status(400).json({ message: 'Esta solicitud ya ha sido gestionada.' }); }
            const donante = await User.findById(solicitud.donanteId).session(session);
            if (donante.clerkUserId !== donanteClerkId) { await session.abortTransaction(); session.endSession(); return res.status(403).json({ message: 'No tienes permiso.' }); }
            solicitud.estadoSolicitud = 'RECHAZADA_DONANTE';
            solicitud.motivoRechazo = motivoRechazo || 'El donante no ha especificado un motivo.';
            solicitud.fechaRechazo = new Date();
            const receptor = await User.findById(solicitud.solicitanteId).session(session);
            const donacion = await Donacion.findById(solicitud.donacionId).select('titulo').session(session);
            const notificacion = new Notificacion({
                destinatarioId: receptor._id, tipoNotificacion: 'RECHAZO',
                mensaje: `Tu solicitud para "${donacion.titulo}" fue rechazada por el donante.`,
                referenciaId: solicitud._id, tipoReferencia: 'Solicitud'
            });
            await solicitud.save({ session });
            await notificacion.save({ session });
            const io = getIoInstance();
            const receptorSocketId = getSocketIdForUser(receptor.clerkUserId);
            if (receptorSocketId) { io.to(receptorSocketId).emit('nueva_notificacion', notificacion.toObject()); }
            await session.commitTransaction();
            res.status(200).json({ message: 'Solicitud rechazada exitosamente.' });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ message: 'Error al rechazar la solicitud.', errorDetails: error.message });
        }finally {
            session.endSession();
        }
    }   

    static async getMisSolicitudes(req, res) {
        try {
            const solicitanteClerkId = req.auth?.userId;
            const solicitante = await User.findOne({ clerkUserId: solicitanteClerkId });
            if (!solicitante) return res.status(404).json({ message: "Usuario no encontrado." });
            const solicitudes = await Solicitud.find({ solicitanteId: solicitante._id })
                .populate({
                    path: 'donacionId',
                    select: 'titulo descripcion imagenesUrl categoria ubicacionRetiro fechaVencimientoProducto' 
                })
                .populate('donanteId', 'nombre fotoDePerfilUrl')
                .sort({ createdAt: -1 });
            res.status(200).json({ solicitudes });
        } catch (error) {
            console.error('Error al obtener mis solicitudes:', error);
            res.status(500).json({ message: "Error interno del servidor.", errorDetails: error.message });
        }
    }



   static async getSolicitudesRecibidas(req, res) {
    try {
        const donanteClerkId = req.auth?.userId;
        const donante = await User.findOne({ clerkUserId: donanteClerkId });
        if (!donante) {
            return res.status(404).json({ message: "Usuario donante no encontrado." });
        }
      
        const misDonacionesIds = await Donacion.find({ donanteId: donante._id }).distinct('_id');

       
        const solicitudes = await Solicitud.find({
            donacionId: { $in: misDonacionesIds }
        })
        .populate({
            path: 'donacionId',
            select: 'titulo imagenesUrl _id'
        })
        .populate('solicitanteId', 'nombre fotoDePerfilUrl')
        .sort({ createdAt: -1 });

        res.status(200).json({ solicitudes });
    } catch (error) {
        console.error('Error al obtener solicitudes recibidas:', error);
        res.status(500).json({ message: "Error interno del servidor.", errorDetails: error.message });
    }
}



    static async cancelarSolicitud(req, res) {
        try {
            const { solicitudId } = req.params;
            const solicitanteClerkId = req.auth?.userId;
            const solicitud = await Solicitud.findById(solicitudId);
            if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada.' });
            const solicitante = await User.findById(solicitud.solicitanteId);
            if (solicitante.clerkUserId !== solicitanteClerkId) { return res.status(403).json({ message: 'No tienes permiso para cancelar esta solicitud.' }); }
            if (solicitud.estadoSolicitud !== 'PENDIENTE_APROBACION') { return res.status(400).json({ message: 'No puedes cancelar una solicitud que ya ha sido gestionada.' }); }
            solicitud.estadoSolicitud = 'CANCELADA_RECEPTOR';
            solicitud.fechaCancelacion = new Date();
            await solicitud.save();
            res.status(200).json({ message: 'Solicitud cancelada exitosamente.', solicitud });
        } catch (error) {
            console.error('Error al cancelar la solicitud:', error);
            res.status(500).json({ message: "Error interno del servidor.", errorDetails: error.message });
        }
    }
}