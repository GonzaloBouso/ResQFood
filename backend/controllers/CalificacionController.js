import mongoose from 'mongoose';
import Calificacion from '../models/Calificacion.js';
import User from '../models/User.js';
import Entrega from '../models/Entrega.js';
import Notificacion from '../models/Notificacion.js'; 
import { getIoInstance, getSocketIdForUser } from '../socket.js';

export class CalificacionController {
    static async createCalificacion(req, res){
        console.log("--- INICIANDO createCalificacion ---");
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            console.log("Paso 1: Obteniendo datos del calificador.");
            const calificadorClerkId = req.auth?.userId;
            const calificador = await User.findOne({ clerkUserId: calificadorClerkId }).session(session);
            if (!calificador) {
              
                throw new Error('Usuario calificador no encontrado en la base de datos.');
            }
            console.log(`Calificador encontrado: ${calificador.nombre}`);

            const { calificadoId, puntuacion, entregaId } = req.body;
            console.log("Paso 2: Datos recibidos del frontend ->", { calificadoId, puntuacion, entregaId });

            if (!mongoose.Types.ObjectId.isValid(entregaId) || !mongoose.Types.ObjectId.isValid(calificadoId)) {
                throw new Error('ID de entrega o de usuario calificado no es válido.');
            }

            console.log("Paso 3: Verificando la entrega.");
            const entrega = await Entrega.findById(entregaId).session(session);
            if (!entrega) throw new Error('La entrega asociada no existe.');
            if (entrega.calificacionRealizada) throw new Error('Esta entrega ya ha sido calificada.');
            console.log("Entrega válida y no calificada.");

            console.log("Paso 4: Creando el documento de calificación.");
            const nuevaCalificacion = new Calificacion({ ...req.body, calificadorId: calificador._id });
            await nuevaCalificacion.save({ session });
            console.log("Calificación guardada temporalmente.");

            console.log("Paso 5: Actualizando la entrega.");
            entrega.calificacionRealizada = true;
            await entrega.save({ session });
            console.log("Entrega marcada como calificada.");

            console.log("Paso 6: Actualizando estadísticas del usuario calificado.");
            const usuarioCalificado = await User.findById(calificadoId).session(session);
            if (!usuarioCalificado) throw new Error('Usuario calificado no encontrado.');
            
            const totalPuntuacionAnterior = (usuarioCalificado.calificaciones.promedio || 0) * (usuarioCalificado.calificaciones.totalCalificaciones || 0);
            const nuevoTotalCalificaciones = (usuarioCalificado.calificaciones.totalCalificaciones || 0) + 1;
            const nuevoPromedio = (totalPuntuacionAnterior + puntuacion) / nuevoTotalCalificaciones;

            usuarioCalificado.calificaciones.totalCalificaciones = nuevoTotalCalificaciones;
            usuarioCalificado.calificaciones.promedio = nuevoPromedio;
            await usuarioCalificado.save({ session });
            console.log(`Estadísticas de ${usuarioCalificado.nombre} actualizadas.`);
            
            console.log("Paso 7: Creando notificación para el donante.");
            const notificacion = new Notificacion({
                destinatarioId: usuarioCalificado._id,
                tipoNotificacion: 'NUEVA_CALIFICACION',
                mensaje: `${calificador.nombre} te ha calificado con ${puntuacion} estrellas.`,
                referenciaId: nuevaCalificacion._id,
                tipoReferencia: 'Calificacion',
                enlace: '/mi-perfil'
            });
            await notificacion.save({ session });
            console.log("Notificación creada. Enviando por socket...");

            const io = getIoInstance();
            const donanteSocketId = getSocketIdForUser(usuarioCalificado.clerkUserId);
            if (donanteSocketId) {
                io.to(donanteSocketId).emit('nueva_notificacion', notificacion.toObject());
                console.log("Notificación enviada a socket ID:", donanteSocketId);
            } else {
                console.log("No se encontró socket para el donante.");
            }

            console.log("Paso 8: Confirmando transacción (commit).");
            await session.commitTransaction();
            res.status(201).json({ message: 'Calificación creada exitosamente', calificacion: nuevaCalificacion });
            console.log("--- createCalificacion COMPLETADO CON ÉXITO ---");

        } catch (error) {
            await session.abortTransaction();
            
            console.error("--- ERROR EN createCalificacion ---");
            console.error("Mensaje de error:", error.message);
            console.error("Stack de error:", error.stack);
            res.status(500).json({ message:'Error al crear la calificación', error: error.message });
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