// src/validations/UserValidation.js
import { z } from 'zod';

// --- Esquema para Ubicación (cuando es obligatoria) ---
const ubicacionSchemaObligatoria = z.object({
    direccion: z.string().min(1, 'La dirección es obligatoria'),
    ciudad: z.string().min(1, 'La ciudad es obligatoria'),
    provincia: z.string().min(1, 'La provincia es obligatoria'),
    pais: z.string().min(1, 'El país es obligatorio'),
});

// --- Esquema para Datos de Local (cuando son obligatorios) ---
const localDataSchemaObligatoria = z.object({
    tipoNegocio: z.string().min(1, 'El tipo de negocio es obligatorio'),
    horarioAtencion: z.string().min(1, 'El horario de atención es obligatorio'),
    descripcionEmpresa: z.string().min(1, 'La descripción de la empresa es obligatoria'),
    // Las estadísticas (totalDonacionesHechas, etc.) NO se validan aquí,
    // ya que se inicializan con defaults en el modelo Mongoose y se actualizan por lógica de la app.
});

// --- Esquema para COMPLETAR PERFIL INICIAL (cuando el rol es null y se establece por primera vez) ---
export const completeInitialProfileSchema = z.discriminatedUnion("rol", [
    z.object({
        rol: z.literal("GENERAL"),
        nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").optional(), // Puede venir de Clerk o ser actualizado aquí
        telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono no es válido (7-15 dígitos)').optional().nullable(), // Opcional para GENERAL
        ubicacion: ubicacionSchemaObligatoria, // ubicacionSchemaObligatoria requiere todos sus campos
        fotoDePerfilUrl: z.string().url("URL de foto inválida").optional().nullable(),
    }),
    z.object({
        rol: z.literal("LOCAL"),
        nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
        telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono es obligatorio y debe tener entre 7-15 dígitos'), // Obligatorio para LOCAL
        ubicacion: ubicacionSchemaObligatoria, // ubicacionSchemaObligatoria requiere todos sus campos
        fotoDePerfilUrl: z.string().url("URL de foto inválida").optional().nullable(),
        localData: localDataSchemaObligatoria, // localDataSchemaObligatoria y sus campos son obligatorios para LOCAL
    })
    // No se permite establecer roles de ADMIN/MODERADOR a través de este flujo de usuario.
]);

// --- Esquema para ACTUALIZACIONES PARCIALES (cuando el rol ya está establecido) ---
const ubicacionUpdateSchema = ubicacionSchemaObligatoria.deepPartial(); // Hace todos los campos de ubicación opcionales
const localDataUpdateSchema = localDataSchemaObligatoria.deepPartial(); // Hace todos los campos de localData opcionales

export const updateUserSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
    telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono no es válido (7-15 dígitos)').optional().nullable(),
    ubicacion: ubicacionUpdateSchema.optional(), // Permite actualizar partes de la ubicación o no enviarla
    fotoDePerfilUrl: z.string().url("URL de foto inválida").optional().nullable(),
    rol: z.enum(['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN']).optional(), 
    localData: localDataUpdateSchema.optional(), 
    localData: localDataUpdateSchema.optional(), // Permite actualizar partes de localData o no enviarlo
});

// --- Tu createUserSchema (revisar su uso actual, ya que webhooks manejan la creación inicial del registro básico) ---
// Si este schema es para que un ADMIN cree un usuario completo desde cero, necesitaría ser más robusto,
// posiblemente también un discriminatedUnion por 'rol' para datos obligatorios.
// Por ahora, lo dejamos como lo tenías, pero ten en cuenta su propósito.
const estadisticasGeneralesSchema = z.object({ // Lo necesitas si createUserSchema lo usa
    totalDonacionesHechas: z.number().min(0).default(0),
    calificacionPromedioComoDonante: z.number().min(0).max(5).nullable().default(null),
    numeroCalificacionesComoDonante: z.number().min(0).default(0),
    calificacionPromedioComoReceptor: z.number().min(0).max(5).nullable().default(null),
    totalDonacionesRecibidas: z.number().min(0).default(0),
    numeroCalificacionesComoReceptor: z.number().min(0).default(0)
});

const permisosSchema = z.object({ // Lo necesitas si createUserSchema lo usa
    puedeSuspenderUsuarios: z.boolean().default(false),
    puedeEliminarPublicaciones: z.boolean().default(false),
    puedeGestionarReportes: z.boolean().default(false),
    puedeGestionarRoles: z.boolean().default(false),
    puedeAccederEstadisticasGlobales: z.boolean().default(false),
});


export const createUserSchema = z.object({
  clerkUserId: z.string().nonempty('El ID de Clerk es obligatorio'),
  email: z.string().email('El email no es válido'),
  nombre: z.string().min(3).optional(), // Ya debería venir del webhook, pero puede ser para creación manual
  rol: z.enum(['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN']).nullable().default(null),
  activo: z.boolean().default(true),
  // Para creación directa, estos serían opcionales porque el pre('save') los maneja si el rol se setea
  estadisticasGenerales: estadisticasGeneralesSchema.optional().nullable(),
  localData: localDataSchemaObligatoria.deepPartial().optional().nullable(), // Si es local, los datos podrían ser obligatorios
  ubicacion: ubicacionSchemaObligatoria.optional().nullable(), // Si tiene rol, la ubicación es obligatoria
  telefono: z.string().regex(/^\d{7,15}$/, 'El número de teléfono debe contener entre 7 y 15 dígitos').optional().nullable(),
  permisos: permisosSchema.optional().nullable(),
  fotoDePerfilUrl: z.string().url().optional().nullable(),
});