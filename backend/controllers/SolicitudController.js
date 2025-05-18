import Solicitud from '../models/Solicitud.js';

export class SolicitudController {
    static async createSolicitud(req, res){
        try {
            const nuevaSolicitud = new Solicitud(req.body);
            await nuevaSolicitud.save()
            res.status(200).json(nuevaSolicitud)
        } catch (error) {
            res.status(400).json({message:'Error al crear la solicitud', error:error.message})
        }
    }
}