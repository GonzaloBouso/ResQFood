// src/models/User.js
import mongoose from 'mongoose';

// --- Subesquemas Definidos ---
const ubicacionSchema = new mongoose.Schema({
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    pais: { type: String, required: true },
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

// --- Esquema Principal del Usuario ---
const userSchema = new mongoose.Schema(
    {
        clerkUserId: { type: String, unique: true, index: true, required: true },
        nombre: { 
            type: String, 
            required: function() { return !!this.rol && this.rol !== null; } 
        },
        email: { type: String, unique: true, index: true, required: true },
        telefono: {
            type: String,
            required: function() { return this.rol === 'LOCAL'; }
        },
        ubicacion: {
            type: ubicacionSchema,
            required: function() { return (this.rol === 'GENERAL' || this.rol === 'LOCAL'); }
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

// --- Middleware pre('save') CON LOGS ADICIONALES (manteniendo los logs para depuración) ---
userSchema.pre('save', function (next) {
    console.log(" modèles/User.js - pre('save'): HOOK EJECUTÁNDOSE");
    console.log(" modèles/User.js - pre('save'): Documento actual (this):", JSON.stringify(this.toObject(), null, 2));
    console.log(` modèles/User.js - pre('save'): this.isNew = ${this.isNew}, this.isModified('rol') = ${this.isModified('rol')}`);

    if (this.isNew || this.isModified('rol')) {
        console.log(" modèles/User.js - pre('save'): Condición (isNew o isModified('rol')) CUMPLIDA.");
        console.log(" modèles/User.js - pre('save'): Rol actual antes de la lógica:", this.rol);

        if (this.rol === 'LOCAL') {
            console.log(" modèles/User.js - pre('save'): Rol es LOCAL.");
            if (!this.localData) {
                console.log(" modèles/User.js - pre('save'): localData no existe, inicializando a {}.");
                this.localData = {};
            }
            this.estadisticasGenerales = undefined;
            console.log(" modèles/User.js - pre('save'): estadisticasGenerales seteado a undefined.");
        } else if (this.rol === 'GENERAL') {
            console.log(" modèles/User.js - pre('save'): Rol es GENERAL.");
            if (!this.estadisticasGenerales) {
                console.log(" modèles/User.js - pre('save'): estadisticasGenerales no existe, inicializando a {}.");
                this.estadisticasGenerales = {};
            }
            this.localData = undefined;
            console.log(" modèles/User.js - pre('save'): localData seteado a undefined.");
        } else {
            console.log(" modèles/User.js - pre('save'): Rol es OTRO (null, ADMIN, MODERADOR).");
            this.localData = undefined;
            this.estadisticasGenerales = undefined;
            console.log(" modèles/User.js - pre('save'): localData y estadisticasGenerales seteados a undefined.");
        }

        if (this.rol === 'ADMIN') {
            console.log(" modèles/User.js - pre('save'): Rol es ADMIN, asignando permisos de ADMIN.");
            this.permisos = {
                puedeSuspenderUsuarios: true,
                puedeEliminarPublicaciones: true,
                puedeGestionarReportes: true,
                puedeGestionarRoles: true,
                puedeAccederEstadisticasGlobales: true,
            };
        } else if (this.rol === 'MODERADOR') {
            console.log(" modèles/User.js - pre('save'): Rol es MODERADOR, asignando permisos de MODERADOR.");
            this.permisos = {
                puedeSuspenderUsuarios: false,
                puedeEliminarPublicaciones: true,
                puedeGestionarReportes: true,
                puedeGestionarRoles: false,
                puedeAccederEstadisticasGlobales: false,
            };
        } else {
            console.log(" modèles/User.js - pre('save'): Rol no es ADMIN/MODERADOR, seteando permisos a null.");
            this.permisos = null; 
        }
        console.log(" modèles/User.js - pre('save'): Estado del documento DESPUÉS de aplicar lógica de rol:", JSON.stringify(this.toObject(), null, 2));
    } else {
        console.log(" modèles/User.js - pre('save'): Condición (isNew o isModified('rol')) NO CUMPLIDA. Saltando lógica de rol.");
    }
    console.log(" modèles/User.js - pre('save'): Llamando a next().");
    next();
});

// --- Método toJSON para limpiar la respuesta ---
// --- VERSIÓN CORREGIDA ---
userSchema.methods.toJSON = function () {
    const obj = this.toObject(); // <<< ESTA LÍNEA ES CLAVE Y DEBE ESTAR PRIMERO
    
    // Puedes decidir qué campos no quieres que se envíen al frontend por defecto
    delete obj.__v; // Común eliminar la versión de Mongoose
    
    // Elimina campos sensibles o que no quieres exponer siempre
    // (estos ya los tenías y están bien si esa es tu intención)
    delete obj.motivoSuspension;
    delete obj.fechaSuspension;
    
    // Considera si quieres eliminar 'password' si lo tuvieras (aunque Clerk lo maneja).
    // delete obj.password; 

    return obj; // <<< DEVOLVER EL OBJETO MODIFICADO
}

export default mongoose.model('User', userSchema);