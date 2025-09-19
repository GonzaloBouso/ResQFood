import mongoose from "mongoose";

const { Schema } = mongoose;

const donationSchema = new Schema(
    {
        donanteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        imagenesUrl: {
            type: [String],
            validate: { validator: (arr) => arr.length > 0, message: 'Debe haber al menos una imagen.' },
        },
        categoria: { type: String, required: true, index: true },
        fechaVencimientoProducto: { type: Date, default: null },
        fechaElaboracion: { type: Date, default: null },
        ubicacionRetiro: {
            direccion: { type: String, required: true },
            ciudad: { type: String, required: true },
            provincia: { type: String, required: true },
            pais: { type: String, required: true },
            coordenadas: {
                type: { type: String, enum: ['Point'], default: 'Point' },
                coordinates: {
                    type: [Number],
                    validate: { validator: (coords) => coords.length === 2, message: 'Las coordenadas deben ser [longitud, latitud].' },
                },
            },
            referenciasAdicionales: { type: String, default: null },
        },
        estadoAlimento: { type: String, enum: ['FRESCO', 'CONGELADO', 'NO_PERECEDERO'], required: true },
        estadoPublicacion: {
            type: String,
            enum: ['DISPONIBLE', 'PENDIENTE-ENTREGA', 'ENTREGADA', 'CANCELADA_DONANTE', 'EXPIRADA'],
            default: 'DISPONIBLE',
            index: true,
        },
        fechaExpiracionPublicacion: { type: Date, required: true, index: true },
        informacionContactoAlternativa: {
            telefono: { type: String, default: null },
            email: { type: String, default: null }
        },
        condicionesEspeciales: { type: String, default: null },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

donationSchema.virtual('solicitudes', {
    ref: 'Solicitud',
    localField: '_id',
    foreignField: 'donacionId'
});

donationSchema.index({ 'ubicacionRetiro.coordenadas': '2dsphere' });

// LA SOLUCIÓN: Verifica si el modelo ya existe.
export default mongoose.models.Donacion || mongoose.model('Donacion', donationSchema);