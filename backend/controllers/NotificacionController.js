import Notificacion from '../models/Notificacion.js';
import User from '../models/User.js';

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

     static async marcarTodasComoLeidas(req, res) {
        try {
            const clerkUserId = req.auth?.userId;
            const user = await User.findOne({ clerkUserId }).select('_id');
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            // Usamos updateMany para actualizar todos los documentos que coincidan
            await Notificacion.updateMany(
                { destinatarioId: user._id, leida: false }, // Condición: solo las no leídas del usuario
                { $set: { leida: true, fechaLeida: new Date() } } // Acción: marcar como leídas
            );

            res.status(200).json({ message: 'Notificaciones marcadas como leídas.' });
        } catch (error) {
            console.error("Error al marcar notificaciones como leídas:", error);
            res.status(500).json({ message: "Error interno al marcar notificaciones." });
        }
    }
}