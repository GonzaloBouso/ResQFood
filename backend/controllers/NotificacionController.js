import Notificacion from '../models/Notificacion.js';
import User from '../models/User.js';


const DONATION_NOTIFICATION_TYPES = ['SOLICITUD', 'HORARIO_CONFIRMADO', 'HORARIO_RECHAZADO', 'GENERAL'];
const REQUEST_NOTIFICATION_TYPES = ['APROBACION', 'RECHAZO', 'ENTREGA'];

export class NotificacionController {
    
    // Obtener todas las notificaciones del usuario logueado
    static async getMisNotificaciones(req, res) {
        try {
            const clerkUserId = req.auth?.userId;
            const user = await User.findOne({ clerkUserId });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const notificaciones = await Notificacion.find({ destinatarioId: user._id })
                .sort({ createdAt: -1 }) // Las más nuevas primero
                .limit(50); // Limitar para no sobrecargar

            res.status(200).json({ notificaciones });
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

     // ---  LOGS DE DEPURACIÓN ---
    static async marcarSolicitudesComoLeidas(req, res) {
        console.log("--- INICIANDO marcarSolicitudesComoLeidas ---");
        try {
            const clerkUserId = req.auth?.userId;
            if (!clerkUserId) {
                console.log("Error: No se encontró clerkUserId en req.auth");
                return res.status(401).json({ message: "Usuario no autenticado." });
            }
            console.log(`Buscando usuario con clerkUserId: ${clerkUserId}`);
            const user = await User.findOne({ clerkUserId }).select('_id');
            if (!user) {
                console.log("Error: Usuario no encontrado en la base de datos.");
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
            console.log(`Usuario encontrado. ID: ${user._id}. Tipos a actualizar:`, REQUEST_NOTIFICATION_TYPES);

            const result = await Notificacion.updateMany(
                { destinatarioId: user._id, leida: false, tipoNotificacion: { $in: REQUEST_NOTIFICATION_TYPES } },
                { $set: { leida: true, fechaLeida: new Date() } }
            );

            console.log("Resultado de updateMany:", result);
            console.log(`Se encontraron ${result.matchedCount} notificaciones y se modificaron ${result.modifiedCount}.`);
            console.log("--- FINALIZANDO marcarSolicitudesComoLeidas ---");
            
            res.status(200).json({ message: 'Notificaciones de solicitudes marcadas como leídas.' });
        } catch (error) {
            console.error("--- ERROR FATAL en marcarSolicitudesComoLeidas ---");
            console.error(error);
            res.status(500).json({ message: "Error interno al marcar notificaciones." });
        }
    }
    
   
    static async marcarDonacionesComoLeidas(req, res) {
        try {
            const clerkUserId = req.auth?.userId;
            if (!clerkUserId) {
                return res.status(401).json({ message: "Usuario no autenticado." });
            }
            const user = await User.findOne({ clerkUserId }).select('_id');
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            await Notificacion.updateMany(
                { destinatarioId: user._id, leida: false, tipoNotificacion: { $in: DONATION_NOTIFICATION_TYPES } },
                { $set: { leida: true, fechaLeida: new Date() } }
            );
            res.status(200).json({ message: 'Notificaciones de donaciones marcadas como leídas.' });
        } catch (error) {
            console.error("Error al marcar notificaciones de donaciones:", error);
            res.status(500).json({ message: "Error interno al marcar notificaciones." });
        }
    }
}