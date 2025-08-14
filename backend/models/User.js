import mongoose from 'mongoose';

const ubicacionSchema = new mongoose.Schema({
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    pais: { type: String, required: true },
    coordenadas: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    }
});

const localSchema = new mongoose.Schema({
    tipoNegocio: { type: String, required: true },
    horarioAtencion: { type: String, required: true },
    descripcionEmpresa: { type: String, required: true },
    totalDonacionesHechas: { type: Number, default: 0 },
    calificacionPromedioComoDonante: { type: Number, default: null, min: 0, max: 5 },
    numeroCalificacionesComoDonante: { type: Number, default: 0 },
});

const estadisticasGeneralesSchema = new mongoose.Schema({
    totalDonacionesHechas: { type: Number, default: 0 },
    calificacionPromedioComoDonante: { type: Number, default: null, min: 0, max: 5 },
    numeroCalificacionesComoDonante: { type: Number, default: 0 },
    calificacionPromedioComoReceptor: { type: Number, default: null, min: 0, max: 5 },
    totalDonacionesRecibidas: { type: Number, default: 0 },
    numeroCalificacionesComoReceptor: { type: Number, default: 0 },
});

const permisosSchema = new mongoose.Schema({
    puedeSuspenderUsuarios: { type: Boolean, default: false },
    puedeEliminarPublicaciones: { type: Boolean, default: false },
    puedeGestionarReportes: { type: Boolean, default: false },
    puedeGestionarRoles: { type: Boolean, default: false },
    puedeAccederEstadisticasGlobales: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        clerkUserId: { type: String, unique: true, index: true, required: true },
        nombre: {
            type: String,
            required: function() { return !!this.rol; }
        },
        email: { type: String, unique: true, index: true, required: true },
        telefono: {
            type: String,
            required: function() { return this.rol === 'LOCAL'; }
        },
        ubicacion: {
            type: ubicacionSchema,
            required: function() { return this.rol === 'GENERAL' || this.rol === 'LOCAL'; }
        },
        fotoDePerfilUrl: { type: String, default: null },
        rol: {
            type: String,
            enum: ['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN', null],
            index: true,
            default: null,
        },
        activo: { type: Boolean, default: true },
        fechaSuspension: { type: Date, default: null },
        motivoSuspension: { type: String, default: null },
        localData: {
            type: localSchema,
            default: null,
        },
        estadisticasGenerales: {
            type: estadisticasGeneralesSchema,
            default: null,
        },
        permisos: {
            type: permisosSchema,
            default: null,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('rol')) {
        // Lógica de limpieza: si el rol cambia, eliminamos los datos del rol antiguo.
        if (this.rol === 'LOCAL') {
            this.estadisticasGenerales = undefined;
            // NO creamos un localData vacío. Si no existe, es porque aún no se ha completado.
        } else if (this.rol === 'GENERAL') {
            this.localData = undefined;
        } else { // Para ADMIN o null
            this.localData = undefined;
            this.estadisticasGenerales = undefined;
        }

        // Lógica de asignación de permisos (sin cambios, ya era correcta)
        if (this.rol === 'ADMIN') {
            this.permisos = {
                puedeSuspenderUsuarios: true,
                puedeEliminarPublicaciones: true,
                puedeGestionarReportes: true,
                puedeGestionarRoles: true,
                puedeAccederEstadisticasGlobales: true,
            };
        } else {
            this.permisos = null;
        }
    }
    next();
});

userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    delete obj.motivoSuspension;
    delete obj.fechaSuspension;
    return obj;
}

export default mongoose.model('User', userSchema);