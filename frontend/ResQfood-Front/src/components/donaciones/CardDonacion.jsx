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
  } = donacion || {};

  const img = imagenesUrl[0] || '/placeholder.png';
  const dir = ubicacionRetiro?.direccion || '';
  const ciudadProv = [ubicacionRetiro?.ciudad, ubicacionRetiro?.provincia]
    .filter(Boolean)
    .join(', ');
  const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '—');

  return (
    <article className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Imagen */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 shrink-0">
          <img src={img} alt={titulo} className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Contenido central en dos columnas */}
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
          {/* Columna izquierda */}
          <div>
            
            <h3 className="font-semibold text-gray-900">{titulo}</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 mb-2">
              {estadoPublicacion}
            </span>
            {categoria && (
              <p className="text-sm text-gray-500">Categoría: {categoria}</p>
            )}
            {descripcion && (
              <p className="text-sm text-gray-700">{descripcion}</p>
            )}
            {(dir || ciudadProv) && (
              <p className="text-xs text-gray-500">
                Retiro: {dir}{dir && ciudadProv ? ' · ' : ''}{ciudadProv}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Elaboración: {fmt(fechaElaboracion)}
            </p>
            <p className="text-xs text-gray-500">
              Vence: {fmt(fechaVencimientoProducto)}
            </p>
          </div>
        </div>

        {/* Botón eliminar */}
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
