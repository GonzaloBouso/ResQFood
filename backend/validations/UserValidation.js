import { z } from 'zod';

// --- Esquema para Ubicación (cuando es obligatoria) ---
const ubicacionSchemaObligatoria = z.object({
    direccion: z.string().min(1, 'La dirección es obligatoria'),
    ciudad: z.string().min(1, 'La ciudad es obligatoria'),
    provincia: z.string().min(1, 'La provincia es obligatoria'),
    pais: z.string().min(1, 'El país es obligatorio'),
    coordenadas: z.object({
        type: z.literal('Point').optional(),
        coordinates: z.array(z.number()).length(2, "El array de coordenadas debe tener 2 números (longitud, latitud)")
    })
});

// --- Esquema para Datos de Local (cuando son obligatorios) ---
const localDataSchemaObligatoria = z.object({
    tipoNegocio: z.string().min(1, 'El tipo de negocio es obligatorio'),
    horarioAtencion: z.string().min(1, 'El horario de atención es obligatorio'),
    descripcionEmpresa: z.string().min(1, 'La descripción de la empresa es obligatoria'),
});

// --- Esquema para COMPLETAR PERFIL INICIAL (cuando el rol es null y se establece por primera vez) ---
export const completeInitialProfileSchema = z.discriminatedUnion("rol", [
    z.object({
        rol: z.literal("GENERAL"),
        nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
        telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono no es válido (7-15 dígitos)').optional().nullable(),
        ubicacion: ubicacionSchemaObligatoria,
    }),
    z.object({
        rol: z.literal("LOCAL"),
        nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
        telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono es obligatorio y debe tener entre 7-15 dígitos'),
        ubicacion: ubicacionSchemaObligatoria,
        localData: localDataSchemaObligatoria,
    })
]);

// --- Esquema para ACTUALIZACIONES PARCIALES (cuando el rol ya está establecido) ---
const ubicacionUpdateSchema = ubicacionSchemaObligatoria.deepPartial();
const localDataUpdateSchema = localDataSchemaObligatoria.deepPartial();

// ==================================================================
// LA SOLUCIÓN:
// Se elimina la línea duplicada de `localData` y se actualiza el `enum` de roles.
// ==================================================================
export const updateUserSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
    telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono no es válido (7-15 dígitos)').optional().nullable(),
    ubicacion: ubicacionUpdateSchema.optional(),
    fotoDePerfilUrl: z.string().url("URL de foto inválida").optional().nullable(),
    rol: z.enum(['GENERAL', 'LOCAL', 'ADMIN']).optional(), // Se elimina 'MODERADOR'
    localData: localDataUpdateSchema.optional(), // Se mantiene una sola definición de localData
});


// --- Esquemas auxiliares para createUserSchema (restaurados de tu versión original) ---
const estadisticasGeneralesSchema = z.object({
    totalDonacionesHechas: z.number().min(0).default(0),
    calificacionPromedioComoDonante: z.number().min(0).max(5).nullable().default(null),
    numeroCalificacionesComoDonante: z.number().min(0).default(0),
    calificacionPromedioComoReceptor: z.number().min(0).max(5).nullable().default(null),
    totalDonacionesRecibidas: z.number().min(0).default(0),
    numeroCalificacionesComoReceptor: z.number().min(0).default(0)
});

const permisosSchema = z.object({
    puedeSuspenderUsuarios: z.boolean().default(false),
    puedeEliminarPublicaciones: z.boolean().default(false),
    puedeGestionarReportes: z.boolean().default(false),
    puedeGestionarRoles: z.boolean().default(false),
    puedeAccederEstadisticasGlobales: z.boolean().default(false),
});

// --- Esquema para CREACIÓN DE USUARIO (restaurado de tu versión original) ---
export const createUserSchema = z.object({
  clerkUserId: z.string().nonempty('El ID de Clerk es obligatorio'),
  email: z.string().email('El email no es válido'),
  nombre: z.string().min(3).optional(),
  rol: z.enum(['GENERAL', 'LOCAL', 'ADMIN']).nullable().default(null), // Se elimina 'MODERADOR'
  activo: z.boolean().default(true),
  estadisticasGenerales: estadisticasGeneralesSchema.optional().nullable(),
  localData: localDataSchemaObligatoria.deepPartial().optional().nullable(),
  ubicacion: ubicacionSchemaObligatoria.optional().nullable(),
  telefono: z.string().regex(/^\d{7,15}$/, 'El número de teléfono debe contener entre 7 y 15 dígitos').optional().nullable(),
  permisos: permisosSchema.optional().nullable(),
  fotoDePerfilUrl: z.string().url().optional().nullable(),
});