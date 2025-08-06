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

    // Marcar una notificación específica como leída
    static async marcarComoLeida(req, res) {
        try {
            const { notificacionId } = req.params;
            const clerkUserId = req.auth?.userId;
            
            const notificacion = await Notificacion.findById(notificacionId);
            if (!notificacion) {
                return res.status(404).json({ message: 'Notificación no encontrada.' });
            }

            const user = await User.findById(notificacion.destinatarioId);
            if (user.clerkUserId !== clerkUserId) {
                return res.status(403).json({ message: 'No tienes permiso para modificar esta notificación.' });
            }

            if (!notificacion.leida) {
                notificacion.leida = true;
                notificacion.fechaLeida = new Date();
                await notificacion.save();
            }

            res.status(200).json({ message: 'Notificación marcada como leída.', notificacion });
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}