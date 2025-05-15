import mongoose, { Schema } from "mongoose";


//Definicion esquema solicitudes
const SolicitudSchema = new Schema(
    {
        donacionId: {
            type: Schema.Types.ObjectId,
            ref: 'Donacion', //Referencia al modelo de donaciones
            required: true,
            index: true,
        },
        donanteId: {
            type:Schema.Types.ObjectId,
            ref: 'Usuario', //Referencia al modelo usuarios(denormalizados)
            required:true,
            index: true,
        },
        solicitanteId: {
            type:Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true,
            index:true,
        },
        estadoSolicitud: {
            type: String,
            enum: [
                'PENDIENTE_APROBACION',
                'APROBADA_ESPERANDO_ENTREGA',
                'RECHAZADA_DONANTE',
                'CANCELADA_RECEPTOR',
                'COMPLETADA_CON_ENTREGA',
                'FALLIDA_ENTREGA_CERRADA',
            ],
            default: 'PENDIENTE_APROBACION',
            required: true,
            index: true,
        },
        motivoRechazoO: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    },
    },
    {
        timestamps: true,
    }
)

// Crear índice compuesto para optimizar búsquedas frecuentes
SolicitudSchema.index({ donacionId: 1, solicitanteId: 1 });

//Exportar modelo
export default mongoose.model('Solicitud', SolicitudSchema)