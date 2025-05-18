import Notificacion from '../models/Notificacion.js';

export class NotificacionController {
    static async createNotificacion(req, res){
        try {
            const nuevaNotificacion = new Notificacion(req.body);
            await nuevaNotificacion.save()
            res.status(200).json(nuevaNotificacion)
        } catch (error) {
            res.status(400).json({message:'Error al crear la Notificación', error:error.message})
        }
    }
}