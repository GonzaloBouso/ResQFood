import mongoose, { Schema } from "mongoose";

const SolicitudSchema = new Schema(
    {
        donacionId: { type: Schema.Types.ObjectId, ref: 'Donacion', required: true, index: true },
        donanteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        solicitanteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        
        entregaId: { type: Schema.Types.ObjectId, ref: 'Entrega', default: null },
        mensajeSolicitante: { type: String, default: null },
        estadoSolicitud: {
            type: String,
            enum: [
                'PENDIENTE_APROBACION',
                'APROBADA_ESPERANDO_CONFIRMACION_HORARIO', 
                'RECHAZADA_DONANTE',
                'CANCELADA_RECEPTOR',
                'COMPLETADA_CON_ENTREGA',
                'FALLIDA_ENTREGA_CERRADA',
            ],
            default: 'PENDIENTE_APROBACION',
            required: true,
            index: true,
        },
        fechaAprobacion: { type: Date, default: null },
        fechaRechazo: { type: Date, default: null },
        fechaCancelacion: { type: Date, default: null },
        motivoRechazo: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

SolicitudSchema.index({ donacionId: 1, solicitanteId: 1 });

export default mongoose.model('Solicitud', SolicitudSchema);