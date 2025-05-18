import Donacion from '../models/Donacion.js';

export class DonacionController {
    static async createDonacion(req, res){
        try {
            const nuevaDonacion = new Donacion(req.body);
            await nuevaDonacion.save()
            res.status(201).json({message:'Donacion creada con exito',nuevaDonacion})
        } catch (error) {
            console.error("Error al crear donación:", error);
            res.status(400).json({message:'Error al crear nueva Donación ', error:error.message})
        }
    }
}