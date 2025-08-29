// backend/models/Reporte.js (CÓDIGO COMPLETO Y CORREGIDO)
import mongoose, { Schema } from "mongoose";

const ReporteSchema = new Schema(
    {
        reportadoPor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        usuarioReportado: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        donacionReportada: { type: Schema.Types.ObjectId, ref: 'Donacion', required: true, index: true },
        motivo: {
            type: String,
            enum: [
                'Contenido inapropiado',
                'Información falsa o engañosa',
                'Spam',
                'Comportamiento abusivo',
                'Otro'
            ],
            required: true,
        },
        detalles: { type: String, trim: true, maxLength: 500 },
        estado: {
            type: String,
            enum: ['PENDIENTE', 'RESUELTO'],
            default: 'PENDIENTE',
            index: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Reporte', ReporteSchema);