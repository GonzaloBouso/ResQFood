import DropdownSolicitudes from './DropdownSolicitudes';
import SolicitudAceptada from './SolicitudAceptada';

import React from 'react';

const CardDonacion = ({ donacion }) => {
  const {
    titulo,
    descripcion,
    imagenesUrl = [],
    categoria,
    estadoPublicacion,
    ubicacionRetiro,
    fechaVencimientoProducto,
    fechaElaboracion,
    solicitudesCount, // opcional: si lo tenés en el DTO
  } = donacion || {};

  const img = imagenesUrl[0] || '/placeholder.png';
  const dir = ubicacionRetiro?.direccion || '';
  const ciudadProv = [ubicacionRetiro?.ciudad, ubicacionRetiro?.provincia]
    .filter(Boolean)
    .join(', ');
  const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '—');

  return (
    <article className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* Fila completa en desktop; en móvil se apila */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Imagen cuadrada */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 shrink-0">
          <img src={img} alt={titulo} className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900 truncate">
              {titulo}
            </h3>
            {/* Badge de estado (opcional) */}
            {estadoPublicacion && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">
                {estadoPublicacion}
              </span>
            )}
          </div>

          {categoria && (
            <p className="text-sm text-gray-500">Categoría: {categoria}</p>
          )}

          {descripcion && (
            <p className="text-sm text-gray-700 truncate">
              {descripcion}
            </p>
          )}

          {(dir || ciudadProv) && (
            <p className="text-xs text-gray-500">
              Retiro: {dir}{dir && ciudadProv ? ' · ' : ''}{ciudadProv}
            </p>
          )}

          <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <span>Elaboración: {fmt(fechaElaboracion)}</span>
            <span>Vence: {fmt(fechaVencimientoProducto)}</span>
          </div>

          {typeof solicitudesCount === 'number' && (
            <p className="mt-2 text-sm text-gray-700">
              Lista de solicitudes ({solicitudesCount})
            </p>
          )}
        </div>

        {/* Botón eliminar a la derecha */}
        <div className="sm:self-stretch flex sm:items-center">
          <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
};

export default CardDonacion;
