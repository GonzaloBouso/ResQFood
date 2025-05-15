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
        ref:'Entrega',
        required: true,
        index: true,
    },
    calificadorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    calificadoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuario',
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

export default mongoose.model('Calificaciones', calificacionesSchema)