import mongoose from "mongoose";

const {Schema} = mongoose;

const ReporteSchema = new Schema(
    {
        reportadorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
            index: true,
        },
        tipoElementoReportado:{
            type: String,
            enum: ['User', 'Publicacion','Entrega'],
            required: true,
        },
        elementoReportadoId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index:true,
        },
        motivo: {
            type: String,
            required: true,
        },
        descripcionAdicional:{
            type:String,
        },
        estadoReporte:{
            type:String,
            enum:['PENDIENTE_REVISION',
            'EN_PROCESO',
            'RESUELTO_ACCION_TOMADA',
            'RESUELTO_SIN_ACCION',
            ],
            default:'PENDIENTE_REVISION',
            required:true,
            index:true,
        },
        moderadorAsignadoId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        resolucion:{
            type:String,
        },
        fechaResolucion: {
            type:Date,
        },
    },
    {
        timestamps: true
    }
)



export default mongoose.model('Reporte', ReporteSchema)