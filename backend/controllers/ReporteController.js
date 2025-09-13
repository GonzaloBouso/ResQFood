import mongoose from 'mongoose';
import Reporte from '../models/Reporte.js';
import Donacion from '../models/Donacion.js';
import User from '../models/User.js';
import Bitacora from '../models/bitacoraAdmin.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

export class ReporteController {
    
    static async createReporte(req, res) {
        try {
            const { donacionId } = req.params;
            const { motivo, detalles } = req.body;
            const reportadoPorClerkId = req.auth.userId;

            const donacion = await Donacion.findById(donacionId);
            if (!donacion) return res.status(404).json({ message: "Donación no encontrada." });

            const reportador = await User.findOne({ clerkUserId: reportadoPorClerkId });
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

    
    static async getAllReportes(req, res) {
        try {
            const reportesPopulated = await Reporte.find({ estado: 'PENDIENTE' })
                .populate('reportadoPor', 'nombre email')
                .populate('usuarioReportado', 'nombre email activo _id')
                .populate('donacionReportada', 'titulo _id')
                .sort({ createdAt: -1 });
        
            const reportesValidos = reportesPopulated.filter(reporte => 
                reporte.reportadoPor && reporte.usuarioReportado && reporte.donacionReportada
            );
            res.status(200).json({ reportes: reportesValidos });
        } catch (error) {
            console.error('Error al obtener reportes:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    
    static async resolverReporte(req, res) {
        const { reporteId } = req.params;
        const adminClerkId = req.auth.userId;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const adminUser = await User.findOne({ clerkUserId: adminClerkId }).session(session);
            if (!adminUser) throw new Error('Administrador no encontrado.');

            const reporte = await Reporte.findByIdAndUpdate(reporteId, 
                { estado: 'RESUELTO', resueltoPor: adminUser._id, fechaResuelto: new Date() },
                { new: true, session }
            );
            if (!reporte) throw new Error('Reporte no encontrado.');

            const logEntry = new Bitacora({
                actorId: adminUser._id,
                accion: `Desestimó el reporte #${reporte._id.toString().slice(-6)}`,
                tipoElementoAfectado: 'Reporte',
                elementoAfectadoId: reporte._id,
            });
            await logEntry.save({ session });

            await session.commitTransaction();
            res.status(200).json({ message: 'Reporte resuelto y desestimado.' });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ message: error.message });
        } finally {
            session.endSession();
        }
    }

    static async eliminarDonacionReportada(req, res) {
        const { reporteId, donacionId } = req.params;
        const adminClerkId = req.auth.userId;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const adminUser = await User.findOne({ clerkUserId: adminClerkId }).session(session);
            if (!adminUser) throw new Error('Administrador no encontrado.');

            const donacionEliminada = await Donacion.findByIdAndDelete(donacionId, { session });
            if (!donacionEliminada) throw new Error('La donación ya no existe.');

            const reporte = await Reporte.findByIdAndUpdate(reporteId,
                { estado: 'RESUELTO_ACCION_TOMADA', resueltoPor: adminUser._id, fechaResuelto: new Date() },
                { new: true, session }
            );
            if (!reporte) throw new Error('Reporte no encontrado.');
            
            const logEntry = new Bitacora({
                actorId: adminUser._id,
                accion: `Eliminó la donación "${donacionEliminada.titulo}" por reporte.`,
                tipoElementoAfectado: 'Donacion',
                elementoAfectadoId: donacionEliminada._id,
            });
            await logEntry.save({ session });
            
            await session.commitTransaction();
            res.status(200).json({ message: 'Donación eliminada y reporte cerrado.' });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ message: error.message });
        } finally {
            session.endSession();
        }
    }

    static async suspenderUsuarioReportado(req, res) {
        const { reporteId, usuarioId } = req.params;
        const adminClerkId = req.auth.userId;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const adminUser = await User.findOne({ clerkUserId: adminClerkId }).session(session);
            if (!adminUser) throw new Error('Administrador no encontrado.');

            const usuarioASuspender = await User.findById(usuarioId).session(session);
            if (!usuarioASuspender) throw new Error('Usuario reportado no encontrado.');
            
            usuarioASuspender.activo = false;
            await usuarioASuspender.save({ session });
            await clerkClient.users.updateUser(usuarioASuspender.clerkUserId, { banned: true });

            const reporte = await Reporte.findByIdAndUpdate(reporteId,
                { estado: 'RESUELTO_ACCION_TOMADA', resueltoPor: adminUser._id, fechaResuelto: new Date() },
                { new: true, session }
            );
            if (!reporte) throw new Error('Reporte no encontrado.');

            const logEntry = new Bitacora({
                actorId: adminUser._id,
                accion: `Suspendió al usuario "${usuarioASuspender.nombre}" por reporte.`,
                tipoElementoAfectado: 'User',
                elementoAfectadoId: usuarioASuspender._id,
                detallesAdicionales: { antes: { activo: true }, despues: { activo: false } }
            });
            await logEntry.save({ session });

            await session.commitTransaction();
            res.status(200).json({ message: 'Usuario suspendido y reporte cerrado.' });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ message: error.message });
        } finally {
            session.endSession();
        }
    }
}