export const bitacora = [
  {
    _id: "b1",
    actorId: "admin1",
    accion: "Eliminación de usuario",
    tipoElementoAfectado: "User",
    elementoAfectadoId: "u1",
    justificacionOMotivo: "Conducta ofensiva",
    detallesAdicionales: { nombreUsuario: "Juan Pérez" },
    createdAt: "2025-07-15T14:00:00Z"
  },
  {
    _id: "b2",
    actorId: "admin1",
    accion: "Eliminación de publicación",
    tipoElementoAfectado: "Donacion",
    elementoAfectadoId: "pub1",
    justificacionOMotivo: "Publicación con contenido falso",
    detallesAdicionales: { titulo: "Pan en mal estado" },
    createdAt: "2025-07-14T18:30:00Z"
  }
];
