import mongoose from 'mongoose'


const ubicacionSchema = new mongoose.Schema({
    direccion: {type: String, required: true},
    ciudad: {type:String, required: true},
    provincia: {type: String, required: true},
    pais: {type:String, required:true},
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
    nombre: { type: String, required: function(){
        return !!this.rol;
    },},
    email: {type:String, unique: true, index:true},
    telefono: {
        type: String,
        required: function(){
            return this.rol === 'LOCAL'
        }
    },
    ubicacion: {
        type: ubicacionSchema,
        required:function (){
            return !! this.rol;
        }
    },
    fotoDePerfilUrl:{ type: String, default: null},
    rol: {
        type:String,
        enum: ['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN'], 
        index: true,
        default: null,
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


userSchema.pre('save', function (next) {
  // Solo ejecutar esta lógica si el documento es nuevo o si el campo 'rol' ha sido modificado.
  if (this.isNew || this.isModified('rol')) {
    
    // Lógica para localData y estadisticasGenerales basada en el rol actual
    if (this.rol === 'LOCAL') {
      // Si el rol es LOCAL:
      // 1. Asegúrate de que localData exista. Si no, créalo vacío.
      //    Si localData ya fue poblado por el controlador desde req.body, esto no lo sobrescribirá
      //    a menos que el req.body no incluyera localData y this.localData fuera null/undefined.
      if (!this.localData) {
        this.localData = {}; 
      }
      // 2. Limpia estadisticasGenerales (datos del rol GENERAL)
      this.estadisticasGenerales = undefined; // Mongoose eliminará este campo si es undefined
    } else if (this.rol === 'GENERAL') {
      // Si el rol es GENERAL:
      // 1. Asegúrate de que estadisticasGenerales exista.
      if (!this.estadisticasGenerales) {
        this.estadisticasGenerales = {};
      }
      // 2. Limpia localData (datos del rol LOCAL)
      this.localData = undefined;
    } else {
      // Si el rol es ADMIN, MODERADOR, o null/otro (y no es GENERAL ni LOCAL)
      // Limpia ambos subdocumentos específicos de perfil.
      this.localData = undefined;
      this.estadisticasGenerales = undefined;
    }

    // Lógica para permisos (tu lógica actual está bien aquí, pero la incluimos dentro del if)
    if (this.rol === 'ADMIN') {
      this.permisos = {
        puedeSuspenderUsuarios: true,
        puedeEliminarPublicaciones: true,
        puedeGestionarReportes: true,
        puedeGestionarRoles: true,
        puedeAccederEstadisticasGlobales: true,
      };
    } else if (this.rol === 'MODERADOR') {
      this.permisos = {
        puedeSuspenderUsuarios: false,
        puedeEliminarPublicaciones: true,
        puedeGestionarReportes: true,
        puedeGestionarRoles: false,
        puedeAccederEstadisticasGlobales: false,
      };
    } else {
      // Para roles como GENERAL, LOCAL, o si el rol es null/otro.
      this.permisos = null; // O un objeto de permisos por defecto con todo en false si lo prefieres.
    }
  }
  next();
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.motivoSuspension;
    delete obj.fechaSuspension;
    return obj;
}

export default mongoose.model('User', userSchema)