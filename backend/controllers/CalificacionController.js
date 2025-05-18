import Calificacion from '../models/Calificacion.js';

export class CalificacionController {
    static async createCalificacion(req, res){
        try {
            const nuevaCalificacion = new Calificacion(req.body);
            await nuevaCalificacion.save()
            res.status(200).json(nuevaCalificacion)
        } catch (error) {
            console.error("Error al crear calificación:", error);
            res.status(400).json({message:'Error al crear nueva calificación', error:error.message})
        }
    }
}