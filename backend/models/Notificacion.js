import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema(
    {
        destinatarioId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            index:true,
        },
        tipoNotificacion:{
            type:String,
            enum: ['SOLICITUD', 'APROBACION', 'RECHAZO', 'ENTREGA', 'GENERAL'],
            required:true,
        },
        mensaje:{
            type: String,
            required: true,
            maxlength: 500
        },
        referenciaId:{
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'tipoReferencia',
            default: null,
        },
        tipoReferencia:{
            type:String,
            enum:['Donacion', 'Solicitud', 'Entrega', 'User'],
            default:null,
        },
        leida:{
            type:Boolean,
            default: false,
            index:true,
        },
        fechaLeida:{
            type:Date,
            default:null,
        },
        createdAt:{
            type:Date,
            default:Date.now,
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Notificacion', notificacionSchema)