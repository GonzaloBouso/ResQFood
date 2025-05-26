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
    calificacionPromedioComoDonante: { type: Number, default: null, min: 0, max: 5 }, // Añadido min/max aquí también por consistencia
    numeroCalificacionesComoDonante: { type: Number, default: 0 },
});

const estadisticasGeneralesSchema = new mongoose.Schema({
    totalDonacionesHechas: { type: Number, default: 0 },
    calificacionPromedioComoDonante: { type: Number, default: null, min: 0, max: 5 },
    numeroCalificacionesComoDonante: { type: Number, default: 0 },
    calificacionPromedioComoReceptor: { type: Number, default: null, min: 0, max: 5 }, // Añadido min/max
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
        clerkUserId: { type: String, unique: true, index: true, required: true }, // Marcado como required ya que es esencial
        nombre: { 
            type: String, 
            // El nombre puede venir de Clerk o ser establecido/actualizado después.
            // Si se requiere solo cuando hay un rol, la lógica de 'required' es correcta.
            required: function() { return !!this.rol && this.rol !== null; } 
        },
        email: { type: String, unique: true, index: true, required: true }, // El email de Clerk es esencial
        telefono: {
            type: String,
            required: function() { return this.rol === 'LOCAL'; } // Solo obligatorio si el rol es LOCAL
        },
        ubicacion: {
            type: ubicacionSchema,
            // Obligatorio si el rol es GENERAL o LOCAL, y el rol ya está definido.
            required: function() { return (this.rol === 'GENERAL' || this.rol === 'LOCAL'); }
        },
        fotoDePerfilUrl: { type: String, default: null },
        rol: {
            type: String,
            enum: ['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN', null], // Permitir null para el estado inicial
            index: true,
            default: null,
        },
        activo: { type: Boolean, default: true },
        fechaSuspension: { type: Date, default: null },
        motivoSuspension: { type: String, default: null },

        // Subdocumento para datos específicos del rol LOCAL
        localData: {
            type: localSchema,
            default: null, // Será un objeto si el rol es LOCAL, sino null/undefined
        },
        // Subdocumento para estadísticas específicas del rol GENERAL
        estadisticasGenerales: {
            type: estadisticasGeneralesSchema,
            default: null, // Será un objeto si el rol es GENERAL, sino null/undefined
        },
        // Subdocumento para permisos de ADMIN/MODERADOR
        permisos: {
            type: permisosSchema,
            default: null, // Será un objeto si el rol es ADMIN/MODERADOR, sino null
        },
    },
    { timestamps: true } // Añade createdAt y updatedAt automáticamente
);

// --- Middleware pre('save') Mejorado ---
userSchema.pre('save', function (next) {
    // Solo ejecutar esta lógica si el documento es nuevo o si el campo 'rol' ha sido modificado.
    if (this.isNew || this.isModified('rol')) {
        
        // Lógica para localData y estadisticasGenerales basada en el rol actual
        if (this.rol === 'LOCAL') {
            if (!this.localData) { // Si localData no existe o no fue enviado en la actualización
                this.localData = {}; // Inicialízalo para que Mongoose aplique defaults del subesquema
            }
            this.estadisticasGenerales = undefined; // Limpia datos del rol GENERAL
        } else if (this.rol === 'GENERAL') {
            if (!this.estadisticasGenerales) {
                this.estadisticasGenerales = {}; // Inicialízalo
            }
            this.localData = undefined; // Limpia datos del rol LOCAL
        } else {
            // Si el rol es ADMIN, MODERADOR, o null (inicial)
            this.localData = undefined;
            this.estadisticasGenerales = undefined;
        }

        // Lógica para permisos
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
            // Para roles como GENERAL, LOCAL, o si el rol es null.
            this.permisos = null; 
        }
    }
    next();
});

// --- Método toJSON para limpiar la respuesta ---
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    // Puedes decidir qué campos no quieres que se envíen al frontend por defecto
    delete obj.__v; // Común eliminar la versión de Mongoose
    // Ya tenías estos, lo cual está bien si no quieres exponerlos siempre:
    delete obj.motivoSuspension;
    delete obj.fechaSuspension;
    // Considera si quieres eliminar 'password' si lo tuvieras, aunque Clerk lo maneja.
    return obj;
}

export default mongoose.model('User', userSchema);