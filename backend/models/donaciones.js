import mongoose from "mongoose";


const donationSchema = new Schema(
    {
        donanteId: {
            type:Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true,
            index: true,// FK
        },
        titulo: {
            type: String,
            required: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
        imagenesUrl:{
            type: [String],
            validate: {
                validator: function (arr){
                    return arr.length > 0;
                },
                message:'Debe haber al menos una imagen.',
            },
        },
        categoria: {
            type:String,
            required:true,
            index:true,
        },
        fechaVencimientoProducto: {
            type:Date,
            default: null
        },
        fechaElaboracion: {
            type: Date,
            default: null,
        },
        ubicacionRetiro: {
            direccion: {type: String, required: true},
            ciudad: {type:String, required: true},
            provincia: {type:String, required: true},
            pais: {type: String, required:true},
            coordenadas: {
                type:{ type: String, enum: ['Point'], default:'Point'},
                coordinates: {
                    type:[Number],
                    required:true,
                    validate: {
                        validator: function (coords) {
                            return coords.length === 2;
                        },
                        message: 'Las coordenadas deben ser un array con longitud 2 (latitud y longitud).'
                    },
                },
            },
            referenciasAdicionales: {type: String, default:null},
        },
        estadoAlimento: {
            type: String,
            enum: ['FRESCO', 'CONGELADO', 'NO_PERECEDERO'],
            required: true,
        },
        estadoPublicacion: {
            type:String,
            enum: ['DISPONIBLE',
                'PENDIENTE-ENTREGA',
                'ENTREGADA',
                'CANCELADA_DONANTE',
                'EXPIRADA'
            ],
            default: 'DISPONIBLE',
            index:true,
        },
        fechaExpiracionPublicacion: {
            type: Date,
            require:true,
            index:true,
        },
        informacionContactoAlternativa: {
            telefono: {type:String, default: null},
            email: {type:String, default: null}
        },
        condicionesEspeciales: {
            type:String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


donationSchema.index({'UbicacionRetiro.coordenadas': '2dsphere'})


export default mongoose.model('Donacion', donationSchema);