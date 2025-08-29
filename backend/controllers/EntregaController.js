
import Reporte from '../models/Reporte.js';
import User from '../models/User.js';
import Donacion from '../models/Donacion.js';
import mongoose from 'mongoose';

export class ReporteController {
    // Para que un usuario cree un reporte
    static async createReporte(req, res) {
        try {
            const { donacionId } = req.params;
            const { motivo, detalles } = req.body;
            const reportadoPorId = req.auth.userId;

            const donacion = await Donacion.findById(donacionId);
            if (!donacion) return res.status(404).json({ message: "Donación no encontrada." });

            const reportador = await User.findOne({ clerkUserId: reportadoPorId });
            if (!reportador) return res.status(404).json({ message: "Usuario reportador no encontrado." });

            const nuevoReporte = new Reporte({
                reportadoPor: reportador._id,
                usuarioReportado: donacion.donanteId,
                donacionReportada: donacion._id,
                motivo,
                detalles,
            });

            await nuevoReporte.save();
            res.status(201).json({ message: 'Reporte enviado con éxito. Lo revisaremos pronto.', reporte: nuevoReporte });
        } catch (error) {
            console.error('Error al crear reporte:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    // Para que un admin obtenga todos los reportes pendientes
    static async getReportesPendientes(req, res) {
        try {
            const reportes = await Reporte.find({ estado: 'PENDIENTE' })
                .populate('reportadoPor', 'nombre email')
                .populate('usuarioReportado', 'nombre email activo')
                .populate('donacionReportada', 'titulo')
                .sort({ createdAt: -1 });

            res.status(200).json({ reportes });
        } catch (error) {
            console.error('Error al obtener reportes:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    // Para que un admin resuelva un reporte (sin tomar acción)
    static async resolverReporte(req, res) {
        try {
            const { reporteId } = req.params;
            const reporte = await Reporte.findByIdAndUpdate(reporteId, { estado: 'RESUELTO' }, { new: true });
            if (!reporte) return res.status(404).json({ message: "Reporte no encontrado." });
            res.status(200).json({ message: 'Reporte marcado como resuelto.', reporte });
        } catch (error) {
            console.error('Error al resolver reporte:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}