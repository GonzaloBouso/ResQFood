
import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const bitacoraAccionesAdminSchema = new Schema(
  {
    actorId: {
      type: Types.ObjectId,
      ref: 'User', 
      required: true,
      index: true,
    },
    accion: {
      type: String,
      required: true,
    },
    tipoElementoAfectado: {
      type: String,
      enum: ['User', 'Donacion', 'Solicitud', 'Entrega', 'Reporte'],
      default: null,
    },
    elementoAfectadoId: {
      type: Types.ObjectId,
      default: null,
    },
    justificacionOMotivo: {
      type: String,
      default: null,
    },
    detallesAdicionales: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, 
    versionKey: false,
  }
);

export default mongoose.model('BitacoraAccionesAdmin', bitacoraAccionesAdminSchema);