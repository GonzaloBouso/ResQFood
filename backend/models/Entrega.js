// backend/models/Entrega.js

import mongoose, { Schema } from "mongoose";

const EntregaSchema = new mongoose.Schema(
    {
        solicitudId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Solicitud',
            required: true,
            unique: true,
            index: true
        },
        donacionId: { type: Schema.Types.ObjectId, ref: 'Donacion', required: true, index: true },
        donanteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        receptorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        
        // --- MODELO SIMPLIFICADO ---
        // Un solo objeto para toda la propuesta de horario.
        horarioPropuesto: {
            type: {
                fecha: { type: Date, required: true },     // Guarda la fecha completa (incluye hora de inicio)
                horaInicio: { type: String, required: true }, // Guarda el string 'HH:mm' para mostrarlo fácil
                horaFin: { type: String, required: true }    // Guarda el string 'HH:mm'
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
                'PENDIENTE_CONFIRMACION', // Nombre simplificado
                'LISTA_PARA_RETIRO',
                'COMPLETADA',
                'FALLIDA_RECEPTOR_NO_ASISTIO',
                'FALLIDA_OTRO_MOTIVO',
                'CANCELADA_POR_DONANTE',
                'CANCELADA_POR_SOLICITANTE',
            ],
            default: "PENDIENTE_CONFIRMACION",
            required: true, index: true,
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

export default mongoose.model('Entrega', EntregaSchema);