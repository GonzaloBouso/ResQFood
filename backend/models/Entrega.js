import mongoose from "mongoose";

const EntregaSchema = new mongoose.Schema(
    {
        solicituId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Solicitud',
            required:true,
            unique:true,// Una solicitud genera solo una entrega
            index:true
        },
        donacionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Donacion',
            required: true,
            index:true,
        },
        donateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            index:true,
        },
        solicitanteId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            index:true
        },
        horarioEntregaPropuestaPorDonante: {
            type: {
                horarioInicio:{type: String,
                    required:true},
                    horarioFin:{type: String, required: true}
            },
            required: true,
        },
        fechaPropuesto:{
            type:{
                fechaInicio:{type:Date, required: true},
                fechaFin:{type:Date, required: true},
            },
            required: true,
        },
        horarioEntregaConfirmadoSolicitante: {
            type:Boolean, 
            default: false,
        },
        fechaHorarioConfirmado: {
            type:Date,
            default: null,
        },
        codigoConfirmacionReceptor: {
            type: String,
            required: true,
        },
        estadoEntrega: {
            type:String,
            enum:[
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
            index:true,
        },
        notasEntrega: {
            type:String,
            default:null,
        },
        fechaCompletada:{
            type:Date,
            default: null,
        }, 
        fechaFallida: {
            type:Date,
            default:null,
        },
        fechaCancelada: {
            type: Date,
            default: null,
        },

    },
    {
        timestamps: true,
    }
);

EntregaSchema.index({donacionId:1, solicitanteId: 1});

export default mongoose.model('Entrega', EntregaSchema)