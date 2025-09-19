import Bitacora from '../models/bitacoraAdmin.js';

export class BitacoraController {
    static async getAllCambios(req, res) {
        try {
            const cambios = await Bitacora.find({})
                .populate('actorId', 'nombre email') 
                .sort({ createdAt: -1 }); 

            res.status(200).json({ bitacora: cambios });
        } catch (error) {
            console.error("Error al obtener la bitácora:", error);
            res.status(500).json({ message: 'Error interno del servidor al obtener la bitácora.' });
        }
    }
}