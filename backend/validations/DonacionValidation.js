// src/validations/DonacionValidation.js
import { z } from 'zod';

const ubicacionSchemaObligatoria = z.object({
    direccion: z.string().min(1, 'La dirección de retiro es obligatoria'),
    ciudad: z.string().min(1, 'La ciudad de retiro es obligatoria'),
    provincia: z.string().min(1, 'La provincia de retiro es obligatoria'),
    pais: z.string().min(1, 'El país de retiro es obligatorio'),
    // Hacemos coordenadas opcionales en Zod para que coincida con Mongoose si las haces opcionales allí
    coordenadas: z.object({
      type: z.literal('Point').default('Point').optional(),
      coordinates: z.array(z.number()).length(2, "Debe haber dos coordenadas").optional() 
    }).optional()
});

export const createDonacionSchema = z.object({
    titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100, 'El título no puede exceder los 100 caracteres'),
    descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000, 'La descripción no puede exceder los 1000 caracteres'),
    // ELIMINAMOS imagenesUrl de aquí, ya que se maneja por req.files y una validación separada en el controlador.
    // imagenesUrl: z.array(z.string().url()).min(1, "Debes subir al menos una imagen"), 
    categoria: z.string().min(1, "La categoría es obligatoria"),
    fechaVencimientoProducto: z.string().datetime({ message: "Formato de fecha de vencimiento inválido" }).optional().nullable(),
    fechaElaboracion: z.string().datetime({ message: "Formato de fecha de elaboración inválido" }).optional().nullable(),
    ubicacionRetiro: ubicacionSchemaObligatoria,
    estadoAlimento: z.enum(['FRESCO', 'CONGELADO', 'NO_PERECEDERO'], {
        required_error: "El estado del alimento es obligatorio.",
        invalid_type_error: "Estado del alimento inválido."
    }),
    fechaExpiracionPublicacion: z.string().datetime({ message: "Fecha de expiración de la publicación inválida" }),
    informacionContactoAlternativa: z.object({
        telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono de contacto alternativo no es válido').optional().or(z.literal('')), // Permite string vacío
        email: z.string().email("Email de contacto alternativo inválido").optional().or(z.literal('')), // Permite string vacío
    }).deepPartial().optional().nullable(), // deepPartial para que telefono/email internos sean opcionales
    condicionesEspeciales: z.string().max(500, "Las condiciones especiales no pueden exceder los 500 caracteres").optional().nullable(),
});