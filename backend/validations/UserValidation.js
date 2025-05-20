import {z}  from 'zod';

//validaciones para la ubicacion
const ubicacionSchema = z.object({
    direccion: z.string().nonempty('La dirección es obligatoria'),
    ciudad: z.string().nonempty('La ciudad es obligatoria'),
    provincia:z.string().nonempty('La provincia es obligatoria'),
    pais: z.string().nonempty('El país es obligatorio'),
});

//validaciones para estadisticas generales
const estadisticasGeneralesSchema = z.object({
    totalDonacionesHechas: z.number().min(0).default(0),
    calificacionPromedioComoDonante:z.number().nullable().min(0).max(5),
    numeroCalificacionesComoDonante: z.number().min(0).default(0),
    calificacionPromedioComoReceptor: z.number().nullable(),
    totalDonacionesRecibidas: z.number().min(0).default(0),
    numeroCalificacionesComoReceptor: z.number().min(0).default(0)
});

//validaciones para datos de locales
const localSchema= z.object({
    tipoNegocio: z.string().nonempty('El tipo de negocio es obligatorio'),
    horarioAtencion: z.string().nonempty('El horario de atención es obligatorio'),
    descripcionEmpresa: z.string().nonempty('La descripción de la empresa es obligatoria'),
    totalDonacionesHechas: z.number().min(0).default(0),
    calificacionPromedioComoDonante: z.number().min(0).default(0),
});

//validaciones para permisos de ADMIN y MODERADOR
const permisosSchema = z.object({
    puedeSuspenderUsuarios: z.boolean().default(false),
    puedeEliminarPublicaciones: z.boolean().default(false),
    puedeGestionarReportes:z.boolean().default(false),
    puedeGestionarRoles: z.boolean().default(false),
    puedeAccederEstadisticasGlobales: z.boolean().default(false),
})

//validación principasl del usuario
export const userValidationSchema = z.object({
    clerkUserId: z.string().nonempty('El ID de Clerk es obligatorio'),
    nombre: z.string().nonempty('El nombre es obligatorio'),
    email:z.string().email('El email es obligatorio'),
    telefono:z.string().optional().nullable(),
    ubicacion:ubicacionSchema.optional(),
    fotoDePerfilUrl: z.string().url().optional().nullable(),
    rol: z.enum(['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN']),
    activo:z.boolean().default(true),
    fechaSuspension: z.string().nullable().optional(),
    motivoSuspension: z.string().nullable().optional(),
    localData:localSchema.optional().nullable(),
    estadisticasGenerales:estadisticasGeneralesSchema.optional().nullable(),
    permisos: permisosSchema.optional().nullable(),
}).superRefine((data, ctx)=>{

    if (data.rol === 'LOCAL') {
        if (!data.telefono || data.telefono.trim() === '') {
          ctx.addIssue({
            path: ['telefono'],
            code: z.ZodIssueCode.custom,
            message: 'El telefono es obligatorio para usuario LOCAL'
          });
        }
        if (!data.localData) {
            ctx.addIssue({
                path:['localData'],
                code: z.ZodIssueCode.custom,
                message:'localData es obligatorio para usuario LOCAL'
            });
        }
    }
    if (!data.ubicacion) {
        ctx.addIssue({
            path:['ubicacion'],
            code:z.ZodIssueCode.custom,
            message:'La ubicacion es obligatoria',
        });
    }

    if (data.rol === 'GENERAL' && !data.estadisticasGenerales) {
        ctx.addIssue({
            path: ['estadisticasGenerales'],
            code: z.ZodIssueCode.custom,
            message:'Las estadísticas generalems son obligatorias para usuario GENERAL'
        });
    }

    if ((data.rol === 'ADMIN' || data.rol === 'MODERADOR') && !data.permisos) {
        ctx.addIssue({
            path:['permisos'],
            code:z.ZodIssueCode.custom,
            message:'Los permisos son obligatorios para MODERADOR Y ADMIN'
        });
    }

});
export const updateUserSchema = userValidationSchema
  .partial() // Convierte todos los campos a opcionales
  .superRefine((data, ctx) => {
    if (data.rol === 'LOCAL') {
      if (data.localData && (!data.telefono || data.telefono.trim() === '')) {
        ctx.addIssue({
          path: ['telefono'],
          code: z.ZodIssueCode.custom,
          message: 'El teléfono es obligatorio si el usuario es LOCAL',
        });
      }
    }

    if (data.rol === 'GENERAL' && data.estadisticasGenerales === null) {
      ctx.addIssue({
        path: ['estadisticasGenerales'],
        code: z.ZodIssueCode.custom,
        message:
          'Las estadísticas generales son obligatorias para usuario GENERAL',
      });
    }

    if (
      (data.rol === 'ADMIN' || data.rol === 'MODERADOR') &&
      data.permisos === null
    ) {
      ctx.addIssue({
        path: ['permisos'],
        code: z.ZodIssueCode.custom,
        message:
          'Los permisos son obligatorios para usuarios ADMIN o MODERADOR',
      });
    }
  });