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
    <article className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Imagen */}
      <div className="w-full aspect-square sm:aspect-[4/3] bg-gray-50">
        <img
          src={img}
          alt={titulo}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
            {titulo}
          </h3>
          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">
            {estadoPublicacion}
          </span>
        </div>

        {categoria && (
          <p className="text-xs text-gray-500">Categoría: {categoria}</p>
        )}

        {descripcion && (
          <p className="text-sm text-gray-700 line-clamp-2">{descripcion}</p>
        )}

        {(dir || ciudadProv) && (
          <p className="text-xs text-gray-500">
            Retiro: {dir}
            {dir && ciudadProv ? ' · ' : ''}
            {ciudadProv}
          </p>
        )}

        <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <span>Elaboración: {fmt(fechaElaboracion)}</span>
          <span>Vence: {fmt(fechaVencimientoProducto)}</span>
        </div>

        {/* Botón eliminar (solo visual por ahora) */}
        <div className="mt-3 flex justify-end">
          <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
};

export default CardDonacion;
