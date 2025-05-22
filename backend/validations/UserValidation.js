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
    calificacionPromedioComoDonante: z.number().min(0).max(5).nullable(),
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
}).refine(data => data.tipoNegocio && data.horarioAtencion && data.descripcionEmpresa, {
  message:'Todos los campos de datos del local son obligatorios'
})

//validaciones para permisos de ADMIN y MODERADOR
const permisosSchema = z.object({
    puedeSuspenderUsuarios: z.boolean().default(false),
    puedeEliminarPublicaciones: z.boolean().default(false),
    puedeGestionarReportes:z.boolean().default(false),
    puedeGestionarRoles: z.boolean().default(false),
    puedeAccederEstadisticasGlobales: z.boolean().default(false),
})

//validación principasl del usuario
export const createUserSchema = z.object({
  clerkUserId: z.string().nonempty('El ID de Clerk es obligatorio'),
  email: z.string().email('El email no es válido'),
  rol: z.enum(['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN']).nullable().default(null),
  activo: z.boolean().default(true),
  estadisticasGenerales: estadisticasGeneralesSchema.optional().nullable(),
  localData: localSchema.optional().nullable(),
  ubicacion: ubicacionSchema.optional().nullable()

});


export const updateUserSchema = z.object({
  nombre: z.string().nonempty('El nombre es obligatorio').optional(),

  telefono: z.string().regex(/^\d{7,15}$/, 'El número de teléfono debe contener entre 7 y 15 dígitos').optional().nullable(),

  ubicacion: ubicacionSchema.optional(),
  rol:z.enum(['GENERAL', 'LOCAL', 'MODERADOR', 'ADMIN']).optional(),
  localData:localSchema.optional().nullable(),
  estadisticasGenerales: estadisticasGeneralesSchema.optional().nullable(),
  permisos: permisosSchema.optional().nullable(),
})
.superRefine((data, ctx) => {
    // Validaciones adicionales basadas en el rol
    if (!data.rol) return;

    if (data.rol === 'LOCAL') {
      const errores = [];
      if (!data.telefono || data.telefono.trim() === '') {
        errores.push('El teléfono es obligatorio para usuarios LOCAL.');
      }
      if (!data.ubicacion) {
        errores.push('La ubicación es obligatoria para usuarios LOCAL.');
      }
      if (!data.localData) {
        errores.push('Los datos del local son obligatorios.');
      }
      if (errores.length > 0) {
        ctx.addIssue({
          path: ['local'],
          code: z.ZodIssueCode.custom,
          message: errores.join(' '),
        });
      }
    }

    if (data.rol === 'GENERAL' && data.estadisticasGenerales === null) {
      ctx.addIssue({
        path: ['estadisticasGenerales'],
        code: z.ZodIssueCode.custom,
        message: 'Las estadísticas generales son obligatorias para usuarios GENERAL.',
      });
    }

    if ((data.rol === 'ADMIN' || data.rol === 'MODERADOR') && data.permisos === null) {
      ctx.addIssue({
        path: ['permisos'],
        code: z.ZodIssueCode.custom,
        message: 'Los permisos son obligatorios para usuarios ADMIN o MODERADOR.',
      });
    }
  });

  