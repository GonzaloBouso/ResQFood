import DropdownSolicitudes from './DropdownSolicitudes';
import SolicitudAceptada from './SolicitudAceptada';

import React from 'react';

const CardDonacion = ({ donacion, onEliminar }) => {
  const {
    _id,
    titulo,
    descripcion,
    imagenesUrl = [],
    categoria,
    estadoPublicacion,
    ubicacionRetiro,
    fechaVencimientoProducto,
    fechaElaboracion,
  } = donacion || {};

  const img = imagenesUrl[0] || '/placeholder.png';
  const dir = ubicacionRetiro?.direccion || '';
  const ciudadProv = [ubicacionRetiro?.ciudad, ubicacionRetiro?.provincia]
    .filter(Boolean)
    .join(', ');
  const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '—');

  return (
    <article className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="p-4 flex flex-col sm:flex-row items-start gap-4">
        {/* Imagen */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 shrink-0">
          <img src={img} alt={titulo} className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Toda la data junta y ordenada */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{titulo}</h3>
            {estadoPublicacion && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {estadoPublicacion}
              </span>
            )}
          </div>

          {categoria && <p className="text-xs text-gray-500">Categoría: {categoria}</p>}
          {descripcion && <p className="text-sm text-gray-700 line-clamp-2 md:line-clamp-3">{descripcion}</p>}

          {(dir || ciudadProv) && (
            <p className="text-xs text-gray-500">
              Retiro: {dir}{dir && ciudadProv ? ' · ' : ''}{ciudadProv}
            </p>
          )}

          <div className="flex flex-wrap gap-x-6 text-xs text-gray-500 pt-1">
            <span>Elaboración: {fmt(fechaElaboracion)}</span>
            <span>Vence: {fmt(fechaVencimientoProducto)}</span>
          </div>
        </div>

        {/* Botón eliminar */}
        <div className="sm:ml-auto">
          <button
            onClick={() => onEliminar?.(_id)}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
};

export default CardDonacion;
