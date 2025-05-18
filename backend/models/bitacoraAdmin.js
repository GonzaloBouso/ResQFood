import mongoose from 'mongoose';

const {Schema, Types} = mongoose;

const bitacoraAccionesAdminSchema = new Schema(
  {
    actorId: {
      type: Types.ObjectId,
      ref: 'User', // Referencia a la colección de usuarios
      required: true,
      index: true,
    },
    accion: {
      type: String,
      required: true,
    },
    tipoElementoAfectado: {
      type: String,
      enum: ['User', 'Donacion', 'Solicitud', 'Entrega', 'Reporte'], // Opcional pero limitado a tipos conocidos
      default: null,
    },
    elementoAfectadoId: {
      type: Types.ObjectId,
      default: null, // Relación opcional a cualquier elemento afectado
    },
    justificacionOMotivo: {
      type: String,
      default: null, // Explicación opcional del motivo
    },
    detallesAdicionales: {
      type: Schema.Types.Mixed, // Permite guardar datos flexibles según la acción
      default: null,
    },
    ipAddress: {
      type: String,
      default: null, // Dirección IP opcional
    },
    createdAt: {
      type: Date,
      default: Date.now, // Fecha de creación automática
      immutable: true,
    },
  },
  {
    timestamps: false, // Ya usamos `createdAt`
    versionKey: false, // Evita el uso de __v
  }
);

export default mongoose.model('BitacoraAccionesAdmin', bitacoraAccionesAdminSchema)