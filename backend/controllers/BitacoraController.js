import Bitacora from '../models/BitacoraAdmin.js';

export class BitacoraController {
    static async createCambio (req, res){
        try {
            const nuevoCambio = new Bitacora(req.body);
            await nuevoCambio.save()
            res.status(200).json({message: 'Bitacora actualizada con éxito',nuevoCambio})
        } catch (error) {
            console.error("Error al actualizar bitacora:", error);
            res.status(400).json({message:'Error al ralizar cambio en la bitacora', error:error.message})
        }
    }
}