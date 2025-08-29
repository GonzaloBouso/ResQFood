import mongoose, { Schema } from "mongoose";

const EntregaSchema = new mongoose.Schema(
    {
        solicitudId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Solicitud',
            required: true,
            sparse: true, 
            index: true
            
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

export default mongoose.model('Entrega', EntregaSchema);