import Reporte from '../models/Reporte.js';

export class ReporteController {
    static async createReporte(req, res){
        try {
            const nuevoReporte = new Reporte(req.body);
            await nuevoReporte.save()
            res.status(200).json(nuevoReporte)
        } catch (error) {
            console.log('Error al crear reporte:',error);
            res.status(400).json({message:'Error al crear el reporte', error:error.message})
        }
    }
}