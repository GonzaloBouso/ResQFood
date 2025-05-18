import Entrega from '../models/Entrega.js';

export class EntregaController {
    static async createEntrega(req, res){
        try {
            const nuevaEntrega = new Entrega(req.body);
            await nuevaEntrega.save()
            res.status(200).json({message:'Entrega creada con exito', nuevaEntrega})
        } catch (error) {
            console.error('Error al crear entrega:',error)
            res.status(400).json({message:'Error al crear nueva entrega', error:error.message})
        }
    }
}