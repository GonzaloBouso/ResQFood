import mongoose from 'mongoose';

const calificacionesSchema = new mongoose.Schema({
    entregaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrega',
        required:true,
        index: true,
    },
    donacionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Donacion',
        required: true,
        index: true,
    },
    calificadorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    calificadoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rolCalificado:{
        type:String,
        enum:['DONANTE', 'RECEPTOR'],
        required: true,
    },
    puntuacion:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    comentario:{
        type: String,
        default: null
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

export default mongoose.model('Calificacion', calificacionesSchema)