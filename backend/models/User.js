import mongoose from 'mongoose'


const ubicacionSchema = new mongoose.Schema({
    direccion: {type: String, required: true},
    ciudad: {type:String, required: true},
    provincia: {type: String, required: true},
    pais: {type:String, required:true},
    coordenadas: {
        type:{
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,

        },
    },
});


//Definición de subesquemas para roles específicos
const localSchema = new mongoose.Schema({
    tipoNegocio: {type: String, required: true},
    horarioAtencion: {type: String, required: true},
    descripcionEmpresa: {type: String, required: true},
    
    //Estadisticas de donaciones como Donante
    totalDonacionesHechas: { type: Number, default: 0 },
    calificacionPromedioComoDonante: { type: Number, default: null },
    numeroCalificacionesComoDonante: { type: Number, default: 0 },
});


//subesquema para estadisticas de usuario general
const estadisticasGenerales = new mongoose.Schema({
    //Estadisticas como donante
    totalDonacionesHechas:{
        type:Number,
         default: 0
        },
    calificacionPromedioComoDonante: {
        type: Number,
         default: null,
         min: 0,
         max:5
        },
    numeroCalificacionesComoDonante: { 
        type:Number,
        default: 0
        },
    //Estadistias como receptor
    calificacionPromedioComoReceptor: {
        type:Number,
        default:null
        },
    totalDonacionesRecibidas: {
        type:Number, 
        default: 0
    },
    numeroCalificacionesComoReceptor: {
        type:Number,
        default: 0
        },
    
});

//Subesquemas para permisos de admin y moderador
const permisosSchema = new mongoose.Schema({
    puedeSuspenderUsuarios: {type:Boolean, default: false},//solo admin
    puedeEliminarPublicaciones: {type:Boolean, default: false},//Moderador y admin
    puedeGestionarReportes: {type:Boolean, default: false},//Moderador y admin
    puedeGestionarRoles: {type:Boolean, default:false},//solo admin
    puedeAccederEstadisticasGlobales: {type:Boolean, default:false}//solo admin
})

//PINCIPAL
const userSchema = new mongoose.Schema(
    {
    clerkUserId: {type: String, unique: true, index:true},
    nombre: { type: String, required: true},
    email: {type:String, unique: true, index:true},
    telefono: {
        type: String,
        required: function(){
            return this.rol === 'LOCAL'
        }
    },
    ubicacion: {
        type: ubicacionSchema,
        required:true
    },
    fotoDePerfilUrl:{ type: String, default: null},
    rol: {
        type:String,
        enum: ['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN'], 
        index: true,
        required: true
    },
    activo: {type:Boolean, default: true},
    fechaSuspension: {type:Date, default: null},
    motivoSuspension: {type: String, default: null},

    //local
    localData: {
        type:localSchema, 
        default:null,
    },
    //general
    estadisticasGenerales: {
        type:estadisticasGenerales, 
        default: null,
    },
    //admin/moderador
    permisos: {
        type: permisosSchema, 
        default:null},

},
{   timestamps:true  });



//Indice geoespacia para coordenadas
userSchema.index({'ubicacion.coordenadas': '2dsphere'});

//Middleware para inicializacion de subdocumentos segun rol

userSchema.pre('save', function (next){
    if (this.rol === 'LOCAL' && !this.localData) {
        this.localData = {};
    }
    if (this.rol === 'GENERAL' && !this.estadisticasGenerales) {
        this.estadisticasGenerales = {};
    }
    if (this.rol ==='ADMIN') {
        this.permisos = {
            puedeSuspenderUsuarios:true,
            puedeEliminarPublicaciones:true,
            puedeGestionarReportes:true,
            puedeGestionarRoles:true,
            puedeAccederEstadisticasGlobales:true,
        };
    }else if (this.rol === 'MODERADOR') {
        this.permisos = {
            puedeSuspenderUsuarios:false,
            puedeEliminarPublicaciones:true,
            puedeGestionarReportes:true,
            puedeGestionarRoles:false,
            puedeAccederEstadisticasGlobales:false,
        };
    }else{
        this.permisos = null;
    }
    next()
})

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.motivoSuspension;
    delete obj.fechaSuspension;
    return obj;
}

export default mongoose.model('Usuario', userSchema)