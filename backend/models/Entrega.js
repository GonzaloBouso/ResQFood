
import mongoose, { Schema } from "mongoose";

const EntregaSchema = new mongoose.Schema(
    {
        solicitudId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Solicitud',
            required: true,
            unique: true, 
            index: true,
            sparse: true
            
        },
        donacionId: { type: Schema.Types.ObjectId, ref: 'Donacion', required: true, index: true },
        donanteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        receptorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        
        horarioPropuesto: {
            type: {
                fecha: { type: Date, required: true },
                horaInicio: { type: String, required: true },
                horaFin: { type: String, required: true }
            },
            _id: false,
            required: true,
        },
        
        horarioEntregaConfirmadoSolicitante: { type: Boolean, default: false },
        fechaHorarioConfirmado: { type: Date, default: null },
        codigoConfirmacionReceptor: { type: String, required: true },
        estadoEntrega: {
            type: String,
            enum: [
                'PENDIENTE_CONFIRMACION_SOLICITANTE',
                'LISTA_PARA_RETIRO',
                'COMPLETADA',
                'FALLIDA_RECEPTOR_NO_ASISTIO',
                'FALLIDA_OTRO_MOTIVO',
                'CANCELADA_POR_DONANTE',
                'CANCELADA_POR_SOLICITANTE',
            ],
           
            default: "PENDIENTE_CONFIRMACION_SOLICITANTE",
            required: true, 
            index: true,
        },
        notasEntrega: { type: String, default: null },
        fechaCompletada: { type: Date, default: null },
        fechaFallida: { type: Date, default: null },
        fechaCancelada: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

EntregaSchema.index({ donacionId: 1, receptorId: 1 });


export default mongoose.models.Entrega || mongoose.model('Entrega', EntregaSchema);




import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import { ChevronDown, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import ProposeScheduleModal from '../components/ProposeScheduleModal';
import toast from 'react-hot-toast';

const SolicitudesList = ({ solicitudes, onAcceptClick, onReject, isSubmitting }) => {
    
    const pendientes = (solicitudes || []).filter(s => s.estadoSolicitud === 'PENDIENTE_APROBACION');
    
    if (pendientes.length === 0) {
        const rechazoReciente = (solicitudes || []).find(s => s.estadoSolicitud === 'CANCELADA_RECEPTOR' && s.entregaId);
        if (rechazoReciente) {
            return (
                <div className="p-3 bg-red-50 border-t text-red-700 text-xs flex items-center gap-2">
                    <XCircle size={16}/>
                    <span>El horario propuesto a <strong>{rechazoReciente.solicitanteId?.nombre}</strong> fue rechazado. La donación vuelve a estar disponible.</span>
                </div>
            );
        }
        return <p className="text-xs text-gray-500 italic px-4 py-3 bg-gray-50 border-t">No hay nuevas solicitudes pendientes.</p>;
    }

    return (
        <div className="space-y-2 p-3 bg-gray-50 border-t">
            {pendientes.map(solicitud => (
                <div key={solicitud._id} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm">
                    <div className="flex items-center gap-2">
                        <img src={solicitud.solicitanteId?.fotoDePerfilUrl} alt={solicitud.solicitanteId?.nombre} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium">{solicitud.solicitanteId?.nombre}</span>
                    </div>
                    <div className="flex gap-2">
                        <button disabled={isSubmitting} onClick={() => onReject(solicitud)} className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50">Rechazar</button>
                        <button disabled={isSubmitting} onClick={() => onAcceptClick(solicitud)} className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">Aceptar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ConfirmarEntregaForm = ({ onConfirm, isSubmitting }) => {
    const [codigo, setCodigo] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(codigo);
    };
    return (
        <form onSubmit={handleSubmit} className="p-3 bg-blue-50 border-t flex items-center gap-2">
            <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="Ingresar código del receptor" className="flex-grow p-1 border rounded text-sm uppercase tracking-wider" maxLength="6" required />
            <button type="submit" disabled={isSubmitting} className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Confirmando...' : 'Confirmar'}</button>
        </form>
    );
};

